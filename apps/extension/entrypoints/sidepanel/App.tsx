import { RefreshCw, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchAccessibilityTree,
  type AccessibilityNode,
} from "@/lib/accessibility";

function App() {
  const [accessibilityTree, setAccessibilityTree] =
    useState<AccessibilityNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchTree = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        throw new Error("No active tab found");
      }

      const tree = await fetchAccessibilityTree(tab.id);

      if (tree) {
        setAccessibilityTree(tree);
      } else {
        setError("Could not fetch accessibility tree");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(message);
      console.error("Failed to fetch accessibility tree:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b p-3">
        <div className="flex-1">
          <h1 className="text-base font-semibold">Accessibility Tree</h1>
        </div>
        <Button
          size="sm"
          onClick={handleFetchTree}
          disabled={isLoading}
          className="gap-1.5"
        >
          <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Loading..." : "Fetch"}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-3">
        {error && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="flex items-center gap-2 py-3">
              <AlertCircle className="size-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {!accessibilityTree && !isLoading && !error && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Get Started</CardTitle>
              <CardDescription>
                Click "Fetch" to capture the accessibility tree.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {isLoading && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Loading...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        )}

        {accessibilityTree && !isLoading && (
          <ScrollArea className="h-full rounded border bg-muted/30">
            <pre className="p-3 text-xs">
              {JSON.stringify(accessibilityTree, null, 2)}
            </pre>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

export default App;
