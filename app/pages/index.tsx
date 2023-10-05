import Layout from "@/components/layout";
import { ExtraLargeLoadingButton } from "@/components/styled";
import { Box, Typography } from "@mui/material";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";

/**
 * Landing page.
 */
export default function Landing() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <Layout maxWidth="lg" hideToolbar sx={{ p: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        {/* Left part */}
        <Box sx={{ textAlign: { xs: "center", md: "start" }, mr: { md: 3 } }}>
          <Typography variant="h1" fontWeight={700}>
            Find a reliable partner based on feedback from other people
          </Typography>
          <Typography variant="h4" mt={2}>
            A network for founders, investors, developers, artists, etc.
          </Typography>
          {address ? (
            <Link href="/accounts">
              <ExtraLargeLoadingButton variant="contained" sx={{ mt: 4 }}>
                Let’s go!
              </ExtraLargeLoadingButton>
            </Link>
          ) : (
            <ExtraLargeLoadingButton
              variant="contained"
              sx={{ mt: 4 }}
              onClick={() => openConnectModal?.()}
            >
              Let’s go!
            </ExtraLargeLoadingButton>
          )}
        </Box>
        {/* Right part */}
        <Box width={{ xs: "100%", md: "100%", lg: "100%" }}>
          <Image
            src="/images/network.png"
            alt="Network"
            width="100"
            height="100"
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Box>
      </Box>
    </Layout>
  );
}
