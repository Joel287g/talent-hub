//? Imports de codigo
import fs from 'fs';
import path from 'path';

type HexagonalLayer = 'domain' | 'application' | 'infrastructure';

interface TsConfigPaths {
  [alias: string]: string[];
}

interface HexagonalViolation {
  filePath: string;
  importPath: string;
  reason: string;
}

//* Constantes globales de configuración
const ROOT_DIR = process.cwd();
const SRC_DIR = path.resolve(ROOT_DIR, 'src');
const TSCONFIG_PATH = path.resolve(ROOT_DIR, 'tsconfig.json');

//* Paquetes externos prohibidos en la capa de Dominio (debe ser 100% agnóstica a frameworks)
const FORBIDDEN_DOMAIN_PACKAGES: readonly string[] = [
  '@nestjs/',
  'mongoose',
  'express',
  'fastify',
  'class-validator',
  'class-transformer',
  'rxjs',
  'joi',
  'helmet',
  'dotenv',
  'nestjs-i18n',
];

//* Paquetes externos de persistencia/HTTP prohibidos en la capa de Aplicación
const FORBIDDEN_APPLICATION_PACKAGES: readonly string[] = [
  '@nestjs/mongoose',
  '@nestjs/platform-express',
  '@nestjs/platform-fastify',
  'mongoose',
  'express',
  'fastify',
];

/**
 * Lee y parsea los alias de rutas configurados en tsconfig.json.
 */
function loadAliasMap(): Map<string, string> {
  const rawContent = fs.readFileSync(TSCONFIG_PATH, 'utf-8');
  //* Elimina comentarios de línea/bloque para evitar fallos en JSON.parse
  const cleanJson = rawContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  const parsedConfig = JSON.parse(cleanJson) as {
    compilerOptions?: { paths?: TsConfigPaths };
  };

  const paths = parsedConfig.compilerOptions?.paths ?? {};
  const aliasMap = new Map<string, string>();

  for (const [aliasPattern, targetPatterns] of Object.entries(paths)) {
    if (!targetPatterns.length) continue;

    const cleanAlias = aliasPattern.replace(/\/\*$/, '');
    const cleanTarget = targetPatterns[0].replace(/\/\*$/, '');
    aliasMap.set(cleanAlias, path.resolve(ROOT_DIR, cleanTarget));
  }

  return aliasMap;
}

/**
 * Recorre recursivamente el directorio src/ recopilando archivos .ts auditables.
 */
function getAuditableTsFiles(dirPath: string): string[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(getAuditableTsFiles(fullPath));
      continue;
    }

    const isTsFile = entry.name.endsWith('.ts');
    const isTestFile = entry.name.endsWith('.spec.ts') || entry.name.endsWith('.e2e-spec.ts');
    const isScriptFile = fullPath.includes(`${path.sep}scripts${path.sep}`);
    const isModuleFile = entry.name.endsWith('.module.ts');

    if (isTsFile && !isTestFile && !isScriptFile && !isModuleFile) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Determina a qué capa hexagonal pertenece una ruta física del proyecto.
 */
function detectLayer(filePath: string): HexagonalLayer | null {
  const normalized = filePath.split(path.sep).join('/');

  if (normalized.includes('/domain/')) return 'domain';
  if (normalized.includes('/application/')) return 'application';
  if (normalized.includes('/infrastructure/')) return 'infrastructure';

  return null;
}

/**
 * Extrae el nombre del módulo al que pertenece el archivo (ej. 'users', 'common').
 */
function detectModuleName(filePath: string): string | null {
  const relativeToSrc = path.relative(SRC_DIR, filePath).split(path.sep).join('/');
  const [moduleName] = relativeToSrc.split('/');
  return moduleName || null;
}

/**
 * Resuelve un especificador de importación interno (alias o relativo) a su ruta física absoluta.
 */
function resolveInternalImportPath(
  importSpecifier: string,
  importerFilePath: string,
  aliasMap: Map<string, string>,
): string | null {
  if (importSpecifier.startsWith('.')) {
    return path.resolve(path.dirname(importerFilePath), importSpecifier);
  }

  for (const [alias, targetBasePath] of aliasMap.entries()) {
    if (importSpecifier === alias) {
      return targetBasePath;
    }

    if (importSpecifier.startsWith(`${alias}/`)) {
      const subPath = importSpecifier.slice(alias.length + 1);
      return path.resolve(targetBasePath, subPath);
    }
  }

  return null;
}

/**
 * Extrae todos los import y export ... from de un archivo TypeScript.
 */
function extractImportSpecifiers(fileContent: string): string[] {
  const importRegex = /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  const specifiers: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(fileContent)) !== null) {
    specifiers.push(match[1]);
  }

  return specifiers;
}

/**
 * Valida las reglas de dependencia de la Arquitectura Hexagonal sobre un archivo.
 */
function validateFileArchitecture(
  filePath: string,
  aliasMap: Map<string, string>,
): HexagonalViolation[] {
  const sourceLayer = detectLayer(filePath);
  if (!sourceLayer) return [];

  const sourceModule = detectModuleName(filePath);
  const relativeFile = path.relative(ROOT_DIR, filePath).split(path.sep).join('/');
  const content = fs.readFileSync(filePath, 'utf-8');
  const specifiers = extractImportSpecifiers(content);
  const violations: HexagonalViolation[] = [];

  for (const importPath of specifiers) {
    const resolvedInternalPath = resolveInternalImportPath(importPath, filePath, aliasMap);

    //? Caso 1: Importación externa (librerías de terceros o Node.js)
    if (!resolvedInternalPath) {
      if (
        sourceLayer === 'domain' &&
        FORBIDDEN_DOMAIN_PACKAGES.some(
          (pkg) => importPath === pkg.replace(/\/$/, '') || importPath.startsWith(pkg),
        )
      ) {
        violations.push({
          filePath: relativeFile,
          importPath,
          reason: `Fuga de infraestructura en [domain]: prohibido importar la librería externa "${importPath}".`,
        });
      }

      if (
        sourceLayer === 'application' &&
        FORBIDDEN_APPLICATION_PACKAGES.some(
          (pkg) => importPath === pkg.replace(/\/$/, '') || importPath.startsWith(pkg),
        )
      ) {
        violations.push({
          filePath: relativeFile,
          importPath,
          reason: `Fuga de infraestructura en [application]: prohibido importar "${importPath}" en la capa de aplicación.`,
        });
      }

      continue;
    }

    //? Caso 2: Importación interna del proyecto
    const targetLayer = detectLayer(resolvedInternalPath);
    const targetModule = detectModuleName(resolvedInternalPath);
    const isTargetNestModule = resolvedInternalPath.endsWith('.module');

    //* Ninguna capa interna debe acoplarse a un archivo *.module.ts
    if ((sourceLayer === 'domain' || sourceLayer === 'application') && isTargetNestModule) {
      violations.push({
        filePath: relativeFile,
        importPath,
        reason: `Violación hexagonal en [${sourceLayer}]: no se puede importar un módulo de NestJS ("${importPath}").`,
      });
      continue;
    }

    //* Regla de Dominio: domain -> SOLO domain
    if (
      sourceLayer === 'domain' &&
      (targetLayer === 'application' || targetLayer === 'infrastructure')
    ) {
      violations.push({
        filePath: relativeFile,
        importPath,
        reason: `Violación hexagonal en [domain]: el núcleo no puede depender de la capa externa [${targetLayer}] ("${importPath}").`,
      });
      continue;
    }

    //* Regla de Aplicación: application -> SOLO domain | application
    if (sourceLayer === 'application' && targetLayer === 'infrastructure') {
      violations.push({
        filePath: relativeFile,
        importPath,
        reason: `Violación hexagonal en [application]: los casos de uso/DTOs no pueden depender de [infrastructure] ("${importPath}").`,
      });
      continue;
    }

    //* Regla de Aislamiento entre Módulos: no acceder a la infraestructura privada de otro módulo de negocio
    if (
      sourceModule &&
      targetModule &&
      targetModule !== 'common' &&
      sourceModule !== targetModule &&
      targetLayer === 'infrastructure'
    ) {
      violations.push({
        filePath: relativeFile,
        importPath,
        reason: `Acoplamiento entre módulos: [${sourceModule}] no puede importar directamente la infraestructura de [${targetModule}] ("${importPath}").`,
      });
    }
  }

  return violations;
}

/**
 * Punto de entrada del validador de Arquitectura Hexagonal.
 */
function runHexagonalAudit(): void {
  const aliasMap = loadAliasMap();
  const files = getAuditableTsFiles(SRC_DIR);
  let allViolations: HexagonalViolation[] = [];

  for (const file of files) {
    const fileViolations = validateFileArchitecture(file, aliasMap);
    allViolations = allViolations.concat(fileViolations);
  }

  if (allViolations.length > 0) {
    console.error('\n❌ Se encontraron violaciones de Arquitectura Hexagonal:\n');
    for (const violation of allViolations) {
      console.error(`❌ [${violation.filePath}]: ${violation.reason}`);
    }
    console.error(`\nTotal de violaciones hexagonales: ${allViolations.length}\n`);
    process.exit(1);
  }

  console.log(
    `✅ Auditoría Hexagonal superada (${files.length} archivos verificados sin fugas entre capas).\n`,
  );
}

runHexagonalAudit();
