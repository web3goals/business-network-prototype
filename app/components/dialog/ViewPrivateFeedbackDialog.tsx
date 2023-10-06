import { Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import { DialogCenterContent } from "../styled";
import PrivateFeedbackCard from "../card/PrivateFeedbackCard";

export default function ViewPrivateFeedbackDialog(props: {
  vc: string;
  isClose?: boolean;
  onClose?: Function;
  onSend?: Function;
}) {
  /**
   * Dialog states
   */
  const [isOpen, setIsOpen] = useState(!props.isClose);

  /**
   * Function to close dialog
   */
  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogCenterContent>
        <Typography variant="h4" textAlign="center" fontWeight={700}>
          🔒️ Private feedback
        </Typography>
        <PrivateFeedbackCard vc={props.vc} sx={{ mt: 2 }} />
      </DialogCenterContent>
    </Dialog>
  );
}
