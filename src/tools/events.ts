import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FathomApi, FathomApiError } from "@mackenly/fathom-api";

export function registerEventsTool(server: McpServer, fathomClient: FathomApi): void {
    server.tool(
        "list-events",
        "List all events for a Fathom Analytics site (automatically handles pagination)",
        {
            site_id: z.string().describe("ID of the site to retrieve events for"),
            limit: z.number().positive().optional().describe("Optional limit on the number of events to return")
        },
        async ({ site_id, limit }) => {
            try {
                const events = await fathomClient.api.getAllEvents(site_id, limit);
                
                if (events.length === 0) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `No events found for site ${site_id}.`,
                            },
                        ],
                    };
                }

                const eventsText = events.map(event => 
                    `ID: ${event.id}\nName: ${event.name}\nCreated: ${event.created_at}\n`
                ).join("\n---\n\n");
                
                return {
                    content: [
                        {
                            type: "text",
                            text: `All events for site ${site_id} (${events.length}):\n\n${eventsText}`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to retrieve events: ${error instanceof FathomApiError ? `${error.status}: ${error.error}` : String(error)}`,
                        },
                    ],
                };
            }
        },
    );
}