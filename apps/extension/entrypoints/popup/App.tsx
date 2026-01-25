import wxtLogo from "/wxt.svg";
import { useState } from "react";

import reactLogo from "@/assets/react.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-w-[350px] p-4 bg-background">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-center gap-4">
            <a href="https://wxt.dev" target="_blank" rel="noreferrer">
              <img
                src={wxtLogo}
                className="h-12 transition-all hover:drop-shadow-[0_0_1em_#54bc4ae0]"
                alt="WXT logo"
              />
            </a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">
              <img
                src={reactLogo}
                className="h-12 transition-all hover:drop-shadow-[0_0_1em_#61dafbaa]"
                alt="React logo"
              />
            </a>
          </div>
          <CardTitle className="text-center text-xl">WXT + React</CardTitle>
          <CardDescription className="text-center">
            Chrome Extension with Tailwind CSS v4
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Counter:</span>
              <Badge variant="secondary">{count}</Badge>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCount(0)}>
                Reset
              </Button>
              <Button size="sm" onClick={() => setCount((c) => c + 1)}>
                Increment
              </Button>
            </div>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="pt-4 flex-col gap-2">
          <p className="text-xs text-muted-foreground text-center">
            Edit <code className="bg-muted px-1 py-0.5 rounded text-xs">App.tsx</code> and save to
            test HMR
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Click on the logos to learn more
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
