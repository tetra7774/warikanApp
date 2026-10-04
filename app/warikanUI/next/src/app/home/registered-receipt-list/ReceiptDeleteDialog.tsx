import CustomButton from "@/components/atoms/Button";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { useRouter } from 'next/navigation'
import { FC, useContext } from "react";
import { SessionContext } from "@/app/ClientGetSession";
import { Toaster, toaster } from "@/components/ui/toaster"
import { TReceipt } from "@/types/reciept";

type Props = {
    receipt: TReceipt;
};

const ReceiptDeleteDialog: FC<Props> = ({ receipt }) => {

    // routerの取得
    const router = useRouter();
    // sessionの取得
    const session = useContext(SessionContext);

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button bg="red.500">削除</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Note</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <p>
                                本当に登録したレシートを削除しますか？
                            </p>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>

                            <CustomButton text={"削除"} bg={"red"} onClick={async () => {
                                console.log("Delete button clicked");
                                console.log(`${process.env.APIENDPOINT}/receipt/` + `${receipt.id}`)
                                console.log("Session User ID:", session?.user.id);
                                console.log("Receipt Created By:", receipt.createdBy);
                                if (session?.user.id === receipt.createdBy) {
                                    console.log("ログインユーザとレシートの登録ユーザが一致")
                                    const apiRes = await fetch("/api/callcustomapi/receipt/" + `${receipt.id}`, {
                                        method: 'DELETE',
                                    });
                                    console.log("Delete API Response Status:", apiRes.status);
                                    if (apiRes.ok) {
                                        toaster.create({
                                            description: "レシートの削除が完了しました。",
                                            type: "success",
                                        });
                                    }
                                } else {
                                    console.log("一致しません")
                                    toaster.create({
                                        description: "レシートを登録した本人以外は削除できません",
                                        type: "error",
                                        closable: true,
                                    })
                                }

                                router.refresh()
                            }
                            }></CustomButton>
                            <Toaster />

                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default ReceiptDeleteDialog;
