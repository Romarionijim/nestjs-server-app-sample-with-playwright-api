import { mergeTests as mergeMultipleFixtures } from "@playwright/test";

import { authFixture } from "./auth.fixture";
import { globalFactoryFixture } from "./global.fixture";
import { serviceFixture } from "./service.fixture";

export const test = mergeMultipleFixtures(
  authFixture,
  globalFactoryFixture,
  serviceFixture
);