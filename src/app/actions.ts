"use server";

// This file is reserved for server actions.
// The previous summarizeLogsAction has been removed as the LogSummary component
// is no longer used on the client profile page.
export type FormState = {
    message: string;
    error?: boolean;
}
