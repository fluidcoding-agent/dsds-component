import { Config } from './config';

export function transformImports(content: string, config: Config): string {
  let transformedContent = content;

  // Transform component imports
  transformedContent = transformedContent.replace(
    /@\/components/g,
    config.aliases.components
  );

  // Transform utils imports
  transformedContent = transformedContent.replace(
    /@\/lib\/utils/g,
    config.aliases.utils
  );

  // Transform lib imports
  transformedContent = transformedContent.replace(
    /@\/lib/g,
    config.aliases.lib
  );

  // Transform hooks imports
  transformedContent = transformedContent.replace(
    /@\/hooks/g,
    config.aliases.hooks
  );

  return transformedContent;
}