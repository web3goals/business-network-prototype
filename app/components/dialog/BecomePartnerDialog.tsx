import { partnerFactoryAbi } from "@/contracts/abi/partnerFactory";
import FormikHelper from "@/helper/FormikHelper";
import useError from "@/hooks/useError";
import useToasts from "@/hooks/useToast";
import { theme } from "@/theme";
import { PartnerDetails } from "@/types";
import { chainToSupportedChainConfig } from "@/utils/chains";
import { Dialog, MenuItem, Typography } from "@mui/material";
import { ethers } from "ethers";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useNetwork } from "wagmi";
import * as yup from "yup";
import { Web3Provider } from "zksync-web3";
import {
  DialogCenterContent,
  ExtraLargeLoadingButton,
  WidgetBox,
  WidgetInputSelect,
  WidgetInputTextField,
  WidgetTitle,
} from "../styled";
import useIpfs from "@/hooks/useIpfs";

export default function BecomePartnerDialog(props: {
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();
  const { uploadJsonToIpfs } = useIpfs();
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
  const formTags = [
    "Developer",
    "Designer",
    "Artist",
    "Game Developer",
    "Investor",
  ];
  const [formValues, setFormValues] = useState({
    tag: formTags[0],
    sponsorship: 0.001,
  });
  const formValidationSchema = yup.object({
    tag: yup.string().required(),
    sponsorship: yup.number().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  async function submit(values: any) {
    try {
      setIsFormSubmitting(true);
      // Upload data to IPFS
      const partnerDetails: PartnerDetails = {
        tags: [values.tag],
      };
      const { uri: partnerDetailsUri } = await uploadJsonToIpfs(partnerDetails);
      // Define provider and signer
      const provider = new Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      // Define contract
      const partnerFactoryContract = new ethers.Contract(
        chainToSupportedChainConfig(chain).contracts.partnerFactory,
        partnerFactoryAbi,
        signer
      );
      // Use contract to become partner
      await (
        await partnerFactoryContract.becomePartner(partnerDetailsUri, {
          value: ethers.utils.parseEther(String(values.sponsorship)),
        })
      ).wait();
      // Display success toast and close dialog
      showToastSuccess("You joined the network, data will be updated soon!");
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
          🌍️ Join the network
        </Typography>
        <Typography textAlign="center" mt={1}>
          Define tag that will be associated with your account and the amount of
          ethers that will be used to sponsor the transactions of other people
          who want to post a feedback on your page
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
              {/* Tag */}
              <WidgetBox bgcolor={theme.palette.primary.main} mt={2}>
                <WidgetTitle>Tag</WidgetTitle>
                <WidgetInputSelect
                  id="tag"
                  name="tag"
                  value={values.tag}
                  onChange={handleChange}
                  //   error={touched.tags && Boolean(errors.tags)}
                  //   helperText={touched.tags && errors.tags}
                  disabled={isFormSubmitting}
                  sx={{ width: 1 }}
                >
                  {formTags.map((tag, index) => (
                    <MenuItem value={tag} key={index}>
                      {tag}
                    </MenuItem>
                  ))}
                </WidgetInputSelect>
              </WidgetBox>
              {/* Sponsorhip */}
              <WidgetBox bgcolor={theme.palette.primary.main} mt={2}>
                <WidgetTitle>Sponsorship</WidgetTitle>
                <WidgetInputTextField
                  id="sponsorship"
                  name="sponsorship"
                  type="number"
                  value={values.sponsorship}
                  onChange={handleChange}
                  error={touched.sponsorship && Boolean(errors.sponsorship)}
                  helperText={touched.sponsorship && errors.sponsorship}
                  disabled={isFormSubmitting}
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
