import { FAKES } from "@/constants/fakes";
import { Profile } from "@lens-protocol/react-web";
import { Link as MuiLink, SxProps } from "@mui/material";

/**
 * Component with account lens link.
 */
export default function AccountLensLink(props: {
  account: string;
  accountLensProfile?: Profile;
  sx?: SxProps;
}) {
  let handle = undefined;
  if (props.accountLensProfile?.bio) {
    handle = props.accountLensProfile?.handle;
  }
  if (FAKES[props.account.toUpperCase()]?.handle) {
    handle = FAKES[props.account.toUpperCase()]?.handle;
  }

  if (handle) {
    return (
      <MuiLink
        href={`https://share.lens.xyz/u/${handle}`}
        target="_blank"
        sx={{ mt: 1 }}
      >
        🌿 {handle}
      </MuiLink>
    );
  }

  return <></>;
}
