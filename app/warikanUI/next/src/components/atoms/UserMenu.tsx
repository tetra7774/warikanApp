"use client";

import { UserIcon } from "./UserIcon";
import { SessionContext } from "@/app/ClientGetSession";

import { Box, IconButton ,Menu, Portal} from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";
import { memo, useContext } from "react";


const UserMenu = () => {
    const session = useContext(SessionContext);

    

  return (
    <>
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton aria-label="user icon" variant="plain">
            <UserIcon />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-txt">
                {session ? (
                  <Box onClick={() => signOut({ callbackUrl: "/signIn" })}>
                    ログアウト
                  </Box>
                ) : (
                  <Box
                    onClick={() => {
                      console.log("LINEログインボタンが押されました");
                      signIn("line", { callbackUrl: "/home/register-receipt" });
                    }}
                  >
                    ログイン
                  </Box>
                )}
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
    </>
  )
  
}

export default UserMenu;