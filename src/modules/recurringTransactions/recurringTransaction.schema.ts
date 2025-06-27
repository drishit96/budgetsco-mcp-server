import z from "zod";

import { safeParseObjectToSchema } from "../../utils/schema.utils.js";
import {
  decimal,
  PaymentModesSchema,
} from "../transactions/transaction.schema.js";

export const RecurringTransactionFilterSchema = z.object({
  endDate: z
    .string()
    .date()
    .optional()
    .describe(
      "End date to filter recurring transactions. If not provided, no default filter is applied.",
    ),
  startDate: z
    .string()
    .date()
    .optional()
    .describe(
      "Start date to filter recurring transactions. If not provided, no default filter is applied.",
    ),
});

export const RecurringTransactionInputSchema = z.object({
  amount: decimal({
    errorMsg: "Amount must be greater than zero",
    path: ["amount"],
  }).describe("Amount of the recurring transaction"),
  category: z
    .string()
    .min(1, "Please select a category")
    .describe("Category of the recurring transaction"),
  description: z.string().optional(),
  interval: z
    .number()
    .int()
    .min(1, "Number must be greater than zero")
    .max(500)
    .describe(
      "Interval for the recurrence, for example, 1 for every day, 2 for every two months, etc.",
    ),
  occurrence: z
    .enum(["day", "month", "year"])
    .describe(
      "Frequency of the recurrence, for example, 'day' for daily, 'month' for monthly, 'year' for yearly",
    ),
  paymentMode: PaymentModesSchema.describe("Payment mode"),
  startDate: z
    .string()
    .datetime()
    .optional()
    .describe(
      "Start date of the recurring transaction. If not provided, it adds the transaction to the next occurrence based on the current date.",
    ),
  transactionId: z
    .string()
    .min(12)
    .optional()
    .describe(
      "Id of the existing transaction. If creating a new transaction, this should be null or undefined.",
    ),
  type: z
    .enum(["income", "expense", "investment"])
    .describe("Type of the recurring transaction"),
});

export const RecurringTransactionActionsSchema = z.object({
  transactionId: z
    .string()
    .min(12)
    .describe(
      "ID of the recurring transaction to mark as done, skip or delete",
    ),
});

export function parseRecurringTransactionActions(input: unknown) {
  return safeParseObjectToSchema(input, RecurringTransactionActionsSchema);
}

export function parseRecurringTransactionFilter(filter: unknown) {
  return safeParseObjectToSchema(filter, RecurringTransactionFilterSchema);
}

export function parseRecurringTransactionInput(input: unknown) {
  return safeParseObjectToSchema(input, RecurringTransactionInputSchema);
}
