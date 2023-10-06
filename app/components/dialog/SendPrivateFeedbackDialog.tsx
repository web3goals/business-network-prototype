import { DialogContext } from "@/context/dialog";
import useError from "@/hooks/useError";
import useSigner from "@/hooks/useSigner";
import useToasts from "@/hooks/useToast";
import { Dialog, Typography } from "@mui/material";
import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { useContext, useEffect, useState } from "react";
import PrivateFeedbackCard from "../card/PrivateFeedbackCard";
import EntityList from "../entity/EntityList";
import {
  DialogCenterContent,
  FullWidthSkeleton,
  LargeLoadingButton,
  MediumLoadingButton,
} from "../styled";
import AddVcDialog from "./AddVcDialog";

// TODO: Display list of VCs stored in memory
export default function SendPrivateFeedbackDialog(props: {
  recipientDid: string;
  isClose?: boolean;
  onClose?: Function;
  onSend?: Function;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const [vcs, setVcs] = useState<string[] | undefined>();

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

  /**
   * Load VCs
   */
  useEffect(() => {
    setVcs(JSON.parse(localStorage.getItem("vcs") || "[]") as string[]);
  }, []);

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogCenterContent>
        <Typography variant="h4" textAlign="center" fontWeight={700}>
          🔒️ Send private feedback
        </Typography>
        <Typography textAlign="center" mt={1}>
          Use verified credentials stored on your device or add new ones
        </Typography>
        {vcs ? (
          <>
            <EntityList
              entities={vcs}
              renderEntityCard={(vc, index) => (
                <InteractivePrivateFeedbackCard
                  vc={vc}
                  recipientDid={props.recipientDid}
                  onSend={() => close()}
                  key={index}
                />
              )}
              noEntitiesText="😐 no stored feedback"
              sx={{ mt: 2 }}
            />
            <LargeLoadingButton
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => {
                showDialog?.(<AddVcDialog onClose={closeDialog} />);
              }}
            >
              Send Custom VC
            </LargeLoadingButton>
          </>
        ) : (
          <FullWidthSkeleton />
        )}
      </DialogCenterContent>
    </Dialog>
  );
}

function InteractivePrivateFeedbackCard(props: {
  vc: string;
  recipientDid: string;
  onSend?: Function;
}) {
  const { handleError } = useError();
  const { showToastSuccess } = useToasts();
  const { signer } = useSigner();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  async function submit() {
    try {
      setIsFormSubmitting(true);
      if (!signer) {
        throw new Error(`Signer is not defined`);
      }
      const user = await PushAPI.initialize(signer, { env: ENV.STAGING });
      await user.chat.send(props.recipientDid, {
        type: "Text",
        content: `vc:${props.vc}`,
      });
      showToastSuccess("Feedback sent");
      props.onSend?.();
    } catch (error) {
      handleError(error as Error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <PrivateFeedbackCard
      vc={props.vc}
      footer={
        <MediumLoadingButton
          variant="outlined"
          sx={{ mt: 2 }}
          type="submit"
          loading={isFormSubmitting}
          disabled={isFormSubmitting}
          onClick={() => submit()}
        >
          Send
        </MediumLoadingButton>
      }
    />
  );
}
