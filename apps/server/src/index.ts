import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@testextension/api/context";
import { appRouter } from "@testextension/api/routers/index";
import { auth } from "@testextension/auth";
import { env } from "@testextension/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { chatHandler } from "./chat";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: (origin) => {
      if (origin === env.CORS_ORIGIN) return origin;
      if (origin?.startsWith("chrome-extension://")) return origin;
      return null;
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["X-Conversation-Id"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.post("/api/chat", (c) => chatHandler(c));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  }),
);

app.get("/", (c) => {
  return c.text("OK");
});

export default app;
