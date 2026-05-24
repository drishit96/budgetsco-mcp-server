#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import "dotenv/config";

import { registerCategoriesTools } from "./modules/categories/categories.tools.js";
import { registerCurrencyTools } from "./modules/currency/currency.tools.js";
import { registerRecurringTransactionTool } from "./modules/recurringTransactions/recurringTransaction.tools.js";
import { registerTargetTools } from "./modules/target/target.tools.js";
import { registerTransactionsTools } from "./modules/transactions/transaction.tools.js";

if (!process.env.BUDGETSCO_ACCESS_TOKEN) {
  throw new Error(
    "BUDGETSCO_ACCESS_TOKEN environment variable is not set. Please set it to your Budgetsco personal access token.",
  );
}

const server = new McpServer({
  name: "Budgetsco MCP Server",
  version: "1.0.0",
});

registerTransactionsTools(server);
registerCategoriesTools(server);
registerRecurringTransactionTool(server);
registerTargetTools(server);
registerCurrencyTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);

process.on("SIGINT", () => {
  console.error("Shutting down server...");
  process.exit(0);
});
