import wxtLogo from "/wxt.svg";
import { useState } from "react";

import reactLogo from "@/assets/react.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="h-screen w-full bg-background p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <a href="https://wxt.dev" target="_blank" rel="noreferrer">
          <img
            src={wxtLogo}
            className="h-8 transition-all hover:drop-shadow-[0_0_1em_#54bc4ae0]"
            alt="WXT logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className="h-8 transition-all hover:drop-shadow-[0_0_1em_#61dafbaa]"
            alt="React logo"
          />
        </a>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">WXT + React</h1>
          <p className="text-xs text-muted-foreground">Side Panel Extension</p>
        </div>
      </div>

      <Separator />

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Counter Demo</CardTitle>
            <CardDescription>Test the side panel functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current value:</span>
                <Badge variant="secondary" className="text-lg px-3">
                  {count}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCount(0)}
                >
                  Reset
                </Button>
                <Button className="flex-1" onClick={() => setCount((c) => c + 1)}>
                  Increment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Development</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Edit <code className="bg-muted px-1 py-0.5 rounded text-xs">App.tsx</code> and save to
              test HMR
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Powered by shadcn/ui + Tailwind CSS v4
        </p>
      </div>
    </div>
  );
}

export default App;
