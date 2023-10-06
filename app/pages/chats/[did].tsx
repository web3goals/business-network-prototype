import MessageCard from "@/components/card/MessageCard";
import SendMessageDialog from "@/components/dialog/SendMessageDialog";
import SendPrivateFeedbackDialog from "@/components/dialog/SendPrivateFeedbackDialog";
import EntityList from "@/components/entity/EntityList";
import Layout from "@/components/layout";
import { FullWidthSkeleton, LargeLoadingButton } from "@/components/styled";
import { DialogContext } from "@/context/dialog";
import useError from "@/hooks/useError";
import useSigner from "@/hooks/useSigner";
import { didToAddress, didToShortAddress } from "@/utils/pushprotocol";
import { Link as MuiLink, Stack, Typography } from "@mui/material";
import { IMessageIPFS, PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { EVENTS, createSocketConnection } from "@pushprotocol/socket";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

/**
 * Page with a chat.
 */
export default function Chat() {
  const router = useRouter();
  const { did } = router.query;
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { handleError } = useError();
  const { signer } = useSigner();
  const [messages, setMessages] = useState<IMessageIPFS[] | undefined>();

  async function loadData() {
    setMessages(undefined);
    try {
      if (signer && did) {
        // Init user
        const user = await PushAPI.initialize(signer, { env: ENV.STAGING });
        // Load messages
        const messages = await user.chat.history(did as string);
        setMessages(messages);
        // Init websocket to listen messages
        const pushSDKSocket = createSocketConnection({
          user: did as string,
          socketType: "chat",
          socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
          env: ENV.STAGING,
        });
        pushSDKSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => {
          user.chat
            .decrypt([message])
            .then((message) => setMessages([...message, ...messages]));
        });
      }
    } catch (error) {
      handleError(error as Error, true);
    }
  }

  // TODO: Rollback
  useEffect(() => {
    loadData();
    // setMessages([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, did]);

  return (
    <Layout maxWidth="sm">
      {did && messages ? (
        <>
          <Typography variant="h4" fontWeight={700} textAlign="center">
            💬 Chat with{" "}
            <Link
              href={`accounts/${didToAddress(did as string)}`}
              passHref
              legacyBehavior
            >
              <MuiLink>{didToShortAddress(did as string)}</MuiLink>
            </Link>
          </Typography>
          <Stack mt={2} spacing={2} alignItems="center">
            <LargeLoadingButton
              variant="contained"
              onClick={() =>
                showDialog?.(
                  <SendMessageDialog
                    recipientDid={did as string}
                    onClose={closeDialog}
                  />
                )
              }
            >
              Send Message
            </LargeLoadingButton>
            <LargeLoadingButton
              variant="outlined"
              onClick={() =>
                showDialog?.(
                  <SendPrivateFeedbackDialog
                    recipientDid={did as string}
                    onClose={closeDialog}
                  />
                )
              }
            >
              Send Private Feedback
            </LargeLoadingButton>
          </Stack>
          <EntityList
            entities={messages}
            renderEntityCard={(message: IMessageIPFS, index) => (
              <MessageCard
                account={didToAddress(message.fromDID)}
                date={message.timestamp}
                text={message.messageContent}
                privateFeedbackDialogEnabled
                key={index}
              />
            )}
            noEntitiesText="😐 no messages"
            sx={{ mt: 4 }}
          />
        </>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}
