import { LoginButton } from "@/components/atoms/LoginoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../options";

export default async function Home() {
  const session = getServerSession(authOptions);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <LoginButton />
    </main>
  );
}
