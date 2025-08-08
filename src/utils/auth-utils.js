import CryptoJS from 'crypto-js';

const secretKey = import.meta.env.VITE_APP_SECRET_KEY;

// Encrypt data
export const encryptData = (data) => {
  const userData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(userData, secretKey).toString();
};

// Decrypt data
export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
