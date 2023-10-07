import { FAKES } from "@/constants/fakes";
import { Profile } from "@lens-protocol/react-web";
import { SxProps, Typography, TypographyProps } from "@mui/material";

/**
 * Component with account bio.
 */
export default function AccountBio(props: {
  account: string;
  accountLensProfile?: Profile;
  textAlign?: TypographyProps["textAlign"];
  sx?: SxProps;
}) {
  let bio = undefined;
  if (props.accountLensProfile?.bio) {
    bio = props.accountLensProfile?.bio;
  }
  if (FAKES[props.account.toUpperCase()]?.bio) {
    bio = FAKES[props.account.toUpperCase()]?.bio;
  }

  if (bio) {
    return (
      <Typography
        textAlign={props.textAlign || "center"}
        sx={{ maxWidth: 480, ...props.sx }}
      >
        {bio}
      </Typography>
    );
  }

  return <></>;
}
