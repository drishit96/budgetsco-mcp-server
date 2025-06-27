import { FastMCP, Tool, ToolParameters } from "fastmcp";

import { callApi } from "../../utils/api.utils.js";
import {
  parseTransactionDeleteInput,
  parseTransactionFilter,
  parseTransactionInput,
  TransactionDeleteInputSchema,
  TransactionFilterSchema,
  TransactionInputSchema,
} from "./transaction.schema.js";

export const getTransactionsTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: true,
    title: "Get Transactions",
  },
  description: "Retrieve a list of transactions",
  execute: async (args) => {
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
  },
  name: "getTransactions",
  parameters: TransactionFilterSchema.describe(
    "Filters to apply when retrieving transactions",
  ),
};

export const createTransactionTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: false,
    title: "Create new transaction",
  },
  description: "Create new transaction.",
  execute: async (args) => {
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
  },
  name: "createTransaction",
  parameters: TransactionInputSchema.describe(
    "Parameters for creating a transaction",
  ),
};

export const editTransactionTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: false,
    title: "Edit transaction",
  },
  description: "Edit an existing transaction.",
  execute: async (args) => {
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
  },
  name: "editTransaction",
  parameters: TransactionInputSchema.describe(
    "Parameters for editing an existing transaction",
  ),
};

export const deleteTransactionTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: false,
    title: "Delete transaction",
  },
  description: "Delete transaction permanently.",
  execute: async (args) => {
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
  },
  name: "deleteTransaction",
  parameters: TransactionDeleteInputSchema.describe(
    "Parameters for deleting a transaction",
  ),
};

export function registerTransactionsTools(server: FastMCP) {
  server.addTool(getTransactionsTool);
  server.addTool(createTransactionTool);
  server.addTool(editTransactionTool);
  server.addTool(deleteTransactionTool);
}
