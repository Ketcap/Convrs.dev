import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "@/lib/trpc";
import { Application, ConfigType } from "@prisma/client";


const configInput = z.object({
  application: z.nativeEnum(Application),
  key: z.string(),
  configType: z.nativeEnum(ConfigType).default(ConfigType.Key),
});

export const userRouter = router({
  me: privateProcedure.query(async ({ ctx }) => {
    return ctx.user
  }),
  updateAvatar: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          image: input,
        },
      });
    }),
  config: privateProcedure.input(
    configInput
  ).mutation(async ({ ctx, input }) => {
    return ctx.prisma.config.upsert({
      create: {
        key: input.key,
        userId: ctx.user.id,
        application: input.application,
        type: input.configType

      },
      where: {
        userId_application_type: {
          userId: ctx.user.id,
          application: input.application,
          type: input.configType
        },
      },
      update: {
        key: input.key,
      }
    })
  })
})