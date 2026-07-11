import { z } from 'zod';
import { router, publicProcedure } from '../init';

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello, ${input.name}!` };
    }),
});

export type AppRouter = typeof appRouter;
