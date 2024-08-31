import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getServerAuthSession();

  if (!auth) {
    redirect("/auth/login");
  }

  return children;
}
