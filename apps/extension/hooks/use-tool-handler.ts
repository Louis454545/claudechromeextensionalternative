import { useEffect, useRef } from "react";
import { fetchAccessibilityTree } from "@/lib/accessibility";
import type { UIMessage } from "ai";

interface UseToolHandlerOptions {
  messages: UIMessage[];
  addToolOutput: (options: {
    tool: string;
    toolCallId: string;
    output: string;
  }) => Promise<void>;
}

export function useToolHandler({ messages, addToolOutput }: UseToolHandlerOptions) {
  const handledRef = useRef(new Set<string>());

  useEffect(() => {
    for (const message of messages) {
      if (message.role !== "assistant") continue;

      for (const part of message.parts) {
        if (
          "toolCallId" in part &&
          "state" in part &&
          part.type === "tool-get_accessibility_tree" &&
          part.state === "input-available" &&
          !handledRef.current.has(part.toolCallId)
        ) {
          handledRef.current.add(part.toolCallId);

          (async () => {
            try {
              const [tab] = await browser.tabs.query({
                active: true,
                currentWindow: true,
              });

              if (!tab?.id) {
                addToolOutput({
                  tool: "get_accessibility_tree",
                  toolCallId: part.toolCallId,
                  output: JSON.stringify({ error: "No active tab found" }),
                });
                return;
              }

              const tree = await fetchAccessibilityTree(tab.id);
              addToolOutput({
                tool: "get_accessibility_tree",
                toolCallId: part.toolCallId,
                output: tree
                  ? JSON.stringify(tree)
                  : JSON.stringify({ error: "Could not fetch accessibility tree" }),
              });
            } catch (err) {
              addToolOutput({
                tool: "get_accessibility_tree",
                toolCallId: part.toolCallId,
                output: JSON.stringify({
                  error: err instanceof Error ? err.message : "Unknown error",
                }),
              });
            }
          })();
        }
      }
    }
  }, [messages, addToolOutput]);
}
