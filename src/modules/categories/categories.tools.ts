import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { callApi } from "../../utils/api.utils.js";
import {
  CustomCategoryActionSchema,
  parseCustomCategoryActionInput,
  parseTransactionType,
  TransactionType,
} from "./categories.schema.js";

export async function createCustomCategories(args: unknown): Promise<string> {
  const { data: validInput, errors } = parseCustomCategoryActionInput(args);
  if (errors) {
    throw new Error(`Invalid custom category input: ${JSON.stringify(errors)}`);
  }

  const response = await callApi<{ id: string }>({
    body: validInput,
    method: "POST",
    path: "/categories/custom/create",
  });
  return JSON.stringify(response.data);
}

export async function deleteCustomCategories(args: unknown): Promise<string> {
  const { data: input, errors } = parseCustomCategoryActionInput(args);
  if (errors) {
    throw new Error(`Invalid custom category input: ${JSON.stringify(errors)}`);
  }

  const response = await callApi<void>({
    method: "DELETE",
    path: "/categories/custom/delete",
    queryParams: {
      category: input.categories,
      type: [input.type],
    },
  });
  return JSON.stringify(response.data);
}

export async function getCategoriesByType(args: unknown): Promise<string> {
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
}

export async function getCustomCategories(args: unknown): Promise<string> {
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
}

export function registerCategoriesTools(server: McpServer) {
  server.registerTool(
    "getCategoriesByType",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
        readOnlyHint: true,
      },
      description:
        "Retrieve all categories of a specific type. Always use this tool to get categories before creating a transaction. If no categories match, create a new category.",
      inputSchema: TransactionType,
      title: "Get all categories by type.",
    },
    async (args) => ({
      content: [{ text: await getCategoriesByType(args), type: "text" }],
    }),
  );

  server.registerTool(
    "getCustomCategories",
    {
      annotations: {
        openWorldHint: false,
        readOnlyHint: true,
      },
      description: "Retrieve all custom categories created by the user",
      inputSchema: TransactionType,
      title: "Get all custom categories",
    },
    async (args) => ({
      content: [{ text: await getCustomCategories(args), type: "text" }],
    }),
  );

  server.registerTool(
    "createCustomCategories",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
        readOnlyHint: false,
      },
      description: "Create new custom categories for transactions.",
      inputSchema: CustomCategoryActionSchema,
      title: "Create custom categories.",
    },
    async (args) => ({
      content: [{ text: await createCustomCategories(args), type: "text" }],
    }),
  );

  server.registerTool(
    "deleteCustomCategories",
    {
      annotations: {
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
        readOnlyHint: false,
      },
      description: "Delete custom categories",
      inputSchema: CustomCategoryActionSchema,
      title: "Delete custom categories.",
    },
    async (args) => ({
      content: [{ text: await deleteCustomCategories(args), type: "text" }],
    }),
  );
}
