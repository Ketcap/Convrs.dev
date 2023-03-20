import { createId } from "@paralleldrive/cuid2";
import type { SenderType } from "@prisma/client";
import { addChatInput, editChatInput } from "../states/chatState";

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
    console.log(value)
    done = doneReading;
    const chunkValue = decoder.decode(value);
    console.log(chunkValue)
    text += chunkValue;

    if (isFirst) {
      isFirst = false;
      addChatInput({
        content: chunkValue,
        role: 'assistant' as SenderType,
        id: id,
        timestamp: new Date(),
      });
    } else {
      editChatInput(id, text);
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