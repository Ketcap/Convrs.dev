import { Configuration, OpenAIApi } from "openai"
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const createOpenAI = (key: string) => {
  return new OpenAIApi(
    new Configuration({
      apiKey: key
    })
  )
}
export const createStream = (res: Request, onFinish: (text: string) => void) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let message = '';

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            onFinish(message)
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            message += text;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        const text = decoder.decode(chunk)
        console.log(text);
        parser.feed(text);
      }
    }
  });

  return stream;
}