// continue on this;
// import { NextApiRequest, NextApiResponse, NextConfig } from "next";

// import { openAIRouter } from "../../../api/openAI/router";
// import { createContext } from "../../../lib/context";

// import stream, { Readable } from 'stream'
// import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";
// import { IncomingMessage } from "http";
// import { read } from "fs";

// export const config = {
//   api: {
//     bodyParser: false,
//   }
// }

// async function buffer(readable: Readable) {
//   const chunks = [];
//   for await (const chunk of readable) {
//     chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
//   }
//   return Buffer.concat(chunks);
// }


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' })
//   }
//   const buf = await buffer(req);
//   const rawBody = JSON.parse(buf.toString('utf8'));
//   const openAI = openAIRouter.createCaller(createContext({ req, res }))
//   const responseStream = await openAI.getCompletion(rawBody);

//   const encoder = new TextEncoder();
//   const decoder = new TextDecoder();


//   const stream = new Readable({
//     async read() {
//       (responseStream.data as unknown as IncomingMessage).on('data', (chunk) => {
//         const data = decoder.decode(chunk) as any;
//         if (data === "data: [DONE]") {
//           return;
//         }
//         try {
//           const json = JSON.parse(data.replace('data:', ''));
//           const text = json.choices[0].delta.content;
//           this.push(text);
//         } catch (e) {
//           console.log(data);
//         }

//       })
//     }
//   });
//   res.setHeader('Content-Type', 'text/plain; charset=utf-8');
//   stream.pipe(res)
// }


