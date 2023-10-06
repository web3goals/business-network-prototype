import {
  ONYX_SSI_ETHR_PROVIDER_NAME,
  ONYX_SSI_ETHR_PROVIDER_REGISTRY,
  ONYX_SSI_ETHR_PROVIDER_RPC_URL,
} from "@/constants/onyxSsi";
import FormikHelper from "@/helper/FormikHelper";
import useError from "@/hooks/useError";
import useToasts from "@/hooks/useToast";
import { theme } from "@/theme";
import { Dialog, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import {
  DialogCenterContent,
  ExtraLargeLoadingButton,
  WidgetBox,
  WidgetInputTextField,
  WidgetTitle,
} from "../styled";

export default function AddVcDialog(props: {
  isClose?: boolean;
  onClose?: Function;
  onAdd?: Function;
}) {
  const { handleError } = useError();
  const { showToastSuccess } = useToasts();

  /**
   * Dialog states
   */
  const [isOpen, setIsOpen] = useState(!props.isClose);

  /**
   * Form states
   */
  const [formValues, setFormValues] = useState({
    vc: "",
  });
  const formValidationSchema = yup.object({
    vc: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  /**
   * Function to close dialog
   */
  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  async function submit(values: any) {
    try {
      setIsFormSubmitting(true);
      const {
        EthrDIDMethod,
        getSupportedResolvers,
        verifyCredentialJWT,
      } = await import("@jpmorganchase/onyx-ssi-sdk");
      // Verify VC
      const ethrDidMethod = new EthrDIDMethod({
        name: ONYX_SSI_ETHR_PROVIDER_NAME,
        rpcUrl: ONYX_SSI_ETHR_PROVIDER_RPC_URL,
        registry: ONYX_SSI_ETHR_PROVIDER_REGISTRY,
      });
      const didResolver = getSupportedResolvers([ethrDidMethod]);
      const verified = await verifyCredentialJWT(values.vc, didResolver);
      if (!verified) {
        throw new Error("VC is not verified");
      }
      // Add VC to local storage
      const vcs = JSON.parse(localStorage.getItem("vcs") || "[]") as string[];
      if (vcs.includes(values.vc)) {
        throw new Error("VC is already added");
      }
      vcs.push(values.vc);
      localStorage.setItem("vcs", JSON.stringify(vcs));
      // Show success message
      showToastSuccess("VC added");
      props.onAdd?.();
      close();
    } catch (error) {
      handleError(error as Error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={!isFormSubmitting ? close : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogCenterContent>
        <Typography variant="h4" textAlign="center" fontWeight={700}>
          📩 Add verified credential
        </Typography>
        <Typography textAlign="center" mt={1}>
          to use it for sending private feedback
        </Typography>
        <Formik
          initialValues={formValues}
          validationSchema={formValidationSchema}
          onSubmit={submit}
        >
          {({ values, errors, touched, handleChange, setValues }) => (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FormikHelper onChange={(values: any) => setFormValues(values)} />
              {/* VC */}
              <WidgetBox bgcolor={theme.palette.primary.main} mt={2}>
                <WidgetTitle>VC</WidgetTitle>
                <WidgetInputTextField
                  id="vc"
                  name="vc"
                  placeholder="eyJhb..."
                  value={values.vc}
                  onChange={handleChange}
                  error={touched.vc && Boolean(errors.vc)}
                  helperText={touched.vc && errors.vc}
                  disabled={isFormSubmitting}
                  multiline
                  minRows={2}
                  maxRows={8}
                  sx={{ width: 1 }}
                />
              </WidgetBox>
              {/* Submit button */}
              <ExtraLargeLoadingButton
                loading={isFormSubmitting}
                variant="outlined"
                type="submit"
                disabled={isFormSubmitting}
                sx={{ mt: 2 }}
              >
                Submit
              </ExtraLargeLoadingButton>
            </Form>
          )}
        </Formik>
      </DialogCenterContent>
    </Dialog>
  );
}
