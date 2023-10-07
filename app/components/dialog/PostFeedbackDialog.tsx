import { partnerAbi } from "@/contracts/abi/partner";
import FormikHelper from "@/helper/FormikHelper";
import useError from "@/hooks/useError";
import useToasts from "@/hooks/useToast";
import { theme } from "@/theme";
import { Dialog, Typography } from "@mui/material";
import { ethers } from "ethers";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { Web3Provider, utils } from "zksync-web3";
import {
  DialogCenterContent,
  ExtraLargeLoadingButton,
  WidgetBox,
  WidgetInputTextField,
  WidgetTitle,
} from "../styled";

export default function PostFeedbackDialog(props: {
  accountPartner: any;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { handleError } = useError();
  const { showToastSuccess } = useToasts();

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
   * Form states
   */
  const [formValues, setFormValues] = useState({
    feedback: "",
  });
  const formValidationSchema = yup.object({
    feedback: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  async function submit(values: any) {
    try {
      setIsFormSubmitting(true);
      // Define provider and signer
      const provider = new Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      // Define contract
      const partnerContract = new ethers.Contract(
        props.accountPartner.partner,
        partnerAbi,
        signer
      );
      // Define gas price
      const gasPrice = await provider.getGasPrice();
      // Encode paymaster flow's input
      const paymasterParams = utils.getPaymasterParams(
        partnerContract.address,
        {
          type: "General",
          innerInput: new Uint8Array(),
        }
      );
      // Estimate gas fee for transaction
      const gasLimit = await partnerContract.estimateGas.postFeedback(
        values.feedback,
        {
          customData: {
            gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
            paymasterParams: paymasterParams,
          },
        }
      );
      const fee = gasPrice.mul(gasLimit.toString());
      // Send transaction using paymaster
      await (
        await partnerContract.postFeedback(values.feedback, {
          customData: {
            paymasterParams: paymasterParams,
            gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
          },
        })
      ).wait();
      // Display success toast and close dialog
      showToastSuccess("Feedback posted, data will be updated soon!");
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
          🗣️ Post feedback
        </Typography>
        <Typography textAlign="center" mt={1}>
          that may motivate others to connect with that person
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
              {/* Feedback */}
              <WidgetBox bgcolor={theme.palette.primary.main} mt={2}>
                <WidgetTitle>Feedback</WidgetTitle>
                <WidgetInputTextField
                  id="feedback"
                  name="feedback"
                  placeholder="Great artist!"
                  value={values.feedback}
                  onChange={handleChange}
                  error={touched.feedback && Boolean(errors.feedback)}
                  helperText={touched.feedback && errors.feedback}
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
