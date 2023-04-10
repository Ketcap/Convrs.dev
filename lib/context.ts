import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from './prisma';
import { supabase } from './supabase';


export function createContext({
  req,
  res,
}: Partial<Omit<trpcNext.CreateNextContextOptions, 'req'>> & {
  req: {
    headers: {
      authorization?: string
    }
  }
}) {
  return { prisma: prisma, req, res, supabase };
}

export type Context = inferAsyncReturnType<typeof createContext>;