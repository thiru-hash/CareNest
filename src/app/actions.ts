"use server";

import { summarizeClientLogs, SummarizeClientLogsInput, SummarizeClientLogsOutput } from "@/ai/flows/summarize-client-logs";

export type FormState = {
    message: string;
    summary?: SummarizeClientLogsOutput;
    error?: boolean;
}

export async function summarizeLogsAction(
    prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    const clientName = formData.get("clientName") as string;
    const supportLogs = formData.get("supportLogs") as string;

    if (!clientName || !supportLogs) {
        return { message: "Client name and logs are required.", error: true };
    }
    
    try {
        const input: SummarizeClientLogsInput = { clientName, supportLogs };
        const result = await summarizeClientLogs(input);
        return { message: "Summary generated successfully.", summary: result };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        return { message: `Failed to generate summary: ${errorMessage}`, error: true };
    }
}
