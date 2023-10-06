import { FAKES } from "@/constants/fakes";
import { NftImage, Profile, ProfilePictureSet } from "@lens-protocol/react-web";
import { Avatar, SxProps, Typography } from "@mui/material";
import { emojiAvatarForAddress } from "utils/avatars";

/**
 * Component with account avatar.
 */
export default function AccountAvatar(props: {
  account: string;
  accountLensProfile?: Profile;
  size?: number;
  emojiSize?: number;
  sx?: SxProps;
}) {
  let avatar = undefined;
  if ((props.accountLensProfile?.picture as ProfilePictureSet)?.original?.url) {
    avatar = (props.accountLensProfile?.picture as ProfilePictureSet)?.original
      ?.url;
  }
  if ((props.accountLensProfile?.picture as NftImage)?.uri) {
    avatar = (props.accountLensProfile?.picture as NftImage)?.uri;
  }
  if (FAKES[props.account.toUpperCase()]?.avatar) {
    avatar = FAKES[props.account.toUpperCase()]?.avatar;
  }

  return (
    <Avatar
      sx={{
        width: props.size || 48,
        height: props.size || 48,
        borderRadius: props.size || 48,
        background: emojiAvatarForAddress(props.account).color,
        ...props.sx,
      }}
      src={avatar}
    >
      <Typography fontSize={props.emojiSize || 22}>
        {emojiAvatarForAddress(props.account).emoji}
      </Typography>
    </Avatar>
  );
}
