import AccountAvatar from "@/components/account/AccountAvatar";
import AccountLink from "@/components/account/AccountLink";
import MessageCard from "@/components/card/MessageCard";
import SendMessageDialog from "@/components/dialog/SendMessageDialog";
import SendPrivateFeedbackDialog from "@/components/dialog/SendPrivateFeedbackDialog";
import EntityList from "@/components/entity/EntityList";
import Layout from "@/components/layout";
import { FullWidthSkeleton, MediumLoadingButton } from "@/components/styled";
import { DialogContext } from "@/context/dialog";
import useError from "@/hooks/useError";
import useSigner from "@/hooks/useSigner";
import { didToAddress } from "@/utils/pushprotocol";
import { useProfilesOwnedBy } from "@lens-protocol/react-web";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { IMessageIPFS, PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { EVENTS, createSocketConnection } from "@pushprotocol/socket";
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
  const { data: accountLensProfiles } = useProfilesOwnedBy({
    address: didToAddress(did as string),
    limit: 10,
  });

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

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, did]);

  return (
    <Layout maxWidth="sm">
      {did && messages ? (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography fontWeight={700} textAlign="center">
            Chat w/{" "}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AccountAvatar
              account={didToAddress(did as string)}
              accountLensProfile={accountLensProfiles?.[0]}
              size={48}
              emojiSize={24}
            />
            <AccountLink
              account={didToAddress(did as string)}
              accountLensProfile={accountLensProfiles?.[0]}
              variant="h4"
            />
          </Stack>
          <Divider sx={{ width: 1, borderWidth: 2, my: 2 }} />
          <Stack
            direction="row"
            spacing={2}
            alignItems="stretch"
            justifyContent="space-between"
            width={1}
          >
            <MediumLoadingButton
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
            </MediumLoadingButton>
            <MediumLoadingButton
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
            </MediumLoadingButton>
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
            sx={{ mt: 2 }}
          />
        </Box>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}
