import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { extendPrisma } from './extendPrisma';
import { prisma } from './prisma';
import { supabase } from './supabase';

// let prismaExtended = extendPrisma(prisma)

export function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  return { prisma: prisma, req, res, supabase };
}

export type Context = inferAsyncReturnType<typeof createContext>;