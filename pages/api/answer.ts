import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { availableChatroomTypes, findChatroom } from "../../api/chatroom/chatrooms";

const openAI = new OpenAIApi(
  new Configuration({
    apiKey: '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'
  })
)

const chatInput = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
})

const requestInput = z.object({
  chatroom: z.enum(availableChatroomTypes),
  chatInput: z.array(chatInput)
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const chat = requestInput.parse(req.body);
  const chatroom = findChatroom(chat.chatroom);
  console.log(chatroom)
  try {
    const completion = await openAI.createChatCompletion({
      messages: [...chatroom.systemDirectives, ...chat.chatInput],
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      max_tokens: 150
    })
    if (completion.data.choices.length === 0) {
      throw new Error("No response found");
    }
    res.status(200).json(completion.data.choices[0].message);
  } catch (e) {
    res.status(500).json({
      message: (e as Error).message,
      error: "Error while fetching response"
    });
  }
}
