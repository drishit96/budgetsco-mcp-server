import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { callApi } from "../../utils/api.utils.js";
import {
  CurrencyPreferenceInputSchema,
  parseCurrencyPreferenceInput,
} from "./currency.schema.js";

export async function getCurrency(): Promise<string> {
  const response = await callApi({
    path: "/currency/get",
  });

  return JSON.stringify(response.data);
}

export function registerCurrencyTools(server: McpServer) {
  server.registerTool(
    "getCurrency",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
        readOnlyHint: true,
      },
      description: "Get the current currency preference",
      title: "Get Currency",
    },
    async () => ({
      content: [{ text: await getCurrency(), type: "text" }],
    }),
  );

  server.registerTool(
    "setCurrency",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
        readOnlyHint: false,
      },
      description: "Set currency preference",
      inputSchema: CurrencyPreferenceInputSchema,
      title: "Set Currency",
    },
    async (args) => ({
      content: [{ text: await setCurrency(args), type: "text" }],
    }),
  );
}

export async function setCurrency(args: unknown): Promise<string> {
  const { data: currency, errors } = parseCurrencyPreferenceInput(args);
  if (errors) {
    throw new Error(`Invalid input: ${JSON.stringify(errors)}`);
  }

  const response = await callApi({
    body: currency,
    method: "POST",
    path: "/currency/set",
  });

  return JSON.stringify(response.data);
}
