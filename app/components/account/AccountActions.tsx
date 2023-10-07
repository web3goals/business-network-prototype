import { DialogContext } from "@/context/dialog";
import { isAddressesEqual } from "@/utils/addresses";
import { addressToDid } from "@/utils/pushprotocol";
import { Stack, SxProps } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";
import BecomePartnerDialog from "../dialog/BecomePartnerDialog";
import { LargeLoadingButton } from "../styled";

/**
 * Component with account actions.
 */
export default function AccountActions(props: {
  account: string;
  accountPartner: any;
  sx?: SxProps;
}) {
  const { address: connectedAccount } = useAccount();
  const isOwner = isAddressesEqual(props.account, connectedAccount);
  const isJoined = props.accountPartner.partner != zeroAddress;

  return (
    <Stack direction="column" alignItems="center" sx={{ ...props.sx }}>
      {isOwner && !isJoined && <JoinNetworkButton />}
      {isOwner && isJoined && <OpenChatsButton />}
      {!isOwner && isJoined && <SendMessageButton account={props.account} />}
    </Stack>
  );
}

function JoinNetworkButton() {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <LargeLoadingButton
      variant="contained"
      onClick={() => {
        showDialog?.(<BecomePartnerDialog onClose={closeDialog} />);
      }}
    >
      Join Network
    </LargeLoadingButton>
  );
}

function OpenChatsButton() {
  return (
    <Link href="/chats" legacyBehavior>
      <LargeLoadingButton variant="outlined">Open Chats</LargeLoadingButton>
    </Link>
  );
}

function SendMessageButton(props: { account: string }) {
  return (
    <Link href={`/chats/${addressToDid(props.account)}`} legacyBehavior>
      <LargeLoadingButton variant="outlined">Send Message</LargeLoadingButton>
    </Link>
  );
}
