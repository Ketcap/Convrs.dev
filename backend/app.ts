import { router } from "../lib/trpc";
import { authenticationRouter } from "./authentication/router";
import { chatroomRouter, messageRouter } from "./chatroom/routes";
import { openAIRouter } from "./openAI/router";
import { userRouter } from "./user/routes";


export const appRouter = router({
  chatroom: chatroomRouter,
  message: messageRouter,
  authentication: authenticationRouter,
  openAI: openAIRouter,
  user: userRouter,
});


// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;