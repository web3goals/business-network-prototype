import { Profile } from "@lens-protocol/react-web";
import { Link as MuiLink, SxProps, TypographyProps } from "@mui/material";
import Link from "next/link";
import { theme } from "theme";
import { addressToShortAddress } from "utils/converters";

/**
 * Component with account link.
 */
export default function AccountLink(props: {
  account: string;
  accountLensProfile?: Profile;
  color?: string;
  variant?: TypographyProps["variant"];
  textAlign?: TypographyProps["textAlign"];
  sx?: SxProps;
}) {
  let name = addressToShortAddress(props.account);
  if (props.accountLensProfile?.name) {
    name = props.accountLensProfile.name + ` (${name})`;
  }

  return (
    <Link href={`/accounts/${props.account}`} passHref legacyBehavior>
      <MuiLink
        fontWeight={700}
        variant={props.variant || "body2"}
        color={props.color || theme.palette.primary.main}
        textAlign={props.textAlign || "start"}
        sx={{ ...props.sx }}
      >
        {name}
      </MuiLink>
    </Link>
  );
}
