import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { FathomApi } from '@mackenly/fathom-api';
import { registerAccountTool } from "./tools/account.js";
import { registerSitesTool } from "./tools/sites.js";
import { registerEventsTool } from "./tools/events.js";
import { registerAggregationTool } from "./tools/aggregation.js";
import { registerVisitorsTool } from "./tools/visitors.js";

// Your Fathom Analytics API key should be provided via environment variable
const API_KEY = process.env.FATHOM_API_KEY || "";

// Create server instance
const server = new McpServer({
    name: "fathom-analytics",
    version: "1.0.2",
});

async function main() {
    // Check API key before instantiating the client
    if (!API_KEY || API_KEY.length === 0) {
        console.error("Error: FATHOM_API_KEY environment variable is not set.");
        console.error("Please set this variable to your Fathom Analytics API key.");
        process.exit(1);
    }

    // Only instantiate the client when we know we have an API key
    const fathomClient = new FathomApi({
        token: API_KEY,
    });

    // Register all tools
    registerAccountTool(server, fathomClient);
    registerSitesTool(server, fathomClient);
    registerEventsTool(server, fathomClient);
    registerAggregationTool(server, fathomClient);
    registerVisitorsTool(server, fathomClient);

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Fathom Analytics MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});