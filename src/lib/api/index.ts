import { USE_MOCKS } from "./config";
import { catalogMock } from "./mocks/catalog.mock";
import { flashMock } from "./mocks/flash.mock";
import { kitsMock } from "./mocks/kits.mock";
import { ordersMock } from "./mocks/orders.mock";
import { productsMock } from "./mocks/products.mock";
import { storeMock } from "./mocks/store.mock";
import { catalogService } from "./services/catalog.service";
import { flashService } from "./services/flash.service";
import { kitsService } from "./services/kits.service";
import { ordersService } from "./services/orders.service";
import { productsService } from "./services/products.service";
import { storeService } from "./services/store.service";

export const api = {
  store: USE_MOCKS ? storeMock : storeService,
  catalog: USE_MOCKS ? catalogMock : catalogService,
  products: USE_MOCKS ? productsMock : productsService,
  kits: USE_MOCKS ? kitsMock : kitsService,
  flash: USE_MOCKS ? flashMock : flashService,
  orders: USE_MOCKS ? ordersMock : ordersService,
};

export * from "./types";
