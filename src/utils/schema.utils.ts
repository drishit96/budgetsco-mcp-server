import type { z } from "zod";

type SafeParseResult<T> =
  | {
      data: null;
      errors: { [key: string]: string };
    }
  | {
      data: T;
      errors: null;
    };

export function formatErrors(issues: z.ZodIssue[]) {
  const errors: { [key: string]: string } = {};
  issues.forEach((issue) => {
    errors[issue.path[0]] = issue.message;
  });
  return errors;
}

export function safeParseObjectToSchema<T extends z.ZodType>(
  input: unknown,
  schema: T,
): SafeParseResult<z.infer<T>> {
  const output = schema.safeParse(input);
  if (output.success) {
    return {
      data: output.data,
      errors: null,
    };
  } else {
    const errors = formatErrors(output.error.issues);
    return { data: null, errors };
  }
}
