interface ApiRequestConfig {
  body?: unknown;
  method?: "DELETE" | "GET" | "POST";
  path: string;
  queryParams?: Record<string, string[]>;
}

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
}

export async function callApi<T>({
  body,
  method = "GET",
  path,
  queryParams,
}: ApiRequestConfig): Promise<ApiResponse<T>> {
  const url = new URL(`https://budgetsco.fly.dev/api${path}`);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, values]) => {
      values.forEach((value) => {
        url.searchParams.append(key, value);
      });
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.BUDGETSCO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  let responseBody;
  try {
    responseBody = isJson ? await response.json() : await response.text();
  } catch {
    responseBody = { message: "Failed to parse response" };
  }

  if (!response.ok) {
    throw new Error(
      JSON.stringify({
        body: responseBody,
        status: response.status,
        statusText: response.statusText,
      }),
    );
  }

  return {
    data: responseBody as T,
    status: response.status,
    statusText: response.statusText,
  };
}
