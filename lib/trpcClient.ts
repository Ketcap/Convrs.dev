import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';
import nookies from 'nookies';


import type { AppRouter } from '../api/app';
import { extendSuperjson } from './extendSuperjson';

extendSuperjson(superjson)

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';
  if (process.env.VERCEL_URL as string) {
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`
  };

  return `http://localhost:${process.env.PORT ?? 3000}`;
}
export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    const { token } = nookies.get(null, 'token')
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          headers: {
            Authorization: `${token}`
          },
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});