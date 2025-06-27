import z from "zod";

import { safeParseObjectToSchema } from "../../utils/schema.utils.js";

export const TransactionType = z.object({
  type: z
    .enum(["income", "expense", "investment"])
    .describe("Type of transaction"),
});

export const CustomCategoryActionSchema = z.object({
  category: z.string().min(1, "Category name is required"),
  type: z.enum(["expense", "income", "investment"]),
});

export function parseCustomCategoryActionInput(input: unknown) {
  return safeParseObjectToSchema(input, CustomCategoryActionSchema);
}

export function parseTransactionType(
  type: unknown,
): null | z.infer<typeof TransactionType> {
  const output = TransactionType.safeParse(type);
  if (output.success) {
    return output.data;
  } else {
    console.error("Invalid transaction type:", output.error.issues);
    return null;
  }
}
