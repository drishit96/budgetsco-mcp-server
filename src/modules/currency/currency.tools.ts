import { FastMCP, Tool, ToolParameters } from "fastmcp";

import { callApi } from "../../utils/api.utils.js";
import {
  CurrencyPreferenceInputSchema,
  parseCurrencyPreferenceInput,
} from "./currency.schema.js";

export const getCurrencyTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: true,
    title: "Get Currency",
  },
  description: "Get the current currency preference",
  execute: async () => {
    const response = await callApi({
      path: "/currency/get",
    });

    return JSON.stringify(response.data);
  },
  name: "getCurrency",
};

export const setCurrencyTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: false,
    title: "Set Currency",
  },
  description: "Set currency preference",
  execute: async (args) => {
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
  },
  name: "setCurrency",
  parameters: CurrencyPreferenceInputSchema.describe(
    "Parameters for setting currency preference",
  ),
};

export function registerCurrencyTools(server: FastMCP) {
  server.addTool(getCurrencyTool);
  server.addTool(setCurrencyTool);
}
