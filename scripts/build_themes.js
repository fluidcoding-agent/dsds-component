import { register } from "@tokens-studio/sd-transforms";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname } from "node:path/posix";
import StyleDictionary from "style-dictionary";

register(StyleDictionary, {
  /* options here if needed */
});

function toKebabCase(str) {
  return str
    .replace(/\(([^)]+)\)/g, "-$1") // (1st) -> -1st
    .replace(/,/g, "-") // commas to dash
    .replace(/[\s_]+/g, "-") // spaces/underscores to dash
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // camelCase to kebab
    .replace(/-+/g, "-") // collapse multiple dashes
    .replace(/^-|-$/g, "") // trim leading/trailing dash
    .toLowerCase();
}

const hexPostfixRegex =
  /([0-9a-f]{4}-[0-9a-f]{2}|[0-9a-f]{2}-[0-9a-f]{2}-[0-9a-f]{2})$/i;

StyleDictionary.registerTransform({
  name: "custom/name/preserve-hex",
  type: "name",
  transitive: true,
  transform: (token) => {
    if (token.$type !== "color") return token.name;
    const last = token.path.at(-1);

    if (!token.path[0].startsWith("Color")) {
      return 'style-' + token.name;
    }

    if (!/[0-9a-f]{6}/i.test(last)) return token.name;

    const lastUntilHex = last.slice(0, -6);
    const hex = last.slice(-6);

    const path = [...token.path.slice(0, -1), lastUntilHex].map(toKebabCase);

    return path.join("-") + "-" + hex.toLowerCase();
  },
});

StyleDictionary.registerTransform({
  name: "custom/name/typo",
  type: "name",
  transitive: true,
  transform: (token) => {
    if (token.$type === "typography") {
      return "typo-" + token.name;
    }
    return token.name;
  },
});

StyleDictionary.registerTransform({
  name: "custom/size/px",
  type: "value",
  transitive: true,
  transform: (token) => {
    if (
      token.$type === "dimension" ||
      ["spacing", "lineheights", "fontsize", "letterspacing"].includes(
        token.path[0].toLowerCase(),
      )
    ) {
      if (!`${token.$value}`.endsWith("px")) {
        return token.$value + "px";
      }
    }
    return token.$value;
  },
});

const getConfig = (
  targetDir = "src/styles/variables",
  themeName = "global",
  excludeTokens,
) => {
  return {
    source:
      themeName === "global"
        ? ["design/generated/tokens/global.json"]
        : ["design/generated/tokens/**/*.json"],
    preprocessors: ["tokens-studio"],
    platforms: {
      css: {
        transformGroup: "tokens-studio",
        transforms: [
          "name/kebab",
          "custom/name/typo",
          "custom/size/px",
          "custom/name/preserve-hex",
        ],
        files: [
          {
            destination: `${targetDir}/${themeName}.css`,
            format: "css/variables",
            filter: (token) => {
              if (!excludeTokens) return true;
              if (excludeTokens.has(token.name)) {
                return false;
              }
              return true;
            },
          },
        ],
      },
    },
  };
};

async function persistTokens(name, tokens) {
  const fileName = `design/generated/tokens/${name}.json`;
  try {
    await mkdir(dirname(fileName), { recursive: true });
  } catch (e) {
    // do nothing, dir already exists
  }
  await writeFile(fileName, JSON.stringify(tokens, null, 2));
}

async function run() {
  const tokens = JSON.parse(await readFile("design/tokens.json", "utf-8"));
  const { $themes, $metadata, ...sets } = tokens;

  const globalTokens = {
    ...tokens["Primitives(Atomic)/light"],
    ...tokens["Foundations(Style)/Foundations(Style)"],
  };

  const lightTokens = {
    ...tokens["Tokens(Color)/light"],
    ...tokens["Tokens(Typo)/default"],
    ...tokens["Tokens(Spacing)/default"],
  };

  await Promise.all([
    persistTokens("global", globalTokens),
    persistTokens("light", lightTokens),
  ]);

  const targetDirs = [
    "design/generated/css",
  ];

  targetDirs.forEach(async (targetDir) => {
    const global = await new StyleDictionary(
      getConfig(targetDir),
    ).buildPlatform("css");

    const globalCssTokens = await global.getPlatformTokens("css");
    const globalTokenNames = new Set(
      globalCssTokens.allTokens.map((it) => it.name),
    );

    await Promise.all([
      new StyleDictionary(
        getConfig(targetDir, "light", globalTokenNames),
      ).buildAllPlatforms(),
    ]);
  });
}

process.on('unhandledRejection', (reason) => {
  if (reason.message && reason.message.startsWith("Error:")) {
    console.warn(reason.message);
  }
});

try {
  await run();
} catch (e) {
  if (e.message.startsWith("Error:")) {
    console.warn(e.message);
  }
}