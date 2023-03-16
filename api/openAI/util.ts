import { Configuration, OpenAIApi } from "openai"

export const createOpenAI = (key: string) => {
  return new OpenAIApi(
    new Configuration({
      apiKey: key
    })
  )
}