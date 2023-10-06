import { DialogContext } from "@/context/dialog";
import { useProfilesOwnedBy } from "@lens-protocol/react-web";
import { Box, SxProps, Typography } from "@mui/material";
import { useContext } from "react";
import AccountAvatar from "../account/AccountAvatar";
import AccountLink from "../account/AccountLink";
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
  const { data: accountLensProfiles } = useProfilesOwnedBy({
    address: props.account,
    limit: 10,
  });

  return (
    <CardBox sx={{ display: "flex", flexDirection: "row", ...props.sx }}>
      {/* Left part */}
      <Box>
        <AccountAvatar
          account={props.account}
          accountLensProfile={accountLensProfiles?.[0]}
          size={54}
          emojiSize={18}
        />
      </Box>
      {/* Right part */}
      <Box
        width={1}
        ml={3}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
        <AccountLink
          account={props.account}
          accountLensProfile={accountLensProfiles?.[0]}
        />
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
