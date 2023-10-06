import { DialogContext } from "@/context/dialog";
import { theme } from "@/theme";
import { addressToShortAddress } from "@/utils/converters";
import {
  Avatar,
  Box,
  Link as MuiLink,
  SxProps,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useContext } from "react";
import ViewPrivateFeedbackDialog from "../dialog/ViewPrivateFeedbackDialog";
import { CardBox, MediumLoadingButton } from "../styled";

export default function MessageCard(props: {
  account: string;
  date?: number;
  text: string;
  privateFeedbackDialogEnabled?: boolean;
  footer?: JSX.Element;
  sx?: SxProps;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <CardBox sx={{ display: "flex", flexDirection: "row", ...props.sx }}>
      {/* Left part */}
      <Box>
        <Avatar
          sx={{
            width: 54,
            height: 54,
            borderRadius: 48,
            background: theme.palette.divider,
          }}
        >
          <Typography fontSize={18}>💬</Typography>
        </Avatar>
      </Box>
      {/* Right part */}
      <Box
        width={1}
        ml={3}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
        <Link href={`/accounts/${props.account}`} passHref legacyBehavior>
          <MuiLink variant="body2" fontWeight={700}>
            {addressToShortAddress(props.account)}
          </MuiLink>
        </Link>
        {props.date && (
          <Typography variant="body2" color="text.secondary">
            {new Date(props.date).toLocaleString()}
          </Typography>
        )}
        {props.text.startsWith("vc:") && props.privateFeedbackDialogEnabled && (
          <MediumLoadingButton
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={() =>
              showDialog?.(
                <ViewPrivateFeedbackDialog
                  vc={props.text.replace("vc:", "")}
                  onClose={closeDialog}
                />
              )
            }
          >
            🔒 Private feedback
          </MediumLoadingButton>
        )}
        {props.text.startsWith("vc:") &&
          !props.privateFeedbackDialogEnabled && (
            <Typography mt={1}>🔒 Private feedback</Typography>
          )}
        {!props.text.startsWith("vc:") && (
          <Typography mt={1}>{props.text}</Typography>
        )}
        {props.footer}
      </Box>
    </CardBox>
  );
}
