import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';

import type { AppRouter } from '../backend/app';
import { refreshToken, token } from '../states/authentication';
import { extendSuperjson } from './extendSuperjson';

extendSuperjson(superjson);

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // browser should use relative path
    return '';
  }
  if (process.env.VERCEL_URL as string) {
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`
  };
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
export const trpc = createTRPCNext<AppRouter>({
  config: () => ({
    queryClientConfig: {
      defaultOptions: {
        queries: {
          cacheTime: 0,
          refetchOnWindowFocus: false,
          retry: 0
        },
      },
    },
    transformer: superjson,
    links: [
      httpBatchLink({
        headers() {
          return {
            authorization: token.peek(),
            refreshToken: refreshToken.peek(),
          };
        },
        url: `${getBaseUrl()}/api/trpc`,
      }),
    ],
  }),
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});