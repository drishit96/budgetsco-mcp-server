import { Decimal } from "decimal.js";
import z from "zod";

import { safeParseObjectToSchema } from "../../utils/schema.utils.js";

export const decimal = ({
  allowZero,
  errorMsg,
  path,
}: {
  allowZero?: boolean;
  errorMsg?: string;
  path?: string[];
}) =>
  z
    .instanceof(Decimal)
    .or(z.string())
    .or(z.number())
    .refine((value) => {
      try {
        return new Decimal(value);
      } catch {
        return false;
      }
    })
    .transform((value) => new Decimal(value))
    .refine(
      (value) =>
        allowZero ? value.greaterThanOrEqualTo(0) : value.greaterThan(0),
      {
        message: errorMsg,
        path,
      },
    );

export const PaymentModesSchema = z.enum([
  "Cash",
  "Cheque",
  "Credit Card",
  "Debit Card",
  "Mobile Wallet",
  "Netbanking",
  "Sodexo",
  "UPI",
]);

export const TransactionInputSchema = z.object({
  amount: decimal({
    errorMsg: "Amount must be greater than zero",
    path: ["amount"],
  }).describe("Amount of the transaction"),
  category: z
    .string()
    .min(1, "Please select a category")
    .describe(
      "Category of the transaction. Try to be as specific as possible since this helps in better analysis of spending patterns.",
    ),
  description: z.string().nullish().describe("Description of the transaction"),
  isNewCustomCategory: z
    .boolean()
    .optional()
    .describe("Is this a new custom category?"),
  paymentMode: PaymentModesSchema.describe("Payment mode"),
  transactionId: z
    .string()
    .min(18)
    .optional()
    .describe(
      "Id of the existing transaction. If creating a new transaction, this should be null or undefined.",
    ),
  type: z
    .enum(["income", "expense", "investment"])
    .describe("Type of the transaction"),
});

export const TransactionFilterSchema = z.object({
  categories: z
    .array(z.string().min(1))
    .optional()
    .describe("Filter by categories"),
  endDate: z
    .string()
    .date()
    .optional()
    .describe(
      "Filter by end date. The difference between startDate and endDate must not exceed 1 year",
    ),
  paymentModes: PaymentModesSchema.optional().describe(
    "Filter by payment modes",
  ),
  startDate: z.string().date().describe("Filter by start date"),
  types: z
    .array(z.enum(["income", "expense", "investment"]))
    .optional()
    .describe("Filter by transaction types"),
});

export const TransactionDeleteInputSchema = z.object({
  transactionId: z
    .string()
    .min(12)
    .describe(
      "ID of the recurring transaction to mark as done, skip or delete",
    ),
});

export function parseTransactionDeleteInput(input: unknown) {
  return safeParseObjectToSchema(input, TransactionDeleteInputSchema);
}

export function parseTransactionFilter(filter: unknown) {
  return safeParseObjectToSchema(filter, TransactionFilterSchema);
}

export function parseTransactionInput(input: unknown) {
  return safeParseObjectToSchema(input, TransactionInputSchema);
}
