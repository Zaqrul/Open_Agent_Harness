import { describe, it, expect } from "bun:test"
import { PLUGIN_NAME, CONFIG_BASENAME, LOG_FILENAME, CACHE_DIR_NAME } from "./plugin-identity"

describe("plugin-identity constants", () => {
  describe("PLUGIN_NAME", () => {
    it("equals openagent-harness", () => {
      // given

      // when

      // then
      expect(PLUGIN_NAME).toBe("openagent-harness")
    })
  })

  describe("CONFIG_BASENAME", () => {
    it("equals openagent-harness", () => {
      // given

      // when

      // then
      expect(CONFIG_BASENAME).toBe("openagent-harness")
    })
  })

  describe("LOG_FILENAME", () => {
    it("equals openagent-harness.log", () => {
      // given

      // when

      // then
      expect(LOG_FILENAME).toBe("openagent-harness.log")
    })
  })

  describe("CACHE_DIR_NAME", () => {
    it("equals openagent-harness", () => {
      // given

      // when

      // then
      expect(CACHE_DIR_NAME).toBe("openagent-harness")
    })
  })
})
