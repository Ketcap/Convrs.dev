import { Session, User } from "@supabase/supabase-js";
import nookies from "nookies";
import { refreshToken, token, user } from "@/states/authentication";


export const setAuthentication = async (data: {
  user?: User | null;
  session: Session | null;
}, callback: () => void) => {
  if (!data.session?.access_token || !data.session?.refresh_token) return;

  nookies.set(null, "token", data.session?.access_token, {
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  nookies.set(null, "refreshToken", data.session?.refresh_token, {
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  token.value = data.session?.access_token;
  refreshToken.value = data.session?.refresh_token;
  callback();
}


export const removeAuthentication = async () => {
  nookies.destroy(null, "token");
  nookies.destroy(null, "refreshToken");
  token.value = undefined;
  refreshToken.value = undefined;
  user.value = null;
}