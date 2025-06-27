import { FastMCP, Tool, ToolParameters } from "fastmcp";

import { callApi } from "../../utils/api.utils.js";
import {
  BudgetInputSchema,
  parseBudgetFilterInput,
  parseBudgetInput,
  TargetFilterSchema,
} from "./target.schema.js";

export const getBudgetTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: true,
    title: "Get Budget",
  },
  description: "Retrieve budget for a specific period",
  execute: async (args) => {
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
  },
  name: "getBudget",
  parameters: TargetFilterSchema.describe(
    "Parameters for retrieving budget information",
  ),
};

export const setBudgetTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: false,
    title: "Set Budget",
  },
  description: "Set budget for categories",
  execute: async (args) => {
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
  },
  name: "setBudget",
  parameters: BudgetInputSchema.describe("Parameters for setting budget"),
};

export function registerTargetTools(server: FastMCP) {
  server.addTool(getBudgetTool);
  server.addTool(setBudgetTool);
}
