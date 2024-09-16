import * as z from "zod"
import { OpenAgentHarnessConfigSchema } from "../src/config/schema"

export function createOpenAgentHarnessJsonSchema(): Record<string, unknown> {
  const jsonSchema = z.toJSONSchema(OpenAgentHarnessConfigSchema, {
    target: "draft-7",
    unrepresentable: "any",
  })

  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "openagent-harness.schema.json",
    title: "OpenAgent Harness Configuration",
    description: "Configuration schema for openagent-harness plugin",
    ...jsonSchema,
  }
}
