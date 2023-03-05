import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs/promises';
import { createReadStream, readFileSync } from "fs";
import { createId } from '@paralleldrive/cuid2';
import formidable from 'formidable';

const openAI = new OpenAIApi(
  new Configuration({
    apiKey: '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'
  })
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, _, files) => {
      const id = createId();

      // @ts-ignore
      const tempFilePath = files.file.filepath
      const fileName = `/tmp/${id}.mp3`;

      try {
        await fs.writeFile(fileName, readFileSync(tempFilePath), {
          encoding: 'utf8',
        });
        const transcript = await openAI.createTranscription(
          createReadStream(fileName) as unknown as File,
          'whisper-1'
        );
        res.status(200).json({
          message: transcript.data.text
        });
      } catch (e) {
        res.status(500).json({
          message: (e as Error).message,
          error: "Error while fetching response"
        })
      } finally {
        fs.unlink(fileName)
      }
    });
  }
}

export const config = {
  api: {
    bodyParser: false
  },
};