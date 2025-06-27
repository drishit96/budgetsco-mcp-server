import { FastMCP } from "fastmcp";
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

const server = new FastMCP({
  name: "Budgetsco MCP Server",
  version: "1.0.0",
});

registerTransactionsTools(server);
registerCategoriesTools(server);
registerRecurringTransactionTool(server);
registerTargetTools(server);
registerCurrencyTools(server);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 9819;
await server.start({
  httpStream: {
    port,
  },
  transportType: "httpStream",
});
console.log(`Server started successfully on port ${port}`);

server.on("connect", (event) => {
  const session = event.session;
  console.log("Initial roots:", session.roots);
  session.on("rootsChanged", (event) => {
    console.log("Roots changed:", event.roots);
  });
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  process.exit(0);
});
