import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const openAI = new OpenAIApi(
  new Configuration({
    apiKey: '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'
  })
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = z.object({
    prompt: z.string()
  }).parse(req.body);
  try {
    const completion = await openAI.createChatCompletion({
      messages: [
        { role: 'user', 'content': prompt },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      max_tokens: 75
    })
    res.status(200).json({
      message: completion.data.choices[0].message?.content.replace(/\\n/g, ' ')
    });
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: (e as Error).message,
      error: "Error while fetching response"
    });
  }
}
