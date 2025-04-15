import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { RequestMethod } from "api/enums/request-methods.enum";
import { RequestOptions } from "api/types/request.types";

export class ApiClient {
  protected baseUrl: string;
  protected requestContext: APIRequestContext;
  private access_token: string;
  private requestInitialized: Promise<void>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.requestInitialized = this.initializeRequest();
  }

  async get<T>(endpoint: string, options: RequestOptions<T> = {}) {
    await this.ensureRequestInitialized();
    return await this.makeHttpRequest(RequestMethod.GET, endpoint, options);
  }

  async post<T>(endpoint: string, options: RequestOptions<T> = {}) {
    await this.ensureRequestInitialized();
    return await this.makeHttpRequest(RequestMethod.POST, endpoint, options);
  }

  async put<T>(endpoint: string, options: RequestOptions<T> = {}) {
    await this.ensureRequestInitialized();
    return await this.makeHttpRequest(RequestMethod.PUT, endpoint, options);
  }

  async patch<T>(endpoint: string, options: RequestOptions<T> = {}) {
    await this.ensureRequestInitialized();
    return await this.makeHttpRequest(RequestMethod.PATCH, endpoint, options);
  }

  async delete<T>(endpoint: string, options: RequestOptions<T> = {}) {
    await this.ensureRequestInitialized();
    return await this.makeHttpRequest(RequestMethod.DELETE, endpoint, options);
  }

  async getToken() {
    return this.access_token;
  }

  async setToken(token: string) {
    this.access_token = token;
  }

  async isAuthenticated() {
    return !!this.access_token;
  }

  private async makeHttpRequest<T>(method: RequestMethod, endPoint: string, options: RequestOptions<T> = {}) {
    let response: APIResponse;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    }

    if (options.isAuthRequired) {
      const authAccessToken = await this.getAccessToken(options, headers);
      headers['Authorization'] = `Bearer ${authAccessToken}`;
    }

    switch (method) {
      case RequestMethod.GET:
        response = await this.requestContext.get(`${this.baseUrl}/${endPoint}`, { params: options.queryParams, headers });
        break;
      case RequestMethod.POST:
        response = await this.requestContext.post(`${this.baseUrl}/${endPoint}`, { data: options.data, headers });
        break;
      case RequestMethod.PUT:
        response = await this.requestContext.put(`${this.baseUrl}/${endPoint}`, { data: options.data, headers });
        break;
      case RequestMethod.PATCH:
        response = await this.requestContext.patch(`${this.baseUrl}/${endPoint}`, { data: options.data, headers });
        break;
      case RequestMethod.DELETE:
        response = await this.requestContext.delete(`${this.baseUrl}/${endPoint}`, { data: options.data, headers });
        break;
    }

    return response;
  }

  private async initializeRequest(): Promise<void> {
    this.requestContext = await request.newContext();
  }

  private async ensureRequestInitialized(): Promise<void> {
    await this.requestInitialized;
  }

  private async getAccessToken<T>(
    options: RequestOptions<T>,
    headers: Record<string, string>,
  ) {
    if (!this.access_token) {

      if (!options.data || !options.data['username'] || !options.data['password']) {
        throw new Error('Username and password are required for authentication');
      }

      const credentials = {
        username: options.data['username'],
        password: options.data['password']
      };

      await this.requestContext.post(`${this.baseUrl}/register`, { data: options.data, headers })
      const responseBody = await this.requestContext.post(`${this.baseUrl}/login`, { data: credentials, headers })
      const { access_token } = await responseBody.json();

      if (!access_token) {
        throw new Error('Failed to get access token after login');
      }
      await this.setToken(access_token);
      return access_token;
    }
    return this.access_token;
  }
}
