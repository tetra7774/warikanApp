import { getServerSession } from "next-auth";
import { LogoutButton } from "@/components/atoms/LoginoutButton";
import { authOptions } from "./options";
import { redirect } from "next/navigation";
import { HeaderLayout } from "@/components/templates/HeaderLayout";
import { SessionProvider } from "@/app/ClientGetSession";
import { Toaster } from "@/components/ui/toaster";

export default async function Home() {
  return (
    <>
      <LogoutButton />
    </>
  );
}
