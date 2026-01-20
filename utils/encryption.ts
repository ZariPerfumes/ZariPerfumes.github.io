
/**
 * Simple "encryption" using base64 and character shifting for the receipt.
 * NOT for real security, just for the user's requirement.
 */
export const encryptReceipt = (text: string): string => {
  const base64 = btoa(unescape(encodeURIComponent(text)));
  // Character shift simulation
  return base64.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('');
};

export const decryptReceipt = (encrypted: string): string => {
  try {
    const shifted = encrypted.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('');
    return decodeURIComponent(escape(atob(shifted)));
  } catch (e) {
    return "Invalid Receipt Format";
  }
};
