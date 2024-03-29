import { z } from "zod";
import { publicProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";

const signupInput = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8)
})

const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const authenticationRouter = router({
  signUp: publicProcedure.input(signupInput).mutation(async ({ input, ctx }) => {
    const { email, password, name } = input;
    const { data, error } = await ctx.supabase.auth.signUp({
      email,
      password
    })
    if (error) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });
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
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Something went wrong!' });
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
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Check your email and password' });
    }
    return { user: data.user, session: data.session };
  }),
})