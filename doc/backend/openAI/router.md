### `openAIProcedure`
This function is a middleware function that creates an instance of OpenAI API client and adds it to the context object. It throws a `TRPCError` with code `FORBIDDEN` and message `Not Authenticated` if the user is not authenticated.

### `openAIRouter`
This function is a router that defines two endpoints:
- `getModels`: a query endpoint that returns an array of strings representing the available models.
- `userOpenAi`: a mutation endpoint that returns the OpenAI configuration for the authenticated user.