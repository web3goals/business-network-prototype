import { partnerAbi } from "@/contracts/abi/partner";
import { Box, SxProps, Typography } from "@mui/material";
import { zeroAddress } from "viem";
import { useContractRead } from "wagmi";
import MessageCard from "../card/MessageCard";
import EntityList from "../entity/EntityList";
import { ThickDivider } from "../styled";

/**
 * Component with account feedback.
 */
export default function AccountFeedback(props: {
  account: string;
  accountPartner: any;
  sx?: SxProps;
}) {
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

  console.log("accountPartnerFeedback", accountPartnerFeedback); // TODO: Delete

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
      {/* TODO: Display button to post feedback */}
      <EntityList
        entities={accountPartnerFeedback as any[]}
        renderEntityCard={(feedback, index) => (
          <MessageCard
            account={feedback.author}
            date={feedback.date}
            text={feedback.content}
          />
        )}
        noEntitiesText="😐 no feedback"
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
