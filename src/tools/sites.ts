import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FathomApi, FathomApiError } from "@mackenly/fathom-api";

export function registerSitesTool(server: McpServer, fathomClient: FathomApi): void {
    server.tool(
        "list-sites",
        "List all Fathom Analytics sites on the account",
        {
            limit: z.number().positive().optional().describe("Optional limit on the number of sites to return")
        },
        async ({ limit }) => {
            try {
                const sites = await fathomClient.api.getAllSites(limit);
                
                if (sites.length === 0) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: "No sites found.",
                            },
                        ],
                    };
                }

                const sitesText = sites.map(site => 
                    `ID: ${site.id}\nName: ${site.name}\nSharing: ${site.sharing}\nCreated: ${site.created_at}\n`
                ).join("\n---\n\n");
                
                return {
                    content: [
                        {
                            type: "text",
                            text: `Sites (${sites.length}):\n\n${sitesText}`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to retrieve sites: ${error instanceof FathomApiError ? `${error.status}: ${error.error}` : String(error)}`,
                        },
                    ],
                };
            }
        },
    );
}