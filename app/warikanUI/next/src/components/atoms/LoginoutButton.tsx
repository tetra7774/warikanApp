"use client";

import { Button, Spinner } from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

export const LoginButton = () => {
  const [isLineLoading, setIsLineLoading] = useState<boolean>(false);
  return (
    <>
      <Button
        bg="teal"
        color="gray.50"
        onClick={() => {
          console.log("LINEログインボタンが押されました");
          setIsLineLoading(true);
          signIn("line", { callbackUrl: "/home/register-receipt" });
        }}
      >
        {isLineLoading ? <Spinner /> : "ログイン"}
      </Button>
    </>
  );
};

export const LogoutButton = () => {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/signIn" })}
      bg="teal"
      color="gray.50"
    >
      ログアウト
    </Button>   
  );
};
