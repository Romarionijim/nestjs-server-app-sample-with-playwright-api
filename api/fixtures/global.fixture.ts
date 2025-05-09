import { test as base } from '@playwright/test';
import { ServiceFactory } from 'api/helpers/factory/service.factory';

type ServiceFactoryType = {
  serviceFactory: ServiceFactory;
}

export const serviceFactoryFixtures = base.extend<ServiceFactoryType>({
  serviceFactory: async ({ request }, use) => {
    const serviceFactory = new ServiceFactory(request);
    await use(serviceFactory);
  }
});