import { APIRequestContext, APIResponse } from "@playwright/test";
import { RequestMethod } from "api/enums/request-methods.enum";
import { RequestOptions } from "api/types/request.types";

export class ApiClient {
  protected baseUrl: string;
  private access_token: string;

  constructor(public request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, options: RequestOptions<T> = {}) {
    return await this.makeHttpRequest(RequestMethod.GET, endpoint, options);
  }

  async post<T>(endpoint: string, options: RequestOptions<T> = {}) {
    return await this.makeHttpRequest(RequestMethod.POST, endpoint, options);
  }

  async put<T>(endpoint: string, options: RequestOptions<T> = {}) {
    return await this.makeHttpRequest(RequestMethod.PUT, endpoint, options);
  }

  async patch<T>(endpoint: string, options: RequestOptions<T> = {}) {
    return await this.makeHttpRequest(RequestMethod.PATCH, endpoint, options);
  }

  async delete<T>(endpoint: string, options: RequestOptions<T> = {}) {
    return await this.makeHttpRequest(RequestMethod.DELETE, endpoint, options);
  }

  async getToken() {
    return this.access_token;
  }

  async setToken(token: string) {
    this.access_token = token;
  }

  private async makeHttpRequest<T>(method: RequestMethod, endPoint: string, options: RequestOptions<T> = {}) {
    let response: APIResponse;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    }

    const authAccessToken = await this.getAccessToken(options, headers);
    headers['Authorization'] = `Bearer ${authAccessToken}`;

    switch (method) {
      case RequestMethod.GET:
        response = await this.request.get(`${this.baseUrl}/${endPoint}`, { params: options.queryParams, headers });
        break;
      case RequestMethod.POST:
        response = await this.request.post(`${this.baseUrl}/${endPoint}`, { data: options.data, headers });
        break;
      case RequestMethod.PUT:
        response = await this.request.put(`${this.baseUrl}/${endPoint}`, { data: options.data, headers });
        break;
      case RequestMethod.PATCH:
        response = await this.request.patch(`${this.baseUrl}/${endPoint}`, { data: options.data, headers });
        break;
      case RequestMethod.DELETE:
        response = await this.request.delete(`${this.baseUrl}/${endPoint}`, { data: options.data, headers });
        break;
    }

    return response;
  }

  private async getAccessToken<T>(
    registerData: RequestOptions<T>,
    headers: Record<string, string>,
  ) {
    if (!this.access_token) {
      await this.request.post(`${this.baseUrl}/register`, { data: registerData.data, headers })
      const loginResponse = await this.request.post(`${this.baseUrl}/login`, { data: registerData.data, headers })
      const { access_token } = await loginResponse.json();
      return access_token;
    }
    return this.access_token;
  }
}
