# Budgetsco MCP Server

MCP Server for Budgetsco, enabling personal finance management through transactions, budgeting, and financial tracking capabilities.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Available Tools](#available-tools)
- [Development](#development)
- [Configuration](#configuration)
- [License](#license)

## Prerequisites

- Node.js (version 22.x recommended)
  - Check your Node.js version with: `node --version`
- A Budgetsco personal access token

## Setup

1. Clone the repository
2. Create a `.env` file in the root directory with your Budgetsco access token:
   ```env
   BUDGETSCO_ACCESS_TOKEN='your_access_token_here'
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Available Tools

The server provides several tools for managing personal finances:

### Transactions

- Create, edit, and delete transactions
- View transaction history with flexible filters
- Support for various payment modes (Cash, Credit Card, UPI, etc.)

### Categories

- Get predefined and custom categories
- Create and manage custom categories
- Categorize transactions for better financial tracking

### Recurring Transactions

- Set up automated recurring transactions
- Manage daily, monthly, or yearly recurring entries
- Skip or mark recurring transactions as complete

### Budgeting

- Set and manage budgets for different categories
- Track budget utilization
- Get detailed budget breakdowns

### Currency

- Set and manage currency preferences
- Support for multiple international currencies

## Development

Available commands:

- `npm run dev`: Start the development server
- `npm run start`: Run the production server
- `npm run build`: Build the project
- `npm run lint`: Run linting checks
- `npm run format`: Format code
- `npm run test`: Run tests

## Configuration

### Environment Variables

- `BUDGETSCO_ACCESS_TOKEN` (required): Your Budgetsco personal access token

### Client Configuration

To use this MCP server with clients like Claude, add the following configuration:

```json
{
  "mcpServers": {
    "budgetsco": {
      "command": "npx",
      "args": ["@budgetsco/mcp"],
      "env": {
        "BUDGETSCO_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Built with [FastMCP](https://github.com/punkpeye/fastmcp)
