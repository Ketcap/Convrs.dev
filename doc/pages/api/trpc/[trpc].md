### `trpcNext.createNextApiHandler(options: object): function`
This function creates an API handler for Next.js serverless functions using TRPC. It takes an options object as a parameter which can have the following properties:
- `router`: A TRPC router instance that defines the API routes and handlers.
- `createContext`: A function that creates a context object that can be used by the API handlers. This function is optional.
- `batching`: An object that enables or disables batching of multiple requests into a single request. This object has an `enabled` property that can be set to `true` or `false`. This property is optional.

### `config`
This is an object that defines the configuration options for the Next.js API. It has an `api` property that can have the following properties:
- `bodyParser`: An object that defines the options for parsing the request body. It has a `sizeLimit` property that sets the maximum size of the request body. This property is optional.