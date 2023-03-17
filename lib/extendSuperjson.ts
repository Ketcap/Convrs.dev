import superjson from 'superjson';
export const extendSuperjson = (sjson: typeof superjson) => sjson.registerCustom<Buffer, number[]>(
  {
    isApplicable: (v): v is Buffer => v instanceof Buffer,
    serialize: v => [...v],
    deserialize: v => Buffer.from(v)
  },
  "buffer"
);