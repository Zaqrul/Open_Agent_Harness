import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { migrateLegacyConfigFile } from "./migrate-legacy-config-file"

describe("migrateLegacyConfigFile", () => {
  let testDir = ""

  beforeEach(() => {
    testDir = join(tmpdir(), `omo-migrate-config-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true })
  })

  describe("#given openagent-harness.jsonc exists but openagent-harness.jsonc does not", () => {
    describe("#when migrating the config file", () => {
      it("#then writes openagent-harness.jsonc and renames the legacy file to a backup", () => {
        const legacyPath = join(testDir, "openagent-harness.jsonc")
        const backupPath = join(testDir, "openagent-harness.jsonc.bak")
        writeFileSync(legacyPath, '{ "agents": {} }')

        const result = migrateLegacyConfigFile(legacyPath)

        expect(result).toBe(true)
        expect(existsSync(join(testDir, "openagent-harness.jsonc"))).toBe(true)
        expect(existsSync(legacyPath)).toBe(false)
        expect(existsSync(backupPath)).toBe(true)
        expect(readFileSync(join(testDir, "openagent-harness.jsonc"), "utf-8")).toBe('{ "agents": {} }')
        expect(readFileSync(backupPath, "utf-8")).toBe('{ "agents": {} }')
      })
    })
  })

  describe("#given openagent-harness.json exists but openagent-harness.json does not", () => {
    describe("#when migrating the config file", () => {
      it("#then copies to openagent-harness.json", () => {
        const legacyPath = join(testDir, "openagent-harness.json")
        writeFileSync(legacyPath, '{ "agents": {} }')

        const result = migrateLegacyConfigFile(legacyPath)

        expect(result).toBe(true)
        expect(existsSync(join(testDir, "openagent-harness.json"))).toBe(true)
      })
    })
  })

  describe("#given openagent-harness.jsonc already exists", () => {
    describe("#when attempting migration", () => {
      it("#then returns false and does not overwrite", () => {
        const legacyPath = join(testDir, "openagent-harness.jsonc")
        const canonicalPath = join(testDir, "openagent-harness.jsonc")
        writeFileSync(legacyPath, '{ "old": true }')
        writeFileSync(canonicalPath, '{ "new": true }')

        const result = migrateLegacyConfigFile(legacyPath)

        expect(result).toBe(false)
        expect(readFileSync(canonicalPath, "utf-8")).toBe('{ "new": true }')
      })
    })
  })

  describe("#given the file does not exist", () => {
    describe("#when attempting migration", () => {
      it("#then returns false", () => {
        const result = migrateLegacyConfigFile(join(testDir, "openagent-harness.jsonc"))

        expect(result).toBe(false)
      })
    })
  })

  describe("#given the file is not a legacy config file", () => {
    describe("#when attempting migration", () => {
      it("#then returns false", () => {
        const nonLegacyPath = join(testDir, "something-else.jsonc")
        writeFileSync(nonLegacyPath, "{}")

        const result = migrateLegacyConfigFile(nonLegacyPath)

        expect(result).toBe(false)
      })
    })
  })
})
