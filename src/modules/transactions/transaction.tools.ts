import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { callApi } from "../../utils/api.utils.js";
import {
  parseTransactionDeleteInput,
  parseTransactionFilter,
  parseTransactionInput,
  TransactionDeleteInputSchema,
  TransactionFilterSchema,
  TransactionInputSchema,
} from "./transaction.schema.js";

export async function createTransaction(args: unknown): Promise<string> {
  const { data: transaction, errors } = parseTransactionInput(args);
  if (errors) {
    throw new Error(`Invalid input: ${JSON.stringify(errors)}`);
  }

  const response = await callApi({
    body: transaction,
    method: "POST",
    path: "/transactions/create",
  });

  return JSON.stringify(response.data);
}

export async function deleteTransaction(args: unknown): Promise<string> {
  const { data: body, errors } = parseTransactionDeleteInput(args);
  if (errors) {
    throw new Error(`Invalid transaction: ${JSON.stringify(errors)}`);
  }

  const response = await callApi({
    method: "DELETE",
    path: "/transactions/delete",
    queryParams: {
      transactionId: [body.transactionId],
    },
  });

  return JSON.stringify(response.data);
}

export async function editTransaction(args: unknown): Promise<string> {
  const { data: transaction, errors } = parseTransactionInput(args);
  if (errors) {
    throw new Error(`Invalid input: ${JSON.stringify(errors)}`);
  }

  const response = await callApi({
    body: transaction,
    method: "POST",
    path: "/transactions/edit",
  });

  return JSON.stringify(response.data);
}

export async function getTransactions(args: unknown): Promise<string> {
  const { data: filter, errors } = parseTransactionFilter(args);
  if (errors) {
    throw new Error(`Invalid filter: ${JSON.stringify(errors)}`);
  }

  const searchParams: Record<string, string[]> = {};
  if (filter.types) searchParams.type = filter.types;
  if (filter.categories) searchParams.category = filter.categories;
  if (filter.paymentModes) searchParams.paymentMode = [filter.paymentModes];
  if (filter.startDate) searchParams.startDate = [filter.startDate];
  if (filter.endDate) searchParams.endDate = [filter.endDate];

  const response = await callApi({
    path: "/transactions/get",
    queryParams: searchParams,
  });

  return JSON.stringify(response.data);
}

export function registerTransactionsTools(server: McpServer) {
  server.registerTool(
    "getTransactions",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
        readOnlyHint: true,
      },
      description: "Retrieve a list of transactions",
      inputSchema: TransactionFilterSchema,
      title: "Get Transactions",
    },
    async (args) => ({
      content: [{ text: await getTransactions(args), type: "text" }],
    }),
  );

  server.registerTool(
    "createTransaction",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
        readOnlyHint: false,
      },
      description: "Create new transaction.",
      inputSchema: TransactionInputSchema,
      title: "Create new transaction",
    },
    async (args) => ({
      content: [{ text: await createTransaction(args), type: "text" }],
    }),
  );

  server.registerTool(
    "editTransaction",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
        readOnlyHint: false,
      },
      description: "Edit an existing transaction.",
      inputSchema: TransactionInputSchema,
      title: "Edit transaction",
    },
    async (args) => ({
      content: [{ text: await editTransaction(args), type: "text" }],
    }),
  );

  server.registerTool(
    "deleteTransaction",
    {
      annotations: {
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
        readOnlyHint: false,
      },
      description: "Delete transaction permanently.",
      inputSchema: TransactionDeleteInputSchema,
      title: "Delete transaction",
    },
    async (args) => ({
      content: [{ text: await deleteTransaction(args), type: "text" }],
    }),
  );
}
