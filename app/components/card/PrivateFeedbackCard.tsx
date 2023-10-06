import {
  ONYX_SSI_ETHR_PROVIDER_NAME,
  ONYX_SSI_ETHR_PROVIDER_REGISTRY,
  ONYX_SSI_ETHR_PROVIDER_RPC_URL,
} from "@/constants/onyxSsi";
import useError from "@/hooks/useError";
import { theme } from "@/theme";
import { SxProps, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FullWidthSkeleton } from "../styled";
import MessageCard from "./MessageCard";

export default function PrivateFeedbackCard(props: {
  vc: string;
  footer?: JSX.Element;
  sx?: SxProps;
}) {
  const { handleError } = useError();
  const [feedback, setFeedback] = useState<
    | {
        account: string;
        date: number;
        text: string;
      }
    | undefined
  >();

  async function loadData() {
    try {
      setFeedback(undefined);
      const { JWTService, EthrDIDMethod } = await import(
        "@jpmorganchase/onyx-ssi-sdk"
      );
      const jwtService = new JWTService();
      const decodedVc = jwtService.decodeJWT(props.vc);
      const ethrDidMethod = new EthrDIDMethod({
        name: ONYX_SSI_ETHR_PROVIDER_NAME,
        rpcUrl: ONYX_SSI_ETHR_PROVIDER_RPC_URL,
        registry: ONYX_SSI_ETHR_PROVIDER_REGISTRY,
      });
      setFeedback({
        account: ethrDidMethod.convertDIDToAddress(decodedVc.payload.iss),
        date: decodedVc.payload.nbf,
        text: decodedVc.payload.vc.credentialSubject.feedback,
      });
    } catch (error) {
      handleError(error as Error, true);
    }
  }

  /**
   * Parse VC to get feedback
   */
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.vc]);

  if (!feedback) {
    return <FullWidthSkeleton />;
  }

  return (
    <MessageCard
      account={feedback.account}
      date={feedback.date * 1000}
      text={feedback.text}
      footer={
        <>
          <Typography
            variant="body2"
            fontWeight={700}
            color={theme.palette.success.light}
            mt={2}
          >
            ✅ Verified credential
          </Typography>
          {props.footer}
        </>
      }
      sx={props.sx}
    />
  );
}
