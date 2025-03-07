import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FathomApi, FathomApiError } from "@mackenly/fathom-api";

export function registerAccountTool(server: McpServer, fathomClient: FathomApi): void {
    server.tool(
        "get-account",
        "Get Fathom Analytics account information",
        {},
        async () => {
            try {
                const accountData = await fathomClient.api.account.get();

                return {
                    content: [
                        {
                            type: "text",
                            text: `Account Information:\n\nName: ${accountData.name}\nEmail: ${accountData.email}\nID: ${accountData.id}`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to retrieve account information: ${error instanceof FathomApiError ? `${error.status}: ${error.error}` : String(error)}`,
                        },
                    ],
                };
            }
        },
    );
}