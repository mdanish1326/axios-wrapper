import axios from "axios"
import { STRATEGY, ERRORS } from "./utils/const.js"

export default class WrapeAxios { 
  constructor({ baseURL, version, refreshEndpoint, strategy, accessTokenKey, refreshTokenKey }) {
    try {
      this.baseURL = baseURL;
      this.version = version;
      this.refreshEndpoint = refreshEndpoint;
      this.strategy = strategy;
      this.axiosInstance = null;

      switch(this.strategy) {
        case STRATEGY.LOCAL_STORAGE:
          if (!accessTokenKey || !refreshTokenKey) {
            throw new Error(ERRORS.KEY_ERROR);
          }
          this.accessTokenKey = accessTokenKey;
          this.refreshTokenKey = refreshTokenKey;

        default:
          this.refresh = this.refresh;
          break;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  #setTokensInLocalStorage(accessToken, refreshToken) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }
  
  #getTokenFromLocalStorage(tokenKey) {
    return localStorage.getItem(tokenKey);
  }

  #createAxiosInstance(version, endpoint) {
    const baseURL = version ? `${this.baseURL}/${version}${endpoint}` : `${this.baseURL}${endpoint}`;
    return axios.create({
      baseURL,
    });
  }

  #getStoredToken(strategy, tokenType) {
    switch(strategy) {
      case STRATEGY.LOCAL_STORAGE:
        return this.#getTokenFromLocalStorage(tokenType);
      default:
        return null;
    }
  }

  async #refreshTokens(refreshToken) {
    const refreshTokenUrl = this.version 
      ? `${this.baseURL}/${this.version}${this.refreshEndpoint}` 
      : `${this.baseURL}/${this.refreshEndpoint}`;
    return axios.post(refreshTokenUrl, { refresh_token: refreshToken });
  }

  #setRenewedToken(strategy, response) {
    const accessToken = response[this.accessTokenKey]
    const refreshToken = response[this.refreshTokenKey]
    switch(strategy) {
      case STRATEGY.LOCAL_STORAGE:
        this.#setTokensInLocalStorage(accessToken, refreshToken);
        break;
      default:
        break;
    }
  }

  #setupInterceptors(endpoint, isPrivate, headers) {
    this.axiosInstance = this.#createAxiosInstance(this.version, endpoint);

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        if (isPrivate) {
          const token = this.#getStoredToken(this.strategy, this.accessTokenKey);
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
        
        config.headers = { ...config.headers, ...headers };
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error?.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = this.#getStoredToken(this.strategy, this.refreshTokenKey);
            const response = await this.#refreshTokens(refreshToken);
            this.#setRenewedToken(strategy, response);
            originalRequest.headers['Authorization'] = `Bearer ${response.access_token}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  useWrapeAxios({ endpoint, isPrivate = true, headers = {} }) {
    this.#setupInterceptors(endpoint, isPrivate, headers);
    return this.axiosInstance;
  }

}