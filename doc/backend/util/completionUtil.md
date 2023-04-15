### `prepareOpenAIInput`

This function prepares the input for OpenAI's chat completion API. It takes an object as an argument with the following properties:

- `RoomFeatures`: An array of `RoomFeature` enum values that determine how the context messages should be selected.
- `maxToken`: A number that determines the maximum number of tokens to generate in the response.
- `model`: A string that specifies the name of the OpenAI model to use.
- `messages`: An array of objects with `content` and `senderType` properties that represent the chat messages.
- `directive`: A string that represents the directive to be sent to the OpenAI API.

The function returns an object with the following properties:

- `model`: The name of the OpenAI model to use.
- `max_tokens`: The maximum number of tokens to generate in the response.
- `temperature`: The sampling temperature to use when generating the response.
- `n`: The number of responses to generate.
- `messages`: An array of objects with `content`, `role`, and `name` properties that represent the chat messages.

### `completionInput`

This is a Zod schema that defines the shape of the input object for the `prepareOpenAIInput` function. It has the following properties:

- `model`: A string that specifies the name of the OpenAI model to use.
- `maxToken`: A number that determines the maximum number of tokens to generate in the response.
- `messages`: An array of objects with `content` and `senderType` properties that represent the chat messages.
- `directive`: A string that represents the directive to be sent to the OpenAI API.
- `RoomFeatures`: An array of `RoomFeature` enum values that determine how the context messages should be selected.