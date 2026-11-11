//? Imports de codigo
import fs from 'fs';
import path from 'path';

//? Imports de usuario
import * as TS_CONFIG from '../../tsconfig.json';

//* Constantes de configuración
const SRC_DIR: string = path.resolve('src');
const PATHS: string[] = Object.keys(TS_CONFIG.compilerOptions.paths).map((key: string) =>
  key.replace('/*', ''),
);

console.info(`\n Paths Absolutos Permitidos: ${PATHS.join(', ')}\n`);

//* Expresión regular para capturar sentencias import/export
const IMPORT_REGEX: RegExp = /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;

function normalizePath(p: string): string {
  return path.resolve(p).replace(/\\/g, '/').toLowerCase();
}

function getTsFiles(dir: string): string[] {
  let results: string[] = [];
  const list: string[] = fs.readdirSync(dir);

  list.forEach((file: string) => {
    const fullPath: string = path.join(dir, file);
    const stat: fs.Stats = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getTsFiles(fullPath));
    } else if (
      file.endsWith('.ts') &&
      !file.endsWith('.spec.ts') &&
      file.toLowerCase() !== 'index.ts' &&
      !file.endsWith('check-imports.script.ts')
    ) {
      results.push(fullPath);
    }
  });

  return results;
}

function validateImports(): void {
  const files: string[] = getTsFiles(SRC_DIR);
  let totalErrors: number = 0;

  files.forEach((filePath: string) => {
    const content: string = fs.readFileSync(filePath, 'utf-8');
    const relativeFilePath: string = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    const fileDirNormalized: string = normalizePath(path.dirname(filePath));

    let match: RegExpExecArray | null;
    IMPORT_REGEX.lastIndex = 0;

    while ((match = IMPORT_REGEX.exec(content)) !== null) {
      const importPath: string = match[1];

      //* Nueva Regla: Ignorar archivos principales que no poseen rutas absolutas
      if (importPath.endsWith('package.json') || importPath.endsWith('app.module')) {
        continue;
      }

      const isProjectAlias: boolean = PATHS.some((prefix: string) => importPath.startsWith(prefix));
      const isRelative: boolean = importPath.startsWith('./') || importPath.startsWith('../');

      //* Regla 1: PROHIBICIÓN ABSOLUTA de rutas relativas (./ o ../)
      if (isRelative) {
        console.error(
          `❌ [${relativeFilePath}]: Import relativo prohibido "${importPath}". Utiliza siempre la ruta absoluta con alias (@...).`,
        );
        totalErrors++;
        continue;
      }

      if (!isProjectAlias) continue;

      //* Regla 2: Validar imports con Alias Absolutos (@...)
      const relativeToSrc: string = importPath.replace(/^@/, 'src/');
      const absoluteResolved: string = path.resolve(relativeToSrc);

      let targetDir: string;
      let isBarrelImport: boolean;

      // Verificación dinámica en el File System (elimina los falsos positivos en subcarpetas)
      if (fs.existsSync(absoluteResolved) && fs.statSync(absoluteResolved).isDirectory()) {
        targetDir = absoluteResolved;
        isBarrelImport = true;
      } else {
        targetDir = path.dirname(absoluteResolved);
        isBarrelImport = false;
      }

      const targetDirNormalized: string = normalizePath(targetDir);
      const isSameFolder: boolean = fileDirNormalized === targetDirNormalized;

      if (isSameFolder) {
        // CASO A: MISMA CARPETA
        if (isBarrelImport) {
          console.error(
            `❌ [${relativeFilePath}]: No puedes consumir el barril de tu propia carpeta "${importPath}" (causa dependencia circular). Importa el fichero directo mediante su ruta absoluta.`,
          );
          totalErrors++;
        }
      } else {
        // CASO B: OTRA CARPETA / MÓDULO EXTERNO
        const isModuleImport: boolean = importPath.endsWith('.module');

        if (!isBarrelImport && !isModuleImport) {
          console.error(
            `❌ [${relativeFilePath}]: Deep import prohibido "${importPath}". Al importar desde otra carpeta debes usar directamente el barril de la capa.`,
          );
          totalErrors++;
        }
      }
    }
  });

  if (totalErrors > 0) {
    console.error(`\n❌ Se encontraron ${totalErrors} violaciones en las reglas de importación.\n`);
    process.exit(1);
  } else {
    console.log(
      '✅ Todos los imports respetan la arquitectura estrictamente con rutas absolutas.\n',
    );
  }
}

validateImports();
