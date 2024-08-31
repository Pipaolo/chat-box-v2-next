import axios from "axios";
import { getSession } from "next-auth/react";
import { env } from "~/env";
import { getServerAuthSession } from "~/server/auth";

const apiV1Client = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL + "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

apiV1Client.interceptors.request.use(async (config) => {
  const isClient = typeof window !== "undefined";

  if (isClient) {
    const session = await getSession();

    if (session?.tokenDetails) {
      config.headers.Authorization = `Bearer ${session.tokenDetails.token}`;
    }
    return config;
  }

  // Server Side
  const session = await getServerAuthSession();
  if (session?.tokenDetails) {
    config.headers.Authorization = `Bearer ${session.tokenDetails.token}`;
  }

  return config;
});

const apiClient = {
  v1: apiV1Client,
};

export default apiClient;
