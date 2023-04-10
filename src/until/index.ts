import toast from "react-hot-toast";
import CryptoJS from "crypto-js";

const ENCRYPTION_SECRET = import.meta.env.VITE_SECRET as string;

export function encryptString(plaintext: string): string {
  const ciphertext = CryptoJS.AES.encrypt(
    plaintext,
    ENCRYPTION_SECRET
  ).toString();
  return ciphertext;
}

export function decryptString(ciphertext: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_SECRET);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  } catch (error) {
    console.error("Failed to decrypt string:", error);
    toast.error("Failed to decrypt string");
    return "Failed to decrypt string";
  }
}
