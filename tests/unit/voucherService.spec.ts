import { jest } from "@jest/globals";

import voucherService from "services/voucherService";
import voucherRepository from "repositories/voucherRepository";

describe("voucherService test suite", () => {
  it("should not apply discount for values below $100", async () => {
    const voucher = {
      code: "",
      discount: 10,
    };
  });
});
