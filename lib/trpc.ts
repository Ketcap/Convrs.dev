import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { Context, createContext } from './context';
import { extendSuperjson } from './extendSuperjson';

extendSuperjson(superjson)

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure


const isAuth = t.middleware(async ({ next, ctx }) => {
  const token = ctx.req.headers.authorization;
  // const refreshToken = ctx.req.headers.refreshToken;
  try {
    const { data, error } = await ctx.supabase.auth.getUser(token);
    if (!data?.user) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not Authenticated' })
    }
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: data.user?.id
      },
      include: {
        Configs: true
      }
    })

    return next({
      ctx: {
        ...ctx,
        user
      }
    });
  }
  catch (e) {
    console.log(e)
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Not Authenticated' })
  }
});

export const privateProcedure = t.procedure.use(isAuth);