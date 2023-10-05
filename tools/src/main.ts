import {
  EthrDIDMethod,
  JWTService,
  KeyDIDMethod,
  PROOF_OF_NAME,
  ProviderConfigs,
  createCredential,
  createPresentation,
  getSupportedResolvers,
  verifyCredentialJWT,
  verifyPresentationJWT,
} from "@jpmorganchase/onyx-ssi-sdk";

async function main() {
  const ethrProvider: ProviderConfigs = {
    name: "maticmum",
    rpcUrl: "https://rpc-mumbai.maticvigil.com/",
    registry: "0x41D788c9c5D335362D713152F407692c5EEAfAae",
  };
  const didEthr = new EthrDIDMethod(ethrProvider);
  const didKey = new KeyDIDMethod();

  console.log("\n----------------------Create DIDs------------------");

  // Create DID for Issuer (did:ethr)
  const issuerDid = await didEthr.create();
  console.log("issuerDid", issuerDid);

  // Create DID for Holder of Credential (did:key)
  const holderDid = await didKey.create();
  console.log("holderDid", holderDid);

  console.log("\n----------------------Create VC------------------");

  // Create DID for VC to support Revocation of Credential
  const vcDID = await didEthr.create();

  // Create a 'Proof of Name' VC
  const subjectData = {
    name: "Ollie",
  };

  // Additonal parameters can be added to VC including:
  // vc id, expirationDate, credentialStatus, credentialSchema, etc
  const additionalParams = {
    id: vcDID.did,
    expirationDate: "2024-01-01T19:23:24Z",
  };

  const vc = await createCredential(
    issuerDid.did,
    holderDid.did,
    subjectData,
    [PROOF_OF_NAME],
    additionalParams
  );
  console.log("vc", JSON.stringify(vc, null, 2));

  const jwtService = new JWTService();
  const jwtVC = await jwtService.signVC(issuerDid, vc);
  console.log("jwtVC", jwtVC);

  console.log("\n-----------------Create VP---------------");

  // Create Presentation from VC JWT
  const vp = createPresentation(holderDid.did, [jwtVC]);
  console.log("vp", JSON.stringify(vp, null, 2));

  const jwtVP = await jwtService.signVP(holderDid, vp);
  console.log("jwtVP", jwtVP);

  console.log("\n----------------------Verify VC/VP------------------");

  // Create DID resolvers
  const didResolver = getSupportedResolvers([didKey, didEthr]);

  // Verify VC JWT from Issuer
  const resultVc = await verifyCredentialJWT(jwtVC, didResolver);
  console.log(resultVc);

  // Verify VP JWT from Holder
  const resultVp = await verifyPresentationJWT(jwtVP, didResolver);
  console.log(resultVp);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
