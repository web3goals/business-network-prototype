import AccountAvatar from "@/components/account/AccountAvatar";
import AccountBio from "@/components/account/AccountBio";
import AccountLink from "@/components/account/AccountLink";
import AccountTags from "@/components/account/AccountTags";
import EntityList from "@/components/entity/EntityList";
import Layout from "@/components/layout";
import { CardBox, FullWidthSkeleton } from "@/components/styled";
import { partnerFactoryAbi } from "@/contracts/abi/partnerFactory";
import { chainToSupportedChainConfig } from "@/utils/chains";
import { useProfilesOwnedBy } from "@lens-protocol/react-web";
import { Box, Typography } from "@mui/material";
import { useContractRead, useNetwork } from "wagmi";

/**
 * Page with accounts.
 */
export default function Accounts() {
  const { chain } = useNetwork();

  /**
   * Define partners
   */
  const { data: partners } = useContractRead({
    address: chainToSupportedChainConfig(chain).contracts.partnerFactory,
    abi: partnerFactoryAbi,
    functionName: "getPartners",
  });

  return (
    <Layout maxWidth="sm">
      {partners ? (
        <>
          <Typography variant="h4" fontWeight={700} textAlign="center">
            👥 People
          </Typography>
          <Typography textAlign="center" mt={1}>
            Who could potentially become your partners
          </Typography>
          <EntityList
            entities={partners as any[]}
            renderEntityCard={(partner, index) => (
              <AccountCard
                account={partner.account}
                accountPartner={partner}
                key={index}
              />
            )}
            noEntitiesText="😐 no stored feedback"
            sx={{ mt: 2 }}
          />
        </>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}

function AccountCard(props: { account: string; accountPartner: any }) {
  const { data: accountLensProfiles } = useProfilesOwnedBy({
    address: props.account,
    limit: 10,
  });

  return (
    <CardBox sx={{ display: "flex", flexDirection: "row" }}>
      {/* Left part */}
      <Box>
        <AccountAvatar
          account={props.account}
          accountLensProfile={accountLensProfiles?.[0]}
          size={58}
          emojiSize={26}
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
          variant="h6"
        />
        <AccountBio
          account={props.account}
          accountLensProfile={accountLensProfiles?.[0]}
          textAlign="start"
        />
        <AccountTags
          account={props.account}
          accountPartner={props.accountPartner}
          sx={{ mt: 1 }}
        />
      </Box>
    </CardBox>
  );
}
