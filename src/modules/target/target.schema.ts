import { Decimal } from "decimal.js";
import z from "zod";

import { safeParseObjectToSchema } from "../../utils/schema.utils.js";
import { decimal } from "../transactions/transaction.schema.js";

export const TargetFilterSchema = z.object({
  breakDownByCategory: z
    .boolean()
    .default(false)
    .describe(
      "Whether to provide a breakdown of the total by category. Defaults to false.",
    ),
  endMonth: z
    .string()
    .regex(/^\d{4}-\d{2}$/, {
      message: "End month needs to be in YYYY-MM format",
    })
    .nullish()
    .describe(
      "End month to filter targets, in YYYY-MM format. Defaults to the next month after startMonth.",
    ),
  startMonth: z
    .string()
    .regex(/^\d{4}-\d{2}$/, {
      message: "Start month needs to be in YYYY-MM format",
    })
    .describe("Start month to filter targets, in YYYY-MM format"),
});

export const BudgetInputSchema = z
  .object({
    breakdown: z
      .record(
        z.string().min(1),
        decimal({
          allowZero: true,
          errorMsg: "Budget has to be more than zero",
        }),
      )
      .describe(
        "Breakdown of the budget by category. Keys are category names, values are budget amounts.",
      ),
  })
  .transform((data) => {
    const breakdownTotal = Decimal.sum(...Object.values(data.breakdown));
    return {
      ...data,
      breakdown: data.breakdown,
      total: breakdownTotal,
    };
  });

export function parseBudgetFilterInput(budgetFilter: unknown) {
  return safeParseObjectToSchema(budgetFilter, TargetFilterSchema);
}

export function parseBudgetInput(budget: unknown) {
  return safeParseObjectToSchema(budget, BudgetInputSchema);
}
