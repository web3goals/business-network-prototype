import {
  EthrDIDMethod,
  JWTService,
  ProviderConfigs,
  createCredential,
  createPresentation,
  getSupportedResolvers,
  verifyCredentialJWT,
  verifyPresentationJWT,
} from "@jpmorganchase/onyx-ssi-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const ethrProvider: ProviderConfigs = {
  name: "maticmum",
  rpcUrl: "https://rpc-mumbai.maticvigil.com/",
  registry: "0x41D788c9c5D335362D713152F407692c5EEAfAae",
};
const ethrDidMethod = new EthrDIDMethod(ethrProvider);
const jwtService = new JWTService();

async function main() {
  console.log("\n----------------------Create DIDs------------------");

  const issuerDid = await ethrDidMethod.generateFromPrivateKey(
    process.env.ISSUER_PRIVATE_KEY as string
  );
  console.log("issuerDid", issuerDid);

  const holderDid = await ethrDidMethod.generateFromPrivateKey(
    process.env.HOLDER_PRIVATE_KEY as string
  );
  console.log("holderDid", holderDid);

  console.log("\n----------------------Create VC------------------");

  const vcDid = await ethrDidMethod.create();
  const vcSubject = {
    feedback: "Great artist!",
  };
  const vcAdditionalParams = {
    id: vcDid.did,
    expirationDate: "2024-01-01T12:00:00Z",
  };
  const vcType = "PrivateFeedback";
  const vc = createCredential(
    issuerDid.did,
    holderDid.did,
    vcSubject,
    [vcType],
    vcAdditionalParams
  );
  console.log("vc", JSON.stringify(vc, null, 2));

  const jwtVc = await jwtService.signVC(issuerDid, vc);
  console.log("jwtVc", jwtVc);

  console.log("\n-----------------Create VP---------------");

  // Create Presentation from VC JWT
  const vp = createPresentation(holderDid.did, [jwtVc]);
  console.log("vp", JSON.stringify(vp, null, 2));

  const jwtVP = await jwtService.signVP(holderDid, vp);
  console.log("jwtVP", jwtVP);

  console.log("\n----------------------Verify VC/VP------------------");

  // Create DID resolvers
  const didResolver = getSupportedResolvers([ethrDidMethod]);

  // Verify VC JWT from Issuer
  const resultVc = await verifyCredentialJWT(jwtVc, didResolver);
  console.log(resultVc);

  // Verify VP JWT from Holder
  const resultVp = await verifyPresentationJWT(jwtVP, didResolver);
  console.log(resultVp);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
