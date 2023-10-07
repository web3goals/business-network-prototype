import { DialogContext } from "@/context/dialog";
import { partnerAbi } from "@/contracts/abi/partner";
import { isAddressesEqual } from "@/utils/addresses";
import { Box, SxProps, Typography } from "@mui/material";
import { useContext } from "react";
import { zeroAddress } from "viem";
import { useAccount, useContractRead } from "wagmi";
import MessageCard from "../card/MessageCard";
import PostFeedbackDialog from "../dialog/PostFeedbackDialog";
import EntityList from "../entity/EntityList";
import { LargeLoadingButton, ThickDivider } from "../styled";

/**
 * Component with account feedback.
 */
export default function AccountFeedback(props: {
  account: string;
  accountPartner: any;
  sx?: SxProps;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { address: connectedAccount } = useAccount();
  const isOwner = isAddressesEqual(props.account, connectedAccount);
  const isJoined = props.accountPartner.partner != zeroAddress;

  /**
   * Define an account partner feedback
   */
  const { data: accountPartnerFeedback } = useContractRead({
    address: props.accountPartner.partner,
    abi: partnerAbi,
    functionName: "getFeedback",
    args: [],
    enabled: Boolean(props.accountPartner.partner),
  });

  if (!isJoined) {
    return <></>;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ ...props.sx }}
    >
      <ThickDivider />
      <Typography variant="h4" textAlign="center" fontWeight={700} mt={6}>
        🗣️ Feedback
      </Typography>
      <Typography textAlign="center" mt={1}>
        that may motivate you to connect with that person
      </Typography>
      {!isOwner && (
        <LargeLoadingButton
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() =>
            showDialog?.(
              <PostFeedbackDialog
                accountPartner={props.accountPartner}
                onClose={closeDialog}
              />
            )
          }
        >
          Post Feedback
        </LargeLoadingButton>
      )}
      <EntityList
        entities={[...((accountPartnerFeedback as any[]) || [])].reverse()}
        renderEntityCard={(feedback, index) => (
          <MessageCard
            key={index}
            account={feedback.author}
            date={Number(feedback.date) * 1000}
            text={feedback.content}
          />
        )}
        noEntitiesText="😐 no feedback"
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
