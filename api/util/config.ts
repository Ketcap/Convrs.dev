import { Application, Config, User } from "@prisma/client";

export const getConfigOrThrow = async (user: User & { Configs: Config[] }, app: Application) => {
  const config = user.Configs.find((config) => config.application === app);
  if (!config) {
    throw new Error("No OpenAI config found");
  }
  return config;
}