import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { callApi } from "../../utils/api.utils.js";
import {
  parseRecurringTransactionActions,
  parseRecurringTransactionFilter,
  parseRecurringTransactionInput,
  RecurringTransactionActionsSchema,
  RecurringTransactionFilterSchema,
  RecurringTransactionInputSchema,
} from "./recurringTransaction.schema.js";

export async function createRecurringTransaction(
  args: unknown,
): Promise<string> {
  const { data: transaction, errors } = parseRecurringTransactionInput(args);
  if (errors) {
    throw new Error(`Invalid transaction: ${JSON.stringify(errors)}`);
  }

  const response = await callApi({
    body: transaction,
    method: "POST",
    path: "/recurringTransactions/create",
  });

  return JSON.stringify(response.data);
}

export async function deleteRecurringTransaction(
  args: unknown,
): Promise<string> {
  const { data: transaction, errors } = parseRecurringTransactionActions(args);
  if (errors) {
    throw new Error(`Invalid transaction: ${JSON.stringify(errors)}`);
  }

  const response = await callApi({
    method: "DELETE",
    path: "/recurringTransactions/delete",
    queryParams: {
      transactionId: [transaction.transactionId],
    },
  });

  return JSON.stringify(response.data);
}

export async function editRecurringTransaction(args: unknown): Promise<string> {
  const { data: transaction, errors } = parseRecurringTransactionInput(args);
  if (errors) {
    throw new Error(`Invalid transaction: ${JSON.stringify(errors)}`);
  }

  const response = await callApi({
    body: transaction,
    method: "POST",
    path: "/recurringTransactions/edit",
  });

  return JSON.stringify(response.data);
}

export async function getRecurringTransactions(args: unknown): Promise<string> {
  const { data: filter, errors } = parseRecurringTransactionFilter(args);
  if (errors) {
    throw new Error(`Invalid filter: ${JSON.stringify(errors)}`);
  }

  const searchParams: Record<string, string[]> = {};
  if (filter.startDate) searchParams.startDate = [filter.startDate];
  if (filter.endDate) searchParams.endDate = [filter.endDate];

  const response = await callApi({
    path: "/recurringTransactions/get",
    queryParams: searchParams,
  });

  return JSON.stringify(response.data);
}

export async function markRecurringTransactionDone(
  args: unknown,
): Promise<string> {
  const { data: transaction, errors } = parseRecurringTransactionActions(args);
  if (errors) {
    throw new Error(`Invalid transaction: ${JSON.stringify(errors)}`);
  }

  const response = await callApi({
    body: transaction,
    method: "POST",
    path: "/recurringTransactions/markAsDone",
  });

  return JSON.stringify(response.data);
}

export function registerRecurringTransactionTool(server: McpServer) {
  server.registerTool(
    "getRecurringTransactions",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
        readOnlyHint: true,
      },
      description: "Retrieve recurring transactions",
      inputSchema: RecurringTransactionFilterSchema,
      title: "Get Recurring Transactions",
    },
    async (args) => ({
      content: [{ text: await getRecurringTransactions(args), type: "text" }],
    }),
  );

  server.registerTool(
    "createRecurringTransaction",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
        readOnlyHint: false,
      },
      description: "Create a recurring transaction",
      inputSchema: RecurringTransactionInputSchema,
      title: "Create Recurring Transaction",
    },
    async (args) => ({
      content: [{ text: await createRecurringTransaction(args), type: "text" }],
    }),
  );

  server.registerTool(
    "editRecurringTransaction",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
        readOnlyHint: false,
      },
      description: "Edit a recurring transaction",
      inputSchema: RecurringTransactionInputSchema,
      title: "Edit Recurring Transaction",
    },
    async (args) => ({
      content: [{ text: await editRecurringTransaction(args), type: "text" }],
    }),
  );

  server.registerTool(
    "markRecurringTransactionDone",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
        readOnlyHint: false,
      },
      description:
        "Mark a recurring transaction as done for the current period",
      inputSchema: RecurringTransactionActionsSchema,
      title: "Mark Recurring Transaction as Done",
    },
    async (args) => ({
      content: [
        { text: await markRecurringTransactionDone(args), type: "text" },
      ],
    }),
  );

  server.registerTool(
    "skipRecurringTransaction",
    {
      annotations: {
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
        readOnlyHint: false,
      },
      description: "Skip a recurring transaction for the current period",
      inputSchema: RecurringTransactionActionsSchema,
      title: "Skip Recurring Transaction",
    },
    async (args) => ({
      content: [{ text: await skipRecurringTransaction(args), type: "text" }],
    }),
  );

  server.registerTool(
    "deleteRecurringTransaction",
    {
      annotations: {
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
        readOnlyHint: false,
      },
      description: "Delete a recurring transaction permanently",
      inputSchema: RecurringTransactionActionsSchema,
      title: "Delete Recurring Transaction",
    },
    async (args) => ({
      content: [{ text: await deleteRecurringTransaction(args), type: "text" }],
    }),
  );
}

export async function skipRecurringTransaction(args: unknown): Promise<string> {
  const { data: transaction, errors } = parseRecurringTransactionActions(args);
  if (errors) {
    throw new Error(`Invalid transaction: ${JSON.stringify(errors)}`);
  }

  const response = await callApi({
    body: transaction,
    method: "POST",
    path: "/recurringTransactions/skip",
  });

  return JSON.stringify(response.data);
}
