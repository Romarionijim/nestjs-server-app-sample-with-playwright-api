import { mergeTests as mergeMultipleFixtures } from "@playwright/test";

import { authFixtures } from "./auth.fixture";
import { serviceFixtures } from "./service.fixture";

export const test = mergeMultipleFixtures(
  authFixtures,
  serviceFixtures
);