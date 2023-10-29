import MessageCard from "@/components/card/MessageCard";
import EntityList from "@/components/entity/EntityList";
import Layout from "@/components/layout";
import { FullWidthSkeleton, MediumLoadingButton } from "@/components/styled";
import useError from "@/hooks/useError";
import useSigner from "@/hooks/useSigner";
import useToasts from "@/hooks/useToast";
import { didToAddress } from "@/utils/pushprotocol";
import { Typography } from "@mui/material";
import { IFeeds, PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/socket/src/lib/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Page with chats.
 */
export default function Chats() {
  const { handleError } = useError();
  const { signer } = useSigner();
  const [chats, setChats] = useState<IFeeds[] | undefined>();
  const [requests, setRequests] = useState<IFeeds[] | undefined>();

  async function loadData() {
    try {
      setChats(undefined);
      setRequests(undefined);
      if (signer) {
        const user = await PushAPI.initialize(signer, { env: ENV.PROD });
        const chats = (await user.chat.list("CHATS")).filter(
          (chat) => chat.did
        );
        const requests = (await user.chat.list("REQUESTS")).filter(
          (chat) => chat.did
        );
        setChats(chats);
        setRequests(requests);
      }
    } catch (error) {
      handleError(error as Error, true);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  return (
    <Layout maxWidth="sm">
      {chats && requests ? (
        <>
          <Typography variant="h4" fontWeight={700} textAlign="center">
            💬 Chats
          </Typography>
          <EntityList
            entities={chats}
            renderEntityCard={(chat, index) => (
              <MessageCard
                account={didToAddress(chat.did)}
                date={chat.msg.timestamp}
                text={chat.msg.messageContent}
                footer={
                  <Link href={`/chats/${chat.did}`} legacyBehavior>
                    <MediumLoadingButton variant="outlined" sx={{ mt: 1 }}>
                      Open Chat
                    </MediumLoadingButton>
                  </Link>
                }
                key={index}
              />
            )}
            noEntitiesText="😐 no chats"
            sx={{ mt: 2 }}
          />
          <Typography variant="h4" fontWeight={700} textAlign="center" mt={8}>
            👋 Requests
          </Typography>
          <EntityList
            entities={requests}
            renderEntityCard={(request, index) => (
              <RequestCard request={request} key={index} />
            )}
            noEntitiesText="😐 no requests"
            sx={{ mt: 2 }}
          />
        </>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}

function RequestCard(props: { request: IFeeds }) {
  const { handleError } = useError();
  const { showToastSuccess } = useToasts();
  const { signer } = useSigner();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  async function submit() {
    try {
      setIsFormSubmitting(true);
      if (!signer) {
        throw new Error(`Signer is not defined`);
      }
      const user = await PushAPI.initialize(signer, { env: ENV.PROD });
      await user.chat.accept(props.request.did);
      showToastSuccess("Request accepted, refresh the page to update data");
      setIsFormSubmitted(true);
    } catch (error) {
      handleError(error as Error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <MessageCard
      account={didToAddress(props.request.did)}
      date={props.request.msg.timestamp}
      text={props.request.msg.messageContent}
      footer={
        <MediumLoadingButton
          variant="outlined"
          sx={{ mt: 1 }}
          type="submit"
          loading={isFormSubmitting}
          disabled={isFormSubmitting || isFormSubmitted}
          onClick={() => submit()}
        >
          Accept Request
        </MediumLoadingButton>
      }
    />
  );
}
