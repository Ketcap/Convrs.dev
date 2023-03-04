import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs/promises';
import { createReadStream, readFileSync } from "fs";
import { createId } from '@paralleldrive/cuid2';
import path from "path";
import formidable from 'formidable';

const ROUTE_PATH = path.resolve(path.join(process.cwd(), '/public/temp_voices'));

const openAI = new OpenAIApi(
  new Configuration({
    apiKey: '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'
  })
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const id = createId();

      // @ts-ignore
      const tempFilePath = files.file.filepath
      console.log(tempFilePath)
      const fileName = `${ROUTE_PATH}/${id}.mp3`;

      try {
        await fs.writeFile(fileName, readFileSync(tempFilePath), {
          encoding: 'utf8',
        });
        // await fs.writeFile(filePath, chunks);
        const transcript = await openAI.createTranscription(
          createReadStream(fileName) as unknown as File,
          'whisper-1'
        );
        res.status(200).json({
          text: transcript.data.text
        });
      } catch (e) {
        res.status(400).json({
          message: e.message,
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