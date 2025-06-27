import { FastMCP, Tool, ToolParameters } from "fastmcp";

import { callApi } from "../../utils/api.utils.js";
import {
  CustomCategoryActionSchema,
  parseCustomCategoryActionInput,
  parseTransactionType,
  TransactionType,
} from "./categories.schema.js";

export const getCategoriesByTypeTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: true,
    title: "Get all categories by type.",
  },
  description:
    "Retrieve all categories of a specific type. Always use this tool to get categories before creating a transaction. If no categories match, create a new category.",
  execute: async (args) => {
    const validType = parseTransactionType(args);
    if (!validType) {
      throw new Error(`Invalid transaction type: ${JSON.stringify(args)}`);
    }

    const response = await callApi<string[]>({
      path: "/categories/get",
      queryParams: {
        type: [validType.type],
      },
    });

    return JSON.stringify(response.data);
  },
  name: "getCategoriesByType",
  parameters: TransactionType.describe(
    "The transaction type to filter categories by",
  ),
};

export const getCustomCategoriesTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: true,
    title: "Get all custom categories",
  },
  description: "Retrieve all custom categories created by the user",
  execute: async (args) => {
    const validType = parseTransactionType(args);
    if (!validType) {
      throw new Error(`Invalid transaction type: ${JSON.stringify(args)}`);
    }

    const response = await callApi<string[]>({
      path: "/categories/custom/get",
      queryParams: {
        type: [validType.type],
      },
    });
    return JSON.stringify(response.data);
  },
  name: "getCustomCategories",
  parameters: TransactionType.describe(
    "The transaction type to filter categories by",
  ),
};

export const createCustomCategoryTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: false,
    title: "Create a custom category.",
  },
  description: "Create a new custom category for transactions.",
  execute: async (args) => {
    const { data: validInput, errors } = parseCustomCategoryActionInput(args);
    if (errors) {
      throw new Error(
        `Invalid custom category input: ${JSON.stringify(errors)}`,
      );
    }

    const response = await callApi<{ id: string }>({
      body: validInput,
      method: "POST",
      path: "/categories/custom/create",
    });
    return JSON.stringify(response.data);
  },
  name: "createCustomCategory",
  parameters: CustomCategoryActionSchema.describe(
    "Parameters for creating a custom category",
  ),
};

export const deleteCustomCategoryTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: false,
    title: "Delete a custom category.",
  },
  description: "Delete a custom category",
  execute: async (args) => {
    const { data: input, errors } = parseCustomCategoryActionInput(args);
    if (errors) {
      throw new Error(
        `Invalid custom category input: ${JSON.stringify(errors)}`,
      );
    }

    const response = await callApi<void>({
      method: "DELETE",
      path: "/categories/custom/delete",
      queryParams: {
        category: [input.category],
        type: [input.type],
      },
    });
    return JSON.stringify(response.data);
  },
  name: "deleteCustomCategory",
  parameters: CustomCategoryActionSchema.describe(
    "Parameters for deleting a custom category",
  ),
};

export function registerCategoriesTools(server: FastMCP) {
  server.addTool(getCategoriesByTypeTool);
  server.addTool(getCustomCategoriesTool);
  server.addTool(createCustomCategoryTool);
  server.addTool(deleteCustomCategoryTool);
}
