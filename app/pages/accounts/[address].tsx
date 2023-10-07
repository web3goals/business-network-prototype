import AccountActions from "@/components/account/AccountActions";
import AccountDetails from "@/components/account/AccountDetails";
import AccountFeedback from "@/components/account/AccountFeedback";
import Layout from "@/components/layout";
import { FullWidthSkeleton } from "@/components/styled";
import { partnerFactoryAbi } from "@/contracts/abi/partnerFactory";
import { chainToSupportedChainConfig } from "@/utils/chains";
import { useRouter } from "next/router";
import { useContractRead, useNetwork } from "wagmi";

/**
 * Page with an account.
 */
export default function Account() {
  const router = useRouter();
  const { address } = router.query;
  const { chain } = useNetwork();

  /**
   * Define an account partner
   */
  const { data: accountPartner } = useContractRead({
    address: chainToSupportedChainConfig(chain).contracts.partnerFactory,
    abi: partnerFactoryAbi,
    functionName: "getPartner",
    args: [address],
    enabled: Boolean(address),
  });

  return (
    <Layout maxWidth="sm">
      {address && accountPartner ? (
        <>
          <AccountDetails
            account={address as string}
            accountPartner={accountPartner}
          />
          <AccountActions
            account={address as string}
            accountPartner={accountPartner}
            sx={{ mt: 2 }}
          />
          <AccountFeedback
            account={address as string}
            accountPartner={accountPartner}
            sx={{ mt: 6 }}
          />
        </>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}
