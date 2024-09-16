import { LEGACY_PLUGIN_NAMES, PLUGIN_NAME } from "./plugin-identity"

function matchesLegacy(entry: string, legacy: string): boolean {
  return entry === legacy || entry.startsWith(`${legacy}@`)
}

export function isLegacyEntry(entry: string): boolean {
  return LEGACY_PLUGIN_NAMES.some((legacy) => matchesLegacy(entry, legacy))
}

export function isCanonicalEntry(entry: string): boolean {
  return entry === PLUGIN_NAME || entry.startsWith(`${PLUGIN_NAME}@`)
}

export function toCanonicalEntry(entry: string): string {
  for (const legacy of LEGACY_PLUGIN_NAMES) {
    if (entry === legacy) {
      return PLUGIN_NAME
    }
    if (entry.startsWith(`${legacy}@`)) {
      return `${PLUGIN_NAME}${entry.slice(legacy.length)}`
    }
  }
  return entry
}
