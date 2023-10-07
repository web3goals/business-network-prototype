import { partnerAbi } from "@/contracts/abi/partner";
import useUriDataLoader from "@/hooks/useUriDataLoader";
import { PartnerDetails } from "@/types";
import { Chip, Stack, SxProps } from "@mui/material";
import { zeroAddress } from "viem";
import { useContractRead } from "wagmi";

/**
 * Component with account tags.
 */
export default function AccountTags(props: {
  account: string;
  accountPartner: any;
  sx?: SxProps;
}) {
  const isJoined = props.accountPartner.partner != zeroAddress;

  /**
   * Define an account partner details
   */
  const { data: accountPartnerDetailsUri } = useContractRead({
    address: props.accountPartner.partner,
    abi: partnerAbi,
    functionName: "details",
    args: [],
    enabled: isJoined,
  });
  const { data: accountPartnerDetails } = useUriDataLoader<PartnerDetails>(
    accountPartnerDetailsUri as string
  );

  if (!accountPartnerDetails) {
    return <></>;
  }

  return (
    <Stack spacing={1} sx={{ ...props.sx }}>
      {accountPartnerDetails.tags.map((tag, index) => (
        <Chip key={index} label={tag} />
      ))}
    </Stack>
  );
}
