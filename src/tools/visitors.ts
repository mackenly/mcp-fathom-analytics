import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FathomApi, FathomApiError } from "@mackenly/fathom-api";

export function registerVisitorsTool(server: McpServer, fathomClient: FathomApi): void {
    server.tool(
        "get-current-visitors",
        "Get current visitors for a Fathom Analytics site",
        {
            site_id: z.string().describe("ID of the site to retrieve current visitors for"),
            detailed: z.boolean().optional().describe("Whether to include detailed content and referrer information"),
        },
        async ({ site_id, detailed = false }) => {
            try {
                const visitorsData = await fathomClient.api.reports.currentVisitors({
                    site_id,
                    detailed
                });
                
                if (visitorsData.total === 0) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `No current visitors for site ${site_id}.`,
                            },
                        ],
                    };
                }

                let responseText = `Current visitors for site ${site_id}: ${visitorsData.total}\n\n`;
                
                // Include detailed information if available and requested
                if (detailed && visitorsData.content && visitorsData.content.length > 0) {
                    responseText += "Top Content:\n";
                    visitorsData.content.forEach((item, index) => {
                        responseText += `${index + 1}. ${item.hostname}${item.pathname} - ${item.total} visitor(s)\n`;
                    });
                    responseText += "\n";
                }
                
                if (detailed && visitorsData.referrers && visitorsData.referrers.length > 0) {
                    responseText += "Top Referrers:\n";
                    visitorsData.referrers.forEach((item, index) => {
                        responseText += `${index + 1}. ${item.referrer_hostname}${item.referrer_pathname} - ${item.total} visitor(s)\n`;
                    });
                }
                
                return {
                    content: [
                        {
                            type: "text",
                            text: responseText,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to retrieve current visitors: ${error instanceof FathomApiError ? `${error.status}: ${error.error}` : String(error)}`,
                        },
                    ],
                };
            }
        },
    );
}