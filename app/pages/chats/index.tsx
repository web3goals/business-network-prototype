import EntityList from "@/components/entity/EntityList";
import Layout from "@/components/layout";
import {
  CardBox,
  FullWidthSkeleton,
  MediumLoadingButton,
} from "@/components/styled";
import useError from "@/hooks/useError";
import useSigner from "@/hooks/useSigner";
import { theme } from "@/theme";
import { didToAddress, didToShortAddress } from "@/utils/pushprotocol";
import { Typography, Box, Avatar, Link as MuiLink } from "@mui/material";
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
        const user = await PushAPI.initialize(signer, { env: ENV.STAGING });
        const chats = await user.chat.list("CHATS");
        const requests = await user.chat.list("REQUESTS");
        setChats(chats);
        setRequests(requests);
      }
    } catch (error: any) {
      handleError(error, true);
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
              <ChatCard chat={chat} key={index} />
            )}
            noEntitiesText="😐 no chats"
            sx={{ mt: 2 }}
          />
        </>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}

// TODO: Implement
function ChatCard(props: { chat: IFeeds }) {
  return (
    <CardBox sx={{ display: "flex", flexDirection: "row" }}>
      {/* Left part */}
      <Box>
        {/* Image */}
        <Avatar
          sx={{
            width: 54,
            height: 54,
            borderRadius: 48,
            background: theme.palette.divider,
          }}
        >
          <Typography fontSize={18}>💬</Typography>
        </Avatar>
      </Box>
      {/* Right part */}
      <Box
        width={1}
        ml={3}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
        <Link
          href={`/chats/${didToAddress(props.chat.did)}`}
          passHref
          legacyBehavior
        >
          <MuiLink variant="body2" fontWeight={700}>
            {didToShortAddress(props.chat.did)}
          </MuiLink>
        </Link>
        {props.chat.msg.timestamp && (
          <Typography variant="body2" color="text.secondary">
            {new Date(props.chat.msg.timestamp).toLocaleString()}
          </Typography>
        )}
        <Typography mt={1}>{props.chat.msg.messageContent}</Typography>
        <Link href={`/chats/${props.chat.did}`} legacyBehavior>
          <MediumLoadingButton variant="outlined" sx={{ mt: 1 }}>
            Open Chat
          </MediumLoadingButton>
        </Link>
      </Box>
    </CardBox>
  );
}

// TODO: Implement
function RequestCard() {
  return <CardBox sx={{ display: "flex", flexDirection: "row" }}>...</CardBox>;
}
