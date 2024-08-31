import { api } from "~/trpc/server";

export default async function Profile() {
  const userDetails = await api.auth.getUserDetails();
  console.log("User Details: ", userDetails);

  return (
    <main>
      <h1>Profile</h1>
      <p>Welcome, {userDetails?.email}!</p>
    </main>
  );
}
