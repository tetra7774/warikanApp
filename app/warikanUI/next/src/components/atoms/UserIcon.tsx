import { Box, Image } from "@chakra-ui/react";
import { useContext } from "react";
import { SessionContext } from "@/app/ClientGetSession";
import { FaUserAltSlash } from "react-icons/fa";

// type ClientCompProps = {
//   session: Session | null;
// };
export const UserIcon = () => {
  const session = useContext(SessionContext);
  if (!session) {
    return (
    <>
      <FaUserAltSlash color="white" size="40px"/>
    </>
    );
  }
  return (
    <Image
      ml={"5px"}
      src={session!.user.image}
      boxSize={{ base: "30px", md: "40px" }}
      alt="プロフィール画像"
      borderRadius={"full"}
    ></Image>
  );
};
