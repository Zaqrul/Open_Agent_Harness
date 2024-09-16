/** Current OpenCode plugin package name (npm / plugin array). */
export const PLUGIN_NAME = "openagent-harness"

/**
 * Prior plugin names — entries in opencode.json are migrated to {@link PLUGIN_NAME}.
 * Order: most recent canonical first, then original npm name.
 */
export const LEGACY_PLUGIN_NAMES = ["oh-my-openagent", "oh-my-opencode"] as const

/** @deprecated Use LEGACY_PLUGIN_NAMES; kept for tests referencing the last rename step */
export const LEGACY_PLUGIN_NAME = "oh-my-openagent"

/** Plugin JSON / JSONC config file basename (without extension). */
export const CONFIG_BASENAME = "openagent-harness"

/**
 * Prior config basenames — files are migrated to {@link CONFIG_BASENAME}.* when needed.
 */
export const LEGACY_CONFIG_BASENAMES = ["oh-my-openagent", "oh-my-opencode"] as const

/** @deprecated Use LEGACY_CONFIG_BASENAMES */
export const LEGACY_CONFIG_BASENAME = "oh-my-opencode"

export const LOG_FILENAME = "openagent-harness.log"
export const CACHE_DIR_NAME = "openagent-harness"

export function isLegacyConfigFilename(filename: string): boolean {
  const base = filename.replace(/\.(json|jsonc)$/i, "")
  return (LEGACY_CONFIG_BASENAMES as readonly string[]).includes(base)
}
