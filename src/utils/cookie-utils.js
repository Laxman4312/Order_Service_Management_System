import Cookies from 'js-cookie';
import { decryptData, encryptData } from './auth-utils';

// Helper function to get and decrypt cookie value
export const getCookieState = (key) => {
  const cookieValue = Cookies.get(key);
  if (!cookieValue) return null;

  try {
    const decryptedValue = decryptData(cookieValue);
    if (!decryptedValue) {
      console.error(`Decryption failed for cookie ${key}`);
      return null;
    }

    // Try to parse as JSON, but return the original string if it's not valid JSON
    try {
      return JSON.parse(decryptedValue);
    } catch (jsonError) {
      return decryptedValue;
    }
  } catch (error) {
    console.error(`Error processing cookie ${key}:`, error);
    return null;
  }
};
// Helper function to set encrypted cookie
export const setEncryptedCookie = (name, value, expirationDays = 7) => {
  try {
    let stringValue;
    if (typeof value === 'string') {
      stringValue = value;
    } else {
      try {
        stringValue = JSON.stringify(value);
      } catch (error) {
        console.error(`Error stringifying value for cookie ${name}:`, error);
        return;
      }
    }

    const encryptedValue = encryptData(stringValue);
    if (encryptedValue === null) {
      console.error(`Failed to encrypt value for cookie ${name}`);
      return;
    }
    Cookies.set(name, encryptedValue, { expires: expirationDays });
  } catch (error) {
    console.error(`Error setting encrypted cookie ${name}:`, error);
  }
};

// Helper function to remove cookie
export const removeCookie = (name) => {
  Cookies.remove(name);
};

// Helper function to get all cookies
export const getAllCookies = () => {
  return Cookies.get();
};

// Helper function to clear all cookies
export const clearAllCookies = () => {
  const cookies = Cookies.get();
  for (const cookie in cookies) {
    Cookies.remove(cookie);
  }
};

// Helper function to check if a cookie exists
export const cookieExists = (name) => {
  return Cookies.get(name) !== undefined;
};

// Helper function to set a regular (non-encrypted) cookie
export const setCookie = (name, value, expirationDays = 7) => {
  Cookies.set(name, value, { expires: expirationDays });
};

// Helper function to get a regular (non-encrypted) cookie
export const getCookie = (name) => {
  return Cookies.get(name);
};
