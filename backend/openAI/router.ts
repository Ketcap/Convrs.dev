import { Application } from "@prisma/client";
import { privateProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";

import { getConfigOrThrow } from "@/backend/util/config";
import { createOpenAI } from "./util";

const openAIProcedure = privateProcedure.use(async ({ next, ctx }) => {
  try {
    const config = await getConfigOrThrow(ctx.user, Application.OpenAI);
    return next({
      ctx: {
        ...ctx,
        openAI: createOpenAI(config.key)
      }
    });
  }
  catch (e) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Not Authenticated' })
  }
});

export const openAIRouter = router({
  getModels: openAIProcedure
    .query(async ({ ctx }) => {
      const models = await ctx.openAI.listModels();
      if (models.status !== 200) {
        throw new Error('Error while fetching models');
      }
      return [
        'gpt-3.5-turbo', 'gpt-3.5-turbo-0301'
      ];
    }),
  userOpenAi: openAIProcedure
    .mutation(async ({ ctx }) => {
      const config = await getConfigOrThrow(ctx.user, Application.OpenAI);
      return config;
    })
})