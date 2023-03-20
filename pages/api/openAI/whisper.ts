import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs/promises';
import { createReadStream, readFileSync } from "fs";
import { createId } from '@paralleldrive/cuid2';
import path from "path";
import formidable from 'formidable';
import { openAIRouter } from "../../../api/openAI/router";
import { createContext } from "../../../lib/context";

const ROUTE_PATH = path.resolve(path.join(process.cwd(), '/public/temp_voices'));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const openAI = await openAIRouter.createCaller(createContext({ req, res })).userOpenAi();
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const id = createId();

      // @ts-ignore
      const tempFilePath = files.file.filepath
      const fileName = `${ROUTE_PATH}/${id}.mp3`;

      try {
        await fs.writeFile(fileName, readFileSync(tempFilePath), {
          encoding: 'utf8',
        });
        const transcript = await openAI.createTranscription(
          createReadStream(fileName) as unknown as File,
          'whisper-1'
        );
        res.status(200).json({
          text: transcript.data.text
        });
      } catch (e) {
        res.status(400).json({
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