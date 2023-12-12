import { auth, signOut } from "@/auth";

export default async function Vault() {
  const session = await auth();
  // console.log(session);

  return (
    <main>
      <form
        action={async () => {
          "use server";
          signOut();
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </main>
  );
}
