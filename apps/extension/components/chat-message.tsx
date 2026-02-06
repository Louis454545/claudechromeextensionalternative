import type { UIMessage } from "ai";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolOutput,
} from "@/components/ai-elements/tool";

interface ChatMessageProps {
  message: UIMessage;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isLastMessage = isStreaming && message.role === "assistant";

  return (
    <Message from={message.role}>
      <MessageContent>
        {message.parts.map((part, i) => {
          switch (part.type) {
            case "text":
              return (
                <MessageResponse
                  key={`${message.id}-text-${i}`}
                >
                  {part.text}
                </MessageResponse>
              );

            default:
              // Handle tool parts (type starts with "tool-")
              if (
                "toolCallId" in part &&
                "state" in part &&
                part.type.startsWith("tool-")
              ) {
                return (
                  <Tool key={`${message.id}-tool-${part.toolCallId}`}>
                    <ToolHeader
                      title="Accessibility Tree"
                      type={part.type as `tool-${string}`}
                      state={part.state}
                    />
                    {part.state === "output-available" && "output" in part && (
                      <ToolContent>
                        <ToolOutput output="Accessibility tree fetched" errorText={undefined} />
                      </ToolContent>
                    )}
                  </Tool>
                );
              }
              return null;
          }
        })}
      </MessageContent>
    </Message>
  );
}
