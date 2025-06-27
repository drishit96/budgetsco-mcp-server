import { FastMCP, Tool, ToolParameters } from "fastmcp";

import { callApi } from "../../utils/api.utils.js";
import {
  parseRecurringTransactionActions,
  parseRecurringTransactionFilter,
  parseRecurringTransactionInput,
  RecurringTransactionActionsSchema,
  RecurringTransactionFilterSchema,
  RecurringTransactionInputSchema,
} from "./recurringTransaction.schema.js";

export const getRecurringTransactionsTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: true,
    title: "Get Recurring Transactions",
  },
  description: "Retrieve recurring transactions",
  execute: async (args) => {
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
  },
  name: "getRecurringTransactions",
  parameters: RecurringTransactionFilterSchema.describe(
    "You can filter by startDate and endDate to limit the results to a specific date range. If not provided, no default filter is applied and all recurring transactions are returned.",
  ),
};

export const createRecurringTransactionTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: false,
    title: "Create Recurring Transaction",
  },
  description: "Create a recurring transaction",
  execute: async (args) => {
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
  },
  name: "createRecurringTransaction",
  parameters: RecurringTransactionInputSchema.describe(
    "Parameters for creating a recurring transaction. Recurring transactions are used to automate the creation of transactions that occur on a regular basis, such as monthly bills or weekly salaries.",
  ),
};

export const editRecurringTransactionTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: false,
    title: "Edit Recurring Transaction",
  },
  description: "Edit a recurring transaction",
  execute: async (args) => {
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
  },
  name: "editRecurringTransaction",
  parameters: RecurringTransactionInputSchema.describe(
    "Parameters for editing a recurring transaction. Recurring transactions are used to automate the creation of transactions that occur on a regular basis, such as monthly bills or weekly salaries.",
  ),
};

export const markRecurringTransactionDoneTool: Tool<undefined, ToolParameters> =
  {
    annotations: {
      openWorldHint: false,
      readOnlyHint: false,
      title: "Mark Recurring Transaction as Done",
    },
    description: "Mark a recurring transaction as done for the current period",
    execute: async (args) => {
      const { data: transaction, errors } =
        parseRecurringTransactionActions(args);
      if (errors) {
        throw new Error(`Invalid transaction: ${JSON.stringify(errors)}`);
      }

      const response = await callApi({
        body: transaction,
        method: "POST",
        path: "/recurringTransactions/markAsDone",
      });

      return JSON.stringify(response.data);
    },
    name: "markRecurringTransactionDone",
    parameters: RecurringTransactionActionsSchema.describe(
      "Parameters for marking a recurring transaction as done.",
    ),
  };

export const skipRecurringTransactionTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: false,
    title: "Skip Recurring Transaction",
  },
  description: "Skip a recurring transaction for the current period",
  execute: async (args) => {
    const { data: transaction, errors } =
      parseRecurringTransactionActions(args);
    if (errors) {
      throw new Error(`Invalid transaction: ${JSON.stringify(errors)}`);
    }

    const response = await callApi({
      body: transaction,
      method: "POST",
      path: "/recurringTransactions/skip",
    });

    return JSON.stringify(response.data);
  },
  name: "skipRecurringTransaction",
  parameters: RecurringTransactionActionsSchema.describe(
    "Parameters for skipping a recurring transaction for the current period.",
  ),
};

export const deleteRecurringTransactionTool: Tool<undefined, ToolParameters> = {
  annotations: {
    openWorldHint: false,
    readOnlyHint: false,
    title: "Delete Recurring Transaction",
  },
  description: "Delete a recurring transaction permanently",
  execute: async (args) => {
    const { data: transaction, errors } =
      parseRecurringTransactionActions(args);
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
  },
  name: "deleteRecurringTransaction",
  parameters: RecurringTransactionActionsSchema.describe(
    "Parameters for deleting a recurring transaction permanently.",
  ),
};

export function registerRecurringTransactionTool(server: FastMCP) {
  server.addTool(getRecurringTransactionsTool);
  server.addTool(createRecurringTransactionTool);
  server.addTool(editRecurringTransactionTool);
  server.addTool(markRecurringTransactionDoneTool);
  server.addTool(skipRecurringTransactionTool);
  server.addTool(deleteRecurringTransactionTool);
}
