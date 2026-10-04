import { HeaderLayout } from "@/components/templates/HeaderLayout";
import { memo, FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const SubLayout: FC<Props> = memo(({ children }) => {
  return (
    <>
      {children}
    </>
  );
});

export default SubLayout;
