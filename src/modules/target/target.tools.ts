import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { callApi } from "../../utils/api.utils.js";
import {
  BudgetInputSchema,
  parseBudgetFilterInput,
  parseBudgetInput,
  TargetFilterSchema,
} from "./target.schema.js";

export async function getBudget(args: unknown): Promise<string> {
  const { data: filter, errors } = parseBudgetFilterInput(args);
  if (errors) {
    throw new Error(`Invalid filter: ${JSON.stringify(errors)}`);
  }

  const searchParams: Record<string, string[]> = {};
  if (filter.startMonth) searchParams.startMonth = [filter.startMonth];
  if (filter.endMonth) searchParams.endMonth = [filter.endMonth];
  if (filter.breakDownByCategory !== undefined) {
    searchParams.breakDownByCategory = [String(filter.breakDownByCategory)];
  }

  const response = await callApi({
    path: "/target/get",
    queryParams: searchParams,
  });

  return JSON.stringify(response.data);
}

export function registerTargetTools(server: McpServer) {
  server.registerTool(
    "getBudget",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
        readOnlyHint: true,
      },
      description: "Retrieve budget for a specific period",
      inputSchema: TargetFilterSchema,
      title: "Get Budget",
    },
    async (args) => ({
      content: [{ text: await getBudget(args), type: "text" }],
    }),
  );

  server.registerTool(
    "setBudget",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
        readOnlyHint: false,
      },
      description: "Set budget for categories",
      inputSchema: BudgetInputSchema,
      title: "Set Budget",
    },
    async (args) => ({
      content: [{ text: await setBudget(args), type: "text" }],
    }),
  );
}

export async function setBudget(args: unknown): Promise<string> {
  const { data: budget, errors } = parseBudgetInput(args);
  if (errors) {
    throw new Error(`Invalid input: ${JSON.stringify(errors)}`);
  }

  const response = await callApi({
    body: budget,
    method: "POST",
    path: "/target/set",
  });

  return JSON.stringify(response.data);
}
