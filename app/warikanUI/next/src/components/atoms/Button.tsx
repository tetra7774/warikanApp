import { Button } from "@chakra-ui/react";
import { FC, useState } from "react";
import { SiTeal } from "react-icons/si";

type Props = {
  text: string,
  bg?: string,
  disabled?: boolean,
  onClick: () => void | Promise<void>,
};

const CustomButton: FC<Props> = ({ text, bg = "teal", onClick = () => { } }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const result = onClick(); // onClick を呼び出して戻り値を受け取る
      await result;             // 戻り値（Promise / 非Promise）を待つ
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        bg={`${bg}.500`}
        color="gray.50"
        _hover={{ bg: `${bg}.300` }}
        loading={loading}
      // disabled={disabled || loading}
      >
        {text}
      </Button>
    </>
  );
}

export default CustomButton;