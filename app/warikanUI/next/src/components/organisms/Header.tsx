import { memo, FC } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/options";
import { ClientComp } from "./ClientComp";

export const Header: FC = memo(async () => {
  //const session = await getServerSession(authOptions);

  return (
    <>
      <ClientComp />
    </>
  );
});
