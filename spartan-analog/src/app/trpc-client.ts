import { createTrpcClient } from '@analogjs/trpc';
import type { AppRouter } from '../server/trpc/routers';

export const { provideTrpcClient, TrpcClient } =
  createTrpcClient<AppRouter>({
    url: '/api/trpc',
  });
