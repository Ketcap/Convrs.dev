import { NextApiRequest, NextApiResponse } from "next";
import { createContext } from "@/lib/context";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const context = createContext({ req, res });
    const { email } = req.body;
    try {
      await context.prisma.subscriptionList.create({
        data: {
          email
        },
      })
      return res.json({});
    } catch (e) {
      return res.json({});
    }
  }
  return res.json({});
}