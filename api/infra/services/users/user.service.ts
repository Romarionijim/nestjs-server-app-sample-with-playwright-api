import { ApiClient } from "api/infra/api-client";
import { BaseUrl } from "api/enums/application-urls.enum";
import { EndPoint } from "api/enums/endpoints.enum";
import { User } from "api/types/user/user.types";

export class UsersService {
  adminRequestContext: ApiClient = new ApiClient(BaseUrl.LOCAL_HOST);
  userRequestContext: ApiClient = new ApiClient(BaseUrl.LOCAL_HOST);

  async ensureAdminAuthenticated(username: string, password: string) {
    const isAuthenticated = await this.adminRequestContext.isAuthenticated();
    if (!isAuthenticated) {
      await this.authenticate(username, password);
    }
  }

  async authenticate(username: string, password: string) {
    try {
      const loginResponse = await this.adminRequestContext.post(EndPoint.LOGIN, {
        data: { username, password }
      });
      
      if (loginResponse.ok()) {
        const { access_token } = await loginResponse.json();
        await this.adminRequestContext.setToken(access_token);
        return;
      }
    } catch (error) {
      console.log('Login failed, attempting registration');
      
      const adminUser = {
        username,
        password,
        name: 'Admin',
        lastName: 'User',
        gender: 'other',
        hobbie: 'Administration',
        roles: ['admin']
      };
      
      await this.adminRequestContext.post(EndPoint.REGISTER, {
        data: adminUser
      });
      
      const loginResponse = await this.adminRequestContext.post(EndPoint.LOGIN, {
        data: { username, password }
      });
      
      const { access_token } = await loginResponse.json();
      await this.adminRequestContext.setToken(access_token);
    }
  }

  async getAllUsers(queryParams?: { [key: string]: string | number | boolean; }) {
    return await this.userRequestContext.get(EndPoint.USERS, { queryParams });
  }

  async getUser(id: number) {
    return await this.userRequestContext.get(`${EndPoint.USERS}/${id}`);
  }

  async createUser(user: User, adminCredentials?: { username: string, password: string }) {
    if (adminCredentials) {
      await this.ensureAdminAuthenticated(adminCredentials.username, adminCredentials.password);
    }
    
    return await this.adminRequestContext.post(EndPoint.USERS, {
      data: user,
      isAuthRequired: true
    });
  }

  async updateUser(id: number, updatedFields: Partial<User>, adminCredentials?: { username: string, password: string }) {
    if (adminCredentials) {
      await this.ensureAdminAuthenticated(adminCredentials.username, adminCredentials.password);
    }
    
    return await this.adminRequestContext.put(`${EndPoint.USERS}/${id}`, {
      data: updatedFields,
      isAuthRequired: true
    });
  }

  async deleteUser(id: number, adminCredentials?: { username: string, password: string }) {
    if (adminCredentials) {
      await this.ensureAdminAuthenticated(adminCredentials.username, adminCredentials.password);
    }
    
    return await this.adminRequestContext.delete(`${EndPoint.USERS}/${id}`, {
      isAuthRequired: true
    });
  }
}