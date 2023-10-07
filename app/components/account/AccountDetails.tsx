import { useProfilesOwnedBy } from "@lens-protocol/react-web";
import { Box, SxProps } from "@mui/material";
import AccountAvatar from "./AccountAvatar";
import AccountBio from "./AccountBio";
import AccountLensLink from "./AccountLensLink";
import AccountLink from "./AccountLink";
import AccountTags from "./AccountTags";

/**
 * Component with account details.
 */
export default function AccountDetails(props: {
  account: string;
  accountPartner: any;
  sx?: SxProps;
}) {
  const { data: accountLensProfiles } = useProfilesOwnedBy({
    address: props.account,
    limit: 10,
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ ...props.sx }}
    >
      <AccountAvatar
        account={props.account}
        accountLensProfile={accountLensProfiles?.[0]}
        size={164}
        emojiSize={64}
      />
      <AccountTags
        account={props.account}
        accountPartner={props.accountPartner}
        sx={{ mt: 2 }}
      />
      <AccountLink
        account={props.account}
        accountLensProfile={accountLensProfiles?.[0]}
        variant="h4"
        textAlign="center"
        sx={{ mt: 2 }}
      />
      <AccountLensLink
        account={props.account}
        accountLensProfile={accountLensProfiles?.[0]}
        sx={{ mt: 1 }}
      />
      <AccountBio
        account={props.account}
        accountLensProfile={accountLensProfiles?.[0]}
        sx={{ mt: 1 }}
      />
    </Box>
  );
}
