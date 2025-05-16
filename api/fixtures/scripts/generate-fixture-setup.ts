import { resolve, dirname, relative } from 'path';
import { readFileSync, writeFileSync } from 'fs';

if (require.main === module) {
  const indexTsFilePath = resolve(__dirname, '../../index.ts');
  const outputPath = resolve(__dirname, '../merged-fixtures.fixture.ts');

  const indexFileContent = readFileSync(indexTsFilePath, 'utf-8');
  const indexFileRows = indexFileContent.split('\n');

  const imports: string[] = [];
  const fixtureVars: string[] = [];

  for (let row of indexFileRows) {
    const regex = /export \* from "(.*)";/;
    const match = row.match(regex);
    if (!match) continue;

    const relativePath = match[1];

    if (relativePath.endsWith('all-fixtures.fixture.ts')) continue;

    let absolutePath = resolve(dirname(indexTsFilePath), relativePath);
    if (!absolutePath.endsWith('.ts')) {
      absolutePath += '.ts';
    }

    const fileContent = readFileSync(absolutePath, 'utf-8');

    const fixtureVarRegex = /\b(?:const|let|var)\s+(\w*(?:Fixture|Fixtures))\b/g;
    let matchVar: RegExpExecArray | null;

    while ((matchVar = fixtureVarRegex.exec(fileContent)) !== null) {
      const varName = matchVar[1];

      const importPathRelativeToOutput = relative(dirname(outputPath), absolutePath)
        .replace(/\.ts$/, '') // Remove file extension
        .replace(/\\/g, '/'); // Normalize for cross-platform compatibility

      imports.push(`import { ${varName} } from "./${importPathRelativeToOutput}";`);
      fixtureVars.push(varName);
    }
  }

  const outputContent = `import { mergeTests as mergeMultipleFixtures } from "@playwright/test";

${imports.join('\n')}

export const test = mergeMultipleFixtures(
  ${fixtureVars.join(',\n  ')}
);`;

  writeFileSync(outputPath, outputContent);
  console.log(`✅ Generated ${outputPath}`);
}
