// src/api/services/tokenService.js
import { getCookieState, removeCookie, setEncryptedCookie } from 'utils/cookie-utils';

class TokenService {
  static TOKEN_KEY = 'authToken';
  static expires = new Date(Date.now() + 3 * 60 * 60 * 1000);

  static getToken() {
    return getCookieState(this.TOKEN_KEY);
  }

  static setToken(token) {
    setEncryptedCookie(this.TOKEN_KEY, token);
  }

  static removeToken() {
    removeCookie(this.TOKEN);
  }

  static hasToken() {
    return !!this.getToken();
  }
}

export default TokenService;
