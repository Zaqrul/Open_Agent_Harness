import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { parse, ParseError, printParseErrorCode } from "jsonc-parser"

import { CONFIG_BASENAME, LEGACY_CONFIG_BASENAMES } from "./plugin-identity"

export interface JsoncParseResult<T> {
  data: T | null
  errors: Array<{ message: string; offset: number; length: number }>
}

export function parseJsonc<T = unknown>(content: string): T {
  const errors: ParseError[] = []
  const result = parse(content, errors, {
    allowTrailingComma: true,
    disallowComments: false,
  }) as T

  if (errors.length > 0) {
    const errorMessages = errors
      .map((e) => `${printParseErrorCode(e.error)} at offset ${e.offset}`)
      .join(", ")
    throw new SyntaxError(`JSONC parse error: ${errorMessages}`)
  }

  return result
}

export function parseJsoncSafe<T = unknown>(content: string): JsoncParseResult<T> {
  const errors: ParseError[] = []
  const data = parse(content, errors, {
    allowTrailingComma: true,
    disallowComments: false,
  }) as T | null

  return {
    data: errors.length > 0 ? null : data,
    errors: errors.map((e) => ({
      message: printParseErrorCode(e.error),
      offset: e.offset,
      length: e.length,
    })),
  }
}

export function readJsoncFile<T = unknown>(filePath: string): T | null {
  try {
    const content = readFileSync(filePath, "utf-8")
    return parseJsonc<T>(content)
  } catch {
    return null
  }
}

export function detectConfigFile(basePath: string): {
  format: "json" | "jsonc" | "none"
  path: string
} {
  const jsoncPath = `${basePath}.jsonc`
  const jsonPath = `${basePath}.json`

  if (existsSync(jsoncPath)) {
    return { format: "jsonc", path: jsoncPath }
  }
  if (existsSync(jsonPath)) {
    return { format: "json", path: jsonPath }
  }
  return { format: "none", path: jsonPath }
}

export function detectPluginConfigFile(dir: string): {
  format: "json" | "jsonc" | "none"
  path: string
  legacyPath?: string
} {
  const canonicalResult = detectConfigFile(join(dir, CONFIG_BASENAME))

  const legacyMatches = LEGACY_CONFIG_BASENAMES.map((base) => ({
    base,
    result: detectConfigFile(join(dir, base)),
  })).filter((x) => x.result.format !== "none")

  if (canonicalResult.format !== "none") {
    return {
      ...canonicalResult,
      legacyPath: legacyMatches[0]?.result.path,
    }
  }

  if (legacyMatches.length > 0) {
    return legacyMatches[0]!.result
  }

  return { format: "none", path: join(dir, `${CONFIG_BASENAME}.json`) }
}
