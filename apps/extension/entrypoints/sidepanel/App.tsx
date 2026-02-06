import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputBody,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { ChatMessage } from "@/components/chat-message";
import { useToolHandler } from "@/hooks/use-tool-handler";
import { BotIcon } from "lucide-react";

const SERVER_URL = "http://localhost:3000";

const transport = new DefaultChatTransport({
  api: `${SERVER_URL}/api/chat`,
});

function App() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, addToolOutput, stop } = useChat({
    transport,
  });

  useToolHandler({ messages, addToolOutput });

  const isStreaming = status === "streaming" || status === "submitted";

  const handleSubmit = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <BotIcon className="size-4" />
        <h1 className="text-sm font-semibold">AI Assistant</h1>
      </div>

      <Conversation className="relative flex-1 overflow-hidden">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="AI Assistant"
              description="Ask me anything about the current page or use me as a general assistant."
              icon={<BotIcon className="size-6" />}
            />
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={isStreaming}
              />
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {messages.length === 0 && (
        <div className="border-t px-3 py-2">
          <Suggestions>
            <Suggestion
              suggestion="Analyze this page's accessibility"
              onClick={handleSuggestionClick}
            />
            <Suggestion
              suggestion="Summarize the page content"
              onClick={handleSuggestionClick}
            />
            <Suggestion
              suggestion="Find accessibility issues"
              onClick={handleSuggestionClick}
            />
          </Suggestions>
        </div>
      )}

      <div className="border-t p-3">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this page..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <div />
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

export default App;
