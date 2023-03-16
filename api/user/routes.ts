import { SenderType } from "@prisma/client";
import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "../../lib/trpc";

const signupInput = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8)
})

const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const userRouter = router({
  signUp: publicProcedure.input(signupInput).mutation(async ({ input, ctx }) => {
    const { email, password, name } = input;
    const { data, error } = await ctx.supabase.auth.signUp({
      email,
      password
    })
    if (error) {
      throw error;
    }
    // This assertion is needed because the type of data.session is Session | null and it's defined on supabase dashboard depending on auto sign in or not
    const { user } = data.session!
    try {
      await ctx.prisma.user.create({
        data: {
          id: user.id,
          name,
          email
        }
      })
    }
    catch (e) {
      ctx.supabase.auth.admin.deleteUser(user.id)
    }

    return { session: data.session };
  }),
  signIn: publicProcedure.input(signinInput).mutation(async ({ input, ctx }) => {
    const { email, password } = input;
    const { data, error } = await ctx.supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      throw error;
    }
    return { user: data.user, session: data.session };
  }),
  me: privateProcedure.query(async ({ ctx }) => {
    return ctx.user
  })
})