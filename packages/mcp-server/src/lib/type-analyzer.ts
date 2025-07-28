import path from "path"
import fg from "fast-glob"
import {
  IntersectionTypeNode,
  ObjectLiteralExpression,
  ParenthesizedTypeNode,
  Project,
  PropertySignature,
  SourceFile,
  SyntaxKind,
  TypeAliasDeclaration,
  TypeChecker,
  TypeLiteralNode,
  TypeNode,
  TypeReferenceNode,
  UnionTypeNode,
  VariableDeclaration,
} from "ts-morph"
import { z } from "zod"

import { ComponentTypeInfoSchema, TypeInfoSchema } from "./schemas"

export type ComponentTypeInfo = z.infer<typeof ComponentTypeInfoSchema>
export type TypeInfo = z.infer<typeof TypeInfoSchema>

export class TypeAnalyzer {
  private componentsPath: string
  private project: Project
  private typeChecker: TypeChecker

  constructor(componentsPath: string) {
    this.componentsPath = componentsPath
    this.project = new Project({
      tsConfigFilePath: path.join(componentsPath, "tsconfig.json"),
      skipAddingFilesFromTsConfig: false,
    })
    this.typeChecker = this.project.getTypeChecker()
  }

  async extractComponentTypes(componentName: string): Promise<ComponentTypeInfo | null> {
    try {
      const sourceFiles = await this.findComponentSourceFiles(componentName)

      if (sourceFiles.length === 0) {
        return null
      }

      const mainSourceFile = this.project.getSourceFile(sourceFiles[0])
      if (!mainSourceFile) {
        return null
      }

      return this.analyzeComponentFile(mainSourceFile, componentName)
    } catch (error) {
      console.warn(`Failed to extract types for ${componentName}:`, error)
      return null
    }
  }

  private async findComponentSourceFiles(componentName: string): Promise<string[]> {
    const patterns = [`src/components/ui/**/${componentName}.tsx`]

    return await fg(patterns, {
      cwd: this.componentsPath,
      absolute: true,
      caseSensitiveMatch: false,
    })
  }

  /**
   * 소스 파일 내에서 [componentName]...Props 패턴과 일치하는 모든 타입(인터페이스 및 타입 별칭)을
   * 분석하여 ComponentTypeInfo 객체의 배열로 반환합니다.
   * @param sourceFile 분석할 소스 파일
   * @param componentName 기준이 되는 컴포넌트 이름 (prefix)
   * @returns 분석된 ComponentTypeInfo 객체의 배열
   */
  private analyzeComponentFile(sourceFile: SourceFile, componentName: string): ComponentTypeInfo {
    const result: ComponentTypeInfo = {
      componentName,
      propsInfo: undefined,
      refType: undefined,
      exports: [],
      dependencies: [],
      types: {}, // types 필드 초기화
    }

    const propsTypeName = `${componentName}Props`

    // --- 1. 주요 Props 타입 분석 (기존 로직) ---
    const propsInterface = sourceFile.getInterface(propsTypeName)
    if (propsInterface) {
      result.propsInfo = this.analyzeInterface(propsInterface)
    } else {
      const propsTypeAlias = sourceFile.getTypeAlias(propsTypeName)
      if (propsTypeAlias) {
        result.propsInfo = this.analyzeTypeAlias(propsTypeAlias)
      }
    }

    // --- 2. refType, exports, dependencies 분석 (기존 로직) ---
    result.refType = this.extractRefType(sourceFile, componentName)
    result.exports = this.analyzeExports(sourceFile)
    result.dependencies = this.analyzeDependencies(sourceFile)

    // --- 3. 소스 파일 내 모든 타입 분석 (신규 로직) ---
    const allTypesInFile: Record<string, PropertyOrGroup[]> = {}

    // 모든 인터페이스를 순회하며 분석
    const interfaces = sourceFile.getInterfaces()
    for (const iface of interfaces) {
      // 이미 propsInfo로 분석된 타입은 건너뛸 수 있습니다 (선택적 최적화)
      // if (iface.getName() === propsTypeName) continue;

      const typeInfo = this.analyzeInterface(iface)
      if (typeInfo.properties && typeInfo.properties.length > 0) {
        allTypesInFile[typeInfo.name] = typeInfo.properties
      }
    }

    // 모든 타입 별칭(type alias)을 순회하며 분석
    const typeAliases = sourceFile.getTypeAliases()
    for (const typeAlias of typeAliases) {
      // if (typeAlias.getName() === propsTypeName) continue;

      const typeInfo = this.analyzeTypeAlias(typeAlias)
      if (typeInfo.properties && typeInfo.properties.length > 0) {
        allTypesInFile[typeInfo.name] = typeInfo.properties
      }
    }

    // 분석된 모든 타입 정보를 최종 결과에 할당
    result.types = allTypesInFile

    return result
  }

  private analyzeInterface(interfaceDeclaration: any): TypeInfo {
    const typeInfo: TypeInfo = {
      name: interfaceDeclaration.getName(),
      kind: "interface",
      properties: [],
      methods: [],
      // 상속 정보를 extendsFrom 배열에 저장합니다.
      extendsFrom: interfaceDeclaration.getExtends().map((e) => e.getText()),
      genericParameters: interfaceDeclaration.getTypeParameters().map((tp) => tp.getText()),
    }

    // Generic parameters 추출
    const typeParameters = interfaceDeclaration.getTypeParameters()
    typeInfo.genericParameters = typeParameters.map((tp: any) => tp.getName())

    // Heritage clauses (extends) 추출
    const heritage = interfaceDeclaration.getExtends()
    if (heritage.length > 0) {
      typeInfo.extendsFrom = heritage.map((h: any) => h.getExpression().getText())
    }

    // Properties 분석
    const properties = interfaceDeclaration.getProperties()
    for (const prop of properties) {
      // 속성 분석 로직을 헬퍼 함수로 추출하여 재사용
      typeInfo.properties!.push(this._analyzeProperty(prop))
    }

    // Methods 분석
    const methods = interfaceDeclaration.getMethods()
    typeInfo.methods = []

    for (const method of methods) {
      const methodInfo = {
        name: method.getName(),
        parameters: method.getParameters().map((param: any) => ({
          name: param.getName(),
          type: param.getType().getText(),
          optional: param.hasQuestionToken(),
        })),
        returnType: method.getReturnType().getText(),
        description: this.extractJSDocDescription(method),
      }

      typeInfo.methods.push(methodInfo)
    }

    return typeInfo
  }

  /**
   * 속성(PropertySignature 또는 PropertySymbol)을 분석하여 TypeInfo 객체를 생성합니다.
   * 유니온 타입 처리를 포함합니다.
   */
  private _analyzeProperty(prop: PropertySignature | symbol): TypeInfo {
    const name = prop.getName()
    const isOptional = prop.hasQuestionToken ? prop.hasQuestionToken() : (prop as symbol).isOptional()
    const description = this.extractJSDocDescription(prop)
    const propTypeNode = prop.getTypeNode ? prop.getTypeNode() : undefined

    // 속성의 타입이 유니온 타입인 경우
    if (propTypeNode?.isKind(SyntaxKind.UnionType)) {
      const unionMembers = propTypeNode.getTypeNodes()

      // 모든 멤버가 리터럴 타입인지 확인
      const allAreLiterals = unionMembers.every((node) => node.isKind(SyntaxKind.LiteralType))

      if (allAreLiterals) {
        return {
          name,
          type: unionMembers.map((node) => node.getText()).join(" | "),
          optional: isOptional,
          description,
        }
      } else {
        // 복합 유니온 타입 처리
        const unionProperties: TypeInfo[] = []
        for (const memberNode of unionMembers) {
          if (memberNode.isKind(SyntaxKind.TypeLiteral)) {
            // 멤버가 객체 리터럴인 경우, 그 속성들을 추출하여 추가
            const nestedResult: { properties: TypeInfo[]; extendsFrom: string[] } = {
              properties: [],
              extendsFrom: [],
            }
            this._extractPropertiesAndGroups(memberNode, nestedResult)
            unionProperties.push(...nestedResult.properties)
          } else {
            // 그 외 타입(참조, 기본 타입 등)은 텍스트로 표현
            unionProperties.push({
              name: "", // 유니온 멤버는 이름이 없음
              type: memberNode.getText(),
              optional: false,
              description: "",
            })
          }
        }
        return {
          name,
          type: { union: unionProperties },
          optional: isOptional,
          description,
        }
      }
    }

    // 일반 타입인 경우
    return {
      name,
      type: prop.getType().getText(),
      optional: isOptional,
      description,
    }
  }

  /**
   * cva로 생성된 상수(VariableDeclaration)를 분석하여 VariantProps 속성을 추출합니다.
   * @param declaration 분석할 변수 선언 노드
   * @returns 추출된 속성 배열
   */
  private _analyzeCvaConstant(declaration: VariableDeclaration): NamedProperty[] {
    const callExpression = declaration.getInitializerIfKind(SyntaxKind.CallExpression)

    // cva() 호출의 두 번째 인자(설정 객체)를 찾습니다. (인덱스 1로 수정)
    const configObject = callExpression?.getArguments()[1]?.asKind(SyntaxKind.ObjectLiteralExpression)

    if (!configObject) {
      return []
    }

    // 설정 객체에서 'variants' 속성을 찾습니다.
    const variantsProperty = configObject.getProperty("variants")?.asKind(SyntaxKind.PropertyAssignment)
    const variantsObject = variantsProperty?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression)

    if (variantsObject) {
      // 새로 만든 재귀 헬퍼 함수를 호출하여 variants 객체를 분석합니다.
      return this._analyzeVariantObject(variantsObject)
    }

    return []
  }

  /**
   * variants 객체 리터럴을 재귀적으로 분석하여 모든 속성을 추출합니다.
   * 스프레드 구문(...)을 처리하는 로직을 포함합니다.
   * @param objectLiteral 분석할 variants 객체 리터럴 노드
   * @returns 추출된 모든 속성 배열
   */
  private _analyzeVariantObject(objectLiteral: ObjectLiteralExpression): NamedProperty[] {
    const properties: NamedProperty[] = []

    for (const prop of objectLiteral.getProperties()) {
      // 케이스 1: 일반 속성 할당 (e.g., size: { ... })
      if (prop.isKind(SyntaxKind.PropertyAssignment)) {
        const propName = prop.getName()
        const optionsObject = prop.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression)

        if (optionsObject) {
          const optionKeys = optionsObject
            .getProperties()
            .map((p) => p.asKind(SyntaxKind.PropertyAssignment)?.getNameNode().getText())
            .filter(Boolean) as string[]

          properties.push({
            name: propName,
            type: optionKeys.length > 0 ? optionKeys.join(" | ") : "string",
            optional: true, // VariantProps는 기본적으로 optional
            description: `${propName} variant options`,
          })
        }
      }
      // 케이스 2: 스프레드 구문 (e.g., ...buttonVariantsConfig)
      else if (prop.isKind(SyntaxKind.SpreadAssignment)) {
        const spreadIdentifier = prop.getExpression().asKind(SyntaxKind.Identifier)
        if (spreadIdentifier) {
          const spreadConstantName = spreadIdentifier.getText()
          const sourceFile = prop.getSourceFile()

          // 스프레드된 변수의 선언을 찾습니다.
          const variableDecl = sourceFile.getVariableDeclaration(spreadConstantName)
          const initializer = variableDecl?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression)

          if (initializer) {
            // 재귀 호출을 통해 스프레드된 객체를 분석하고 결과를 병합합니다.
            const spreadProperties = this._analyzeVariantObject(initializer)
            properties.push(...spreadProperties)
          }
        }
      }
    }

    return properties
  }

  /**
   * 타입 노드를 재귀적으로 분석하여 속성 및 그룹의 구조화된 배열을 반환하고,
   * 상속 정보는 extendsFrom 배열에 누적합니다.
   * @param node 분석할 타입 노드
   * @param extendsFrom 상속 정보를 누적할 배열
   * @returns 분석된 속성 및 그룹의 배열
   */
  private _extractPropertiesAndGroups(node: TypeNode, extendsFrom: string[]): PropertyOrGroup[] {
    switch (node.getKind()) {
      // 케이스 1: 객체 리터럴 -> NamedProperty 배열로 변환하여 반환
      case SyntaxKind.TypeLiteral: {
        const members = (node as TypeLiteralNode)
          .getMembers()
          .filter((member): member is PropertySignature => member.isKind(SyntaxKind.PropertySignature))
        return members.map((prop) => ({
          name: prop.getName(),
          type: prop.getType().getText(),
          optional: prop.hasQuestionToken(),
          description: this.extractJSDocDescription(prop),
        }))
      }

      // 케이스 2: Union 타입 -> { union: [...] } 그룹으로 묶어 반환
      case SyntaxKind.UnionType: {
        const unionMembers: PropertyOrGroup[] = []
        for (const childNode of (node as UnionTypeNode).getTypeNodes()) {
          unionMembers.push(...this._extractPropertiesAndGroups(childNode, extendsFrom))
        }
        return [{ union: unionMembers }]
      }

      // 케이스 3: Intersection 타입 -> { intersection: [...] } 그룹으로 묶어 반환
      case SyntaxKind.IntersectionType: {
        const intersectionMembers: PropertyOrGroup[] = []
        const typeNodes = (node as IntersectionTypeNode).getTypeNodes()
        for (const childNode of typeNodes) {
          intersectionMembers.push(...this._extractPropertiesAndGroups(childNode, extendsFrom))
        }
        if (intersectionMembers.length === 1) {
          return intersectionMembers
        }
        return [{ intersection: intersectionMembers }]
      }

      // 케이스 4: 괄호 -> 괄호 내부를 재귀적으로 분석한 결과를 그대로 반환
      case SyntaxKind.ParenthesizedType:
        return this._extractPropertiesAndGroups((node as ParenthesizedTypeNode).getTypeNode(), extendsFrom)

      // 케이스 5: 타입 참조 -> extendsFrom 배열에 추가하고, 빈 배열을 반환
      case SyntaxKind.TypeReference: {
        const typeName = (node as TypeReferenceNode).getFirstChildByKind(SyntaxKind.Identifier)?.getText()

        // --- VariantProps 특별 처리 로직 ---
        if (typeName === "VariantProps") {
          const typeQueryNode = node.getFirstChildByKind(SyntaxKind.TypeQuery) // typeof ...
          if (typeQueryNode) {
            const constantName = typeQueryNode.getExprName().getText() // e.g., "buttonVariants"
            const sourceFile = node.getSourceFile()

            // 소스 파일에서 해당 상수의 선언을 찾습니다.
            const variableDecl = sourceFile.getVariableDeclaration(constantName)
            if (variableDecl) {
              return this._analyzeCvaConstant(variableDecl)
            }
          }
        }

        // VariantProps가 아닌 일반 타입 참조는 상속 정보로 처리
        const text = node.getText()
        if (!extendsFrom.includes(text)) {
          extendsFrom.push(text)
        }
        return []
      }

      // 그 외 타입들 (Fallback)
      default: {
        const defaultText = node.getText()
        if (defaultText && defaultText.length < 100 && !extendsFrom.includes(defaultText)) {
          extendsFrom.push(defaultText)
        }
        return []
      }
    }
  }

  // TypeAnalyzer 클래스 내부

  private analyzeTypeAlias(typeAlias: TypeAliasDeclaration): TypeInfo {
    const typeNode = typeAlias.getTypeNode()

    // 상속 정보를 누적할 배열
    const extendsFrom: string[] = []
    let properties: PropertyOrGroup[] = []

    if (typeNode) {
      // 초기 호출 시 빈 result 객체를 전달합니다.
      properties = this._extractPropertiesAndGroups(typeNode, extendsFrom)
    }

    return {
      name: typeAlias.getName(),
      kind: "type",
      properties,
      extendsFrom,
      genericParameters: typeAlias.getTypeParameters().map((tp) => tp.getText()),
    }
  }

  private extractRefType(sourceFile: SourceFile, componentName: string): string | undefined {
    // forwardRef 패턴을 찾기 위해 CallExpression을 정확히 탐색합니다.
    const forwardRefCalls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)

    for (const call of forwardRefCalls) {
      const expression = call.getExpression()

      // 호출된 표현식이 'forwardRef'인지 확인합니다.
      if (expression.getText().endsWith("forwardRef")) {
        const typeArguments = call.getTypeArguments()

        // forwardRef<HTMLButtonElement, ButtonProps>와 같은 제네릭 타입 인자를 추출합니다.
        if (typeArguments.length > 0) {
          // 보통 첫 번째 타입 인자가 ref의 대상이 되는 DOM 요소 타입입니다.
          // 예: forwardRef<HTMLDivElement, Props> -> "HTMLDivElement" 반환
          return typeArguments[0].getText()
        }
      }
    }

    // fallback: forwardRef 패턴을 찾지 못한 경우, props 인터페이스에서 'ref' 속성을 직접 찾습니다.
    const propsInfo = sourceFile.getInterface(`${componentName}Props`)
    if (propsInfo) {
      const refProp = propsInfo.getProperty("ref")
      if (refProp) {
        // ref prop의 타입 텍스트를 반환합니다.
        // 예: ref?: React.Ref<HTMLDivElement>; -> "React.Ref<HTMLDivElement>" 반환
        return refProp.getType().getText()
      }
    }

    return undefined
  }

  private analyzeExports(sourceFile: SourceFile): Array<{
    name: string
    type: string
    kind: "component" | "hook" | "type" | "constant"
  }> {
    const exports: Array<{
      name: string
      type: string
      kind: "component" | "hook" | "type" | "constant"
    }> = []

    const handleExport = (name: string, declaration: any) => {
      if (exports.some((exp) => exp.name === name)) return

      const symbol = declaration.getSymbol()
      if (symbol) {
        // getType() 메소드를 사용하여 선언 노드에서 직접 타입을 가져옵니다.
        const type = declaration.getType()
        exports.push({
          name,
          // type 객체의 getText() 메소드를 사용하여 문자열로 변환합니다.
          type: type.getText(),
          kind: this.determineExportKind(name, type),
        })
      }
    }

    // Named exports 분석
    sourceFile.getExportDeclarations().forEach((exportDecl) => {
      exportDecl.getNamedExports().forEach((namedExport) => {
        handleExport(namedExport.getName(), namedExport)
      })
    })

    // 직접 export된 선언들 분석 (export function, export const 등)
    sourceFile.getExportedDeclarations().forEach((declarations, name) => {
      declarations.forEach((declaration) => {
        handleExport(name, declaration)
      })
    })

    return exports
  }

  // determineExportKind 메소드는 이제 타입 객체를 직접 받습니다.
  private determineExportKind(name: string, type: import("ts-morph").Type): "component" | "hook" | "type" | "constant" {
    // 여기서 getText()를 호출하여 타입 문자열을 얻습니다.
    const typeString = type.getText()

    // Hook 패턴 (use 로 시작)
    if (name.startsWith("use")) {
      return "hook"
    }

    // React 컴포넌트 패턴
    if (typeString.includes("React.") || typeString.includes("JSX.Element") || typeString.includes("ReactElement")) {
      return "component"
    }

    // 타입 또는 인터페이스인 경우 (타입의 텍스트가 이름과 같음)
    if (type.isInterface() || type.isTypeParameter() || typeString === name) {
      return "type"
    }

    return "constant"
  }

  private analyzeDependencies(sourceFile: SourceFile): string[] {
    const dependencies: string[] = []

    // Import declarations 분석
    const importDeclarations = sourceFile.getImportDeclarations()
    for (const importDecl of importDeclarations) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue()
      if (moduleSpecifier && !moduleSpecifier.startsWith(".")) {
        dependencies.push(moduleSpecifier)
      }
    }

    return Array.from(new Set(dependencies)) // 중복 제거
  }

  private extractJSDocDescription(node: any): string | undefined {
    const jsDocs = node.getJsDocs()
    if (jsDocs.length === 0) return undefined

    const description = jsDocs.map((it) => it.getDescription()).join("\n\n")
    return description || undefined
  }

  /**
   * 프로젝트 내의 모든 컴포넌트 파일을 스캔하고, 각 파일에서 분석된
   * ComponentTypeInfo 배열을 맵 형태로 반환합니다.
   * @returns 컴포넌트 이름을 키로, ComponentTypeInfo 배열을 값으로 갖는 맵
   */
  async getAllComponentTypes(): Promise<Map<string, ComponentTypeInfo[]>> {
    // 반환 타입의 Map 값이 ComponentTypeInfo[]로 변경되었습니다.
    const typesMap = new Map<string, ComponentTypeInfo[]>()

    try {
      const componentFiles = await fg(
        [
          "src/components/ui/**/*.tsx",
          "!src/components/ui/**/*.stories.*",
          "!src/components/ui/**/*.test.*",
          "!src/components/ui/**/*.spec.*",
        ],
        {
          cwd: this.componentsPath,
          absolute: true,
        }
      )

      for (const file of componentFiles) {
        const sourceFile = this.project.getSourceFile(file)
        if (!sourceFile) continue

        const componentName = this.extractComponentNameFromFile(file)
        if (componentName) {
          // analyzeComponentFile은 이제 배열을 반환합니다.
          const allTypeInfoForFile = this.analyzeComponentFile(sourceFile, componentName)

          // 분석된 결과가 있을 경우에만 맵에 추가합니다.
          if (allTypeInfoForFile.length > 0) {
            typesMap.set(componentName, allTypeInfoForFile)
          }
        }
      }
    } catch (error) {
      console.warn("Failed to get all component types:", error)
    }

    return typesMap
  }

  private extractComponentNameFromFile(filePath: string): string | null {
    const fileName = path.basename(filePath, ".tsx")

    // index 파일인 경우 디렉토리 이름 사용
    if (fileName === "index") {
      return path.basename(path.dirname(filePath))
    }

    return fileName
  }

  async getTypeDefinitions(typeName: string): Promise {
    try {
      const sourceFiles = this.project.getSourceFiles()

      for (const sourceFile of sourceFiles) {
        // 인터페이스 찾기
        const interface_ = sourceFile.getInterface(typeName)
        if (interface_) {
          return this.analyzeInterface(interface_)
        }

        // 타입 별칭 찾기
        const typeAlias = sourceFile.getTypeAlias(typeName)
        if (typeAlias) {
          return this.analyzeTypeAlias(typeAlias)
        }

        // Enum 찾기
        const enum_ = sourceFile.getEnum(typeName)
        if (enum_) {
          return this.analyzeEnum(enum_)
        }
      }

      return null
    } catch (error) {
      console.warn(`Failed to get type definitions for ${typeName}:`, error)
      return null
    }
  }

  private analyzeEnum(enumDeclaration: any): TypeInfo {
    const typeInfo: TypeInfo = {
      name: enumDeclaration.getName(),
      kind: "enum" as const,
      properties: [],
    }

    const members = enumDeclaration.getMembers()
    for (const member of members) {
      const property = {
        name: member.getName(),
        type: "string | number",
        optional: false,
        description: this.extractJSDocDescription(member),
        defaultValue: member.getValue()?.toString(),
      }

      typeInfo.properties!.push(property)
    }

    return typeInfo
  }
}
