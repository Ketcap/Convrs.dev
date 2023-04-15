### `createOpenAI(key: string): OpenAIApi`

This function creates an instance of the OpenAIApi class from the "openai" package. It takes in a single parameter, `key`, which is a string representing the API key for the OpenAI service.

#### Parameters
- `key` (string): The API key for the OpenAI service.

#### Return Type
- `OpenAIApi`: An instance of the OpenAIApi class.

#### Example
```js
const openai = createOpenAI("my_api_key")
```