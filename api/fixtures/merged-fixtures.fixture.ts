import { mergeTests as mergeMultipleFixtures } from "@playwright/test";

import { authFixtures } from "./auth.fixture";
import { serviceFactoryFixtures } from "./global.fixture";
import { serviceFixtures } from "./service.fixture";

export const test = mergeMultipleFixtures(
  authFixtures,
  serviceFactoryFixtures,
  serviceFixtures
);