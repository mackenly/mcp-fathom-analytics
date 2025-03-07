import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FathomApi, FathomApiError, AggregationParams } from "@mackenly/fathom-api";

export function registerAggregationTool(server: McpServer, fathomClient: FathomApi): void {
    server.tool(
        "get-aggregation",
        "Get aggregated analytics data from Fathom",
        {
            entity: z.enum(["pageview", "event"]).describe("The entity to aggregate (pageview or event)"),
            entity_id: z.string().describe("ID of the entity (site ID or event ID)"),
            aggregates: z.string().describe("Comma-separated list of aggregates to include (visits,uniques,pageviews,avg_duration,bounce_rate,conversions,unique_conversions,value)"),
            date_grouping: z.enum(["hour", "day", "month", "year"]).optional().describe("Optional date grouping"),
            field_grouping: z.string().optional().describe("Comma-separated fields to group by (e.g., hostname,pathname)"),
            sort_by: z.string().optional().describe("Field to sort by (e.g., pageviews:desc)"),
            timezone: z.string().optional().describe("Timezone for date calculations (default: UTC)"),
            date_from: z.string().describe("Start date (e.g., 2025-01-01 00:00:00 or 2025-01-01)"),
            date_to: z.string().describe("End date (e.g., 2025-12-31 23:59:59 or 2025-12-31)"),
            limit: z.number().positive().optional().describe("Limit on number of results"),
            filters: z.array(
                z.object({
                    property: z.string(),
                    operator: z.enum(["is", "is not", "is like", "is not like"]),
                    value: z.string(),
                })
            ).optional().describe("Array of filter objects"),
        },
        async (params: AggregationParams) => {
            try {
                const aggregationData = await fathomClient.api.reports.aggregation(params);
                
                // Check if data exists and is a proper array
                if (!aggregationData || !Array.isArray(aggregationData)) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: "No aggregation data found for the given parameters.",
                            },
                        ],
                    };
                }
                
                if (aggregationData.length === 0) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: "No aggregation data found for the given parameters.",
                            },
                        ],
                    };
                }

                // Format the aggregation results in a readable way
                let resultText = `Aggregation Results (${aggregationData.length} entries):\n\n`;
                
                // Get all possible keys from all data entries
                const allKeys = new Set<string>();
                aggregationData.forEach(item => {
                    if (item) {
                        Object.keys(item).forEach(key => allKeys.add(key));
                    }
                });
                
                // Format each data entry
                aggregationData.forEach((item, index) => {
                    if (!item) return;
                    resultText += `Entry ${index + 1}:\n`;
                    
                    Array.from(allKeys).sort().forEach(key => {
                        if (item[key] !== undefined) {
                            resultText += `${key}: ${item[key]}\n`;
                        }
                    });
                    
                    resultText += "---\n\n";
                });
                
                return {
                    content: [
                        {
                            type: "text",
                            text: resultText,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to retrieve aggregation data: ${error instanceof FathomApiError ? `${error.status}: ${error.message}` : String(error)}`,
                        },
                    ],
                };
            }
        },
    );
}