import { addressToShortAddress } from "./converters";

/**
 * Convert "eip155:0xC6F4..." to "0xC6F4...".
 */
export function didToAddress(did?: string): string {
  if (!did || !did.startsWith("eip155:")) {
    throw new Error(`Fail to converting DID to address: ${did}`);
  }
  return did.replace("eip155:", "");
}

/**
 * Convert "eip155:0xC6F4..." to "0xC6F4...".
 */
export function didToShortAddress(did?: string): string {
  return addressToShortAddress(didToAddress(did));
}
