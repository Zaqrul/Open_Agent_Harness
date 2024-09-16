import { existsSync, appendFileSync } from "fs"
import { join } from "path"
import { homedir, tmpdir } from "os"
import { createRequire } from "module"
import {
  cleanupArchive,
  downloadArchive,
  ensureCacheDir,
  ensureExecutable,
  extractTarGz,
  extractZipArchive,
  getCachedBinaryPath as getCachedBinaryPathShared,
} from "../../shared/binary-downloader"
import { log } from "../../shared/logger"

const DEBUG = process.env.COMMENT_CHECKER_DEBUG === "1"
const DEBUG_FILE = join(tmpdir(), "comment-checker-debug.log")

function debugLog(...args: unknown[]) {
  if (DEBUG) {
    const msg = `[${new Date().toISOString()}] [comment-checker:downloader] ${args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')}\n`
    appendFileSync(DEBUG_FILE, msg)
  }
}

/** Optional base URL for release assets (no trailing slash). If unset, remote download is skipped. */
function getCommentCheckerReleaseBaseUrl(): string | null {
  const raw = process.env.COMMENT_CHECKER_RELEASES_BASE_URL?.trim()
  return raw ? raw.replace(/\/$/, "") : null
}

interface PlatformInfo {
  os: string
  arch: string
  ext: "tar.gz" | "zip"
}

const PLATFORM_MAP: Record<string, PlatformInfo> = {
  "darwin-arm64": { os: "darwin", arch: "arm64", ext: "tar.gz" },
  "darwin-x64": { os: "darwin", arch: "amd64", ext: "tar.gz" },
  "linux-arm64": { os: "linux", arch: "arm64", ext: "tar.gz" },
  "linux-x64": { os: "linux", arch: "amd64", ext: "tar.gz" },
  "win32-x64": { os: "windows", arch: "amd64", ext: "zip" },
}

/**
 * Get the cache directory for openagent-harness binaries.
 * On Windows: Uses %LOCALAPPDATA% or %APPDATA% (Windows conventions)
 * On Unix: Follows XDG Base Directory Specification
 */
export function getCacheDir(): string {
  if (process.platform === "win32") {
    const localAppData = process.env.LOCALAPPDATA || process.env.APPDATA
    const base = localAppData || join(homedir(), "AppData", "Local")
    return join(base, "openagent-harness", "bin")
  }

  const xdgCache = process.env.XDG_CACHE_HOME
  const base = xdgCache || join(homedir(), ".cache")
  return join(base, "openagent-harness", "bin")
}

/**
 * Get the binary name based on platform.
 */
export function getBinaryName(): string {
  return process.platform === "win32" ? "comment-checker.exe" : "comment-checker"
}

/**
 * Get the cached binary path if it exists.
 */
export function getCachedBinaryPath(): string | null {
  return getCachedBinaryPathShared(getCacheDir(), getBinaryName())
}

/**
 * Get the version from the installed comment-checker npm package.
 */
function getPackageVersion(): string {
  try {
    const require = createRequire(import.meta.url)
    const pkg = require("@code-yeongyu/comment-checker/package.json")
    return pkg.version
  } catch {
    // Fallback to hardcoded version if package not found
    return "0.4.1"
  }
}

/**
 * Download the comment-checker binary from a release host (see COMMENT_CHECKER_RELEASES_BASE_URL).
 * Returns the path to the downloaded binary, or null on failure.
 */
export async function downloadCommentChecker(): Promise<string | null> {
  const releaseBase = getCommentCheckerReleaseBaseUrl()
  if (!releaseBase) {
    debugLog("COMMENT_CHECKER_RELEASES_BASE_URL not set; skipping remote binary download")
    return null
  }

  const platformKey = `${process.platform}-${process.arch}`
  const platformInfo = PLATFORM_MAP[platformKey]
  
  if (!platformInfo) {
    debugLog(`Unsupported platform: ${platformKey}`)
    return null
  }
  
  const cacheDir = getCacheDir()
  const binaryName = getBinaryName()
  const binaryPath = join(cacheDir, binaryName)
  
  // Already exists in cache
  if (existsSync(binaryPath)) {
    debugLog("Binary already cached at:", binaryPath)
    return binaryPath
  }
  
  const version = getPackageVersion()
  const { os, arch, ext } = platformInfo
  const assetName = `comment-checker_v${version}_${os}_${arch}.${ext}`
  const downloadUrl = `${releaseBase}/releases/download/v${version}/${assetName}`
  
  debugLog(`Downloading from: ${downloadUrl}`)
  log(`[openagent-harness] Downloading comment-checker binary...`)
  
  try {
    // Ensure cache directory exists
    ensureCacheDir(cacheDir)
    
    const archivePath = join(cacheDir, assetName)
    await downloadArchive(downloadUrl, archivePath)
    
    debugLog(`Downloaded archive to: ${archivePath}`)
    
    // Extract based on file type
    if (ext === "tar.gz") {
      debugLog("Extracting tar.gz:", archivePath, "to", cacheDir)
      await extractTarGz(archivePath, cacheDir)
    } else {
      await extractZipArchive(archivePath, cacheDir)
    }
    
    // Clean up archive
    cleanupArchive(archivePath)
    
    // Set execute permission on Unix
    ensureExecutable(binaryPath)
    
    debugLog(`Successfully downloaded binary to: ${binaryPath}`)
    log(`[openagent-harness] comment-checker binary ready.`)
    
    return binaryPath
    
  } catch (err) {
    debugLog(`Failed to download: ${err}`)
    log(`[openagent-harness] Failed to download comment-checker: ${err instanceof Error ? err.message : err}`)
    log(`[openagent-harness] Comment checking disabled.`)
    return null
  }
}

/**
 * Ensure the comment-checker binary is available.
 * First checks cache, then downloads if needed.
 * Returns the binary path or null if unavailable.
 */
export async function ensureCommentCheckerBinary(): Promise<string | null> {
  // Check cache first
  const cachedPath = getCachedBinaryPath()
  if (cachedPath) {
    debugLog("Using cached binary:", cachedPath)
    return cachedPath
  }
  
  // Download if not cached
  return downloadCommentChecker()
}
