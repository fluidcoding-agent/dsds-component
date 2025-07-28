import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';

export interface ComponentInfo {
  name: string;
  content: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
}

export interface Registry {
  [key: string]: ComponentInfo;
}

// GitHub raw URL for your components
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/packages/react/radix-ui/src/components/ui';

// Fallback to local components if available
const COMPONENTS_PATH = path.join(__dirname, '../../components');

export async function getComponentRegistry(): Promise<Registry> {
  const registry: Registry = {};
  
  try {
    // Try to fetch from GitHub first
    const componentsFromGitHub = await fetchComponentsFromGitHub();
    if (Object.keys(componentsFromGitHub).length > 0) {
      return componentsFromGitHub;
    }
    
    // Fallback to local components
    return await getLocalComponents();
  } catch (error) {
    console.error('Failed to load component registry:', error);
    return await getLocalComponents();
  }
}

async function fetchComponentsFromGitHub(): Promise<Registry> {
  const registry: Registry = {};
  
  // List of your components (you can also fetch this dynamically)
  const componentList = [
    'Button.tsx',
    'Card.tsx',
    'Badge.tsx',
    'Checkbox.tsx',
    'Dialog.tsx',
    'Label.tsx',
    'Tabs.tsx',
    'Toast.tsx',
    'Tooltip.tsx',
    'types.ts'
  ];
  
  for (const fileName of componentList) {
    try {
      const url = `${GITHUB_RAW_BASE}/${fileName}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const content = await response.text();
        const componentName = fileName.replace('.tsx', '').toLowerCase();
        
        registry[componentName] = {
          name: fileName.replace('.tsx', ''),
          content,
          dependencies: extractDependencies(content),
        };
      }
    } catch (error) {
      console.warn(`Failed to fetch ${fileName} from GitHub:`, error);
    }
  }
  
  return registry;
}

async function getLocalComponents(): Promise<Registry> {
  const registry: Registry = {};
  
  try {
    if (!(await fs.pathExists(COMPONENTS_PATH))) {
      return registry;
    }
    
    const componentFiles = await fs.readdir(COMPONENTS_PATH);
    
    for (const file of componentFiles) {
      if (file.endsWith('.tsx')) {
        const componentName = file.replace('.tsx', '').toLowerCase();
        const filePath = path.join(COMPONENTS_PATH, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        registry[componentName] = {
          name: file.replace('.tsx', ''),
          content,
          dependencies: extractDependencies(content),
        };
      }
    }
  } catch (error) {
    console.error('Failed to load local components:', error);
  }

  return registry;
}

function extractDependencies(content: string): string[] {
  const dependencies: string[] = [];
  
  // Extract React dependencies
  if (content.includes('import React') || content.includes('from "react"')) {
    dependencies.push('react');
  }
  
  // Extract Radix UI dependencies
  const radixMatches = content.match(/@radix-ui\/[a-z-]+/g);
  if (radixMatches) {
    dependencies.push(...radixMatches);
  }
  
  // Extract other common dependencies
  if (content.includes('lucide-react')) {
    dependencies.push('lucide-react');
  }
  
  if (content.includes('class-variance-authority')) {
    dependencies.push('class-variance-authority');
  }

  return [...new Set(dependencies)];
}