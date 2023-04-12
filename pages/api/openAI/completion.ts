import { NextRequest, } from "next/server";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

import { completionInput, prepareOpenAIInput } from "@/backend/util/completionUtil";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const openAiKey = req.headers.get('OpenAI');

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      message: 'Method Not Allowed'
    }),
      {
        status: 405,
        headers: {
          'content-type': 'application/json',
        },
      });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const json = completionInput.parse(await req.json());
  const { messages, directive, model, maxToken, RoomFeatures = [] } = json;

  const input = prepareOpenAIInput(
    {
      directive,
      maxToken,
      messages,
      model,
      RoomFeatures
    }
  )
  let counter = 0;

  const textStream = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      ...input,
      stream: true,
    }),
  });

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content ?? '';
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks & invoke an event for each SSE event stream
      const parser = createParser(onParse);

      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of (textStream as unknown as any).body) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });
  return new Response(stream);
}


