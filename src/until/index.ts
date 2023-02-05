export async function generateKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: "SHA-256" },
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

  return { publicKey, privateKey };
}

export async function encryptMessage(publicKey: object, message: string) {
  const publicKeyArray = new Uint8Array(Object.values(publicKey));
  const importedKey = await crypto.subtle.importKey(
    "spki",
    publicKeyArray,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    false,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    importedKey,
    new TextEncoder().encode(message)
  );

  return new Uint8Array(encrypted);
}

export async function decryptMessage(
  privateKey: object,
  encryptedMessage: BufferSource
) {
  const privateKeyArray = new Uint8Array(Object.values(privateKey));
  const importedKey = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyArray,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    importedKey,
    encryptedMessage
  );

  return new TextDecoder().decode(new Uint8Array(decrypted));
}
