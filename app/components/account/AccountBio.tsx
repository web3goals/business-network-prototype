import { Profile } from "@lens-protocol/react-web";
import { SxProps, Typography } from "@mui/material";

/**
 * Component with account bio.
 */
export default function AccountBio(props: {
  accountLensProfile?: Profile;
  sx?: SxProps;
}) {
  if (props.accountLensProfile?.bio) {
    return (
      <Typography textAlign="center" sx={{ maxWidth: 480, ...props.sx }}>
        {props.accountLensProfile?.bio}
      </Typography>
    );
  }

  return <></>;
}
