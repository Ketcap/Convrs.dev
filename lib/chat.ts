import { createId } from "@paralleldrive/cuid2";
import { Application, SenderType } from "@prisma/client";

import { completionInput } from "@/backend/util/completionUtil";

import { currentChatroom } from "@/states/chatrooms";
import { token, user } from "@/states/authentication";
import { addChatInput, addMarkdownToChatInput, chatState } from "@/states/chatState";

export const getOpenAIAnswer = async (chatroomId: string) => {
  const userInfo = user.peek();
  const openAIKey = userInfo?.Configs.find((val) => val.application === Application.OpenAI);
  if (!openAIKey) return;

  const sanitizedMessages = chatState.peek().map((val) => ({
    senderType: val.senderType,
    content: val.content.replaceAll(/(\r\n|\n|\r)/gm, "")
  }));

  const { model, maxToken, directive, RoomFeatures } =
    currentChatroom.peek() ?? {};

  const body = completionInput.parse({
    messages: sanitizedMessages,
    model,
    maxToken,
    directive,
    RoomFeatures,
  });

  const response = await fetch("/api/openAI/completion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token.peek()}`,
      OpenAI: openAIKey.key,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return;
  }

  const data = response.body;
  if (!data) {
    return;
  }
  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;

  const id = createId();

  addChatInput({
    chatroomId,
    content: "",
    createdAt: new Date(),
    id,
    isFavorite: false,
    senderType: SenderType.Assistant,
    userId: null,
    Voice: null,
  });

  let message = "";

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    message += chunkValue;
    addMarkdownToChatInput(id, message);
  }

  return {
    message,
    id
  }
}