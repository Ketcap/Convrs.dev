import { createId } from "@paralleldrive/cuid2";
import type { SenderType } from "@prisma/client";
import { addChatInput, addMarkdownToChatInput } from "../states/chatState";

// this should be added after response
export const addMessageAsStream = async (data: ReadableStream<any>) => {
  const reader = data.getReader();
  const decoder = new TextDecoder();
  const id = createId();

  let done = false;
  let isFirst = true;
  let text = "";

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    text += chunkValue;

    if (isFirst) {
      // isFirst = false;
      // addChatInput({
      //   senderType: 'assistant' as SenderType,
      //   content: chunkValue,
      //   id: id,
      //   createdAt: new Date(),
      // });
    } else {
      addMarkdownToChatInput(id, text);
    }
  }
}

// getVoiceOutput(data.content, data.id, voiceToMessageMutation).then(
//   (res) => {
//     if (res) {
//       addVoiceToChatInput(data.id, res);
//     }
//   }
// ); 