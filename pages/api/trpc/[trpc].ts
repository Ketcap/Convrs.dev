import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../api/app';
import { createContext } from '../../../lib/context';
// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  batching: { enabled: true }
});