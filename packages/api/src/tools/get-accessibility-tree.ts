import { tool } from "ai";
import { z } from "zod";

export const getAccessibilityTree = tool({
  description:
    "Fetch the accessibility tree of the current web page the user is viewing. Use this to understand the page structure, find elements, and help the user with web accessibility tasks.",
  inputSchema: z.object({}),
  // No execute — handled client-side by the extension
});
