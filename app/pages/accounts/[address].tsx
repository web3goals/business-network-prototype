import AccountAvatar from "@/components/account/AccountAvatar";
import AccountBio from "@/components/account/AccountBio";
import AccountLink from "@/components/account/AccountLink";
import Layout from "@/components/layout";
import { FullWidthSkeleton, LargeLoadingButton } from "@/components/styled";
import { isAddressesEqual } from "@/utils/addresses";
import { addressToDid } from "@/utils/pushprotocol";
import { useProfilesOwnedBy } from "@lens-protocol/react-web";
import { Box } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

/**
 * Page with an account.
 */
export default function Account() {
  const router = useRouter();
  const { address } = router.query;
  const { address: connectedAddress } = useAccount();
  const { data: accountLensProfiles } = useProfilesOwnedBy({
    address: address as string,
    limit: 10,
  });

  return (
    <Layout maxWidth="sm">
      {address ? (
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* Image */}
          <AccountAvatar
            account={address as string}
            accountLensProfile={accountLensProfiles?.[0]}
            size={164}
            emojiSize={64}
          />
          {/* Name */}
          <AccountLink
            account={address as string}
            accountLensProfile={accountLensProfiles?.[0]}
            variant="h4"
            textAlign="center"
            sx={{ mt: 2 }}
          />
          {/* Bio */}
          <AccountBio
            account={address as string}
            accountLensProfile={accountLensProfiles?.[0]}
            sx={{ mt: 1 }}
          />
          {/* Buttons */}
          {isAddressesEqual(address as string, connectedAddress) ? (
            <Link href="/chats" legacyBehavior>
              <LargeLoadingButton variant="outlined" sx={{ mt: 2 }}>
                Open Chats
              </LargeLoadingButton>
            </Link>
          ) : (
            <Link
              href={`/chats/${addressToDid(address as string)}`}
              legacyBehavior
            >
              <LargeLoadingButton variant="outlined" sx={{ mt: 2 }}>
                Send Message
              </LargeLoadingButton>
            </Link>
          )}
        </Box>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}
