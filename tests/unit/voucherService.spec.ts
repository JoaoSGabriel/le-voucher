import { jest } from "@jest/globals";

import voucherService from "services/voucherService";
import voucherRepository from "repositories/voucherRepository";

import { generateVoucher } from "../factories/voucher.factories";

const voucher = generateVoucher();

describe("Create voucher unit test suite", () => {
  it("should create a valid voucher", () => {
    expect(async () => {
      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockImplementationOnce((): any => {
          return "";
        });

      jest
        .spyOn(voucherRepository, "createVoucher")
        .mockImplementationOnce((): any => {
          return voucher;
        });

      await voucherService.createVoucher(voucher.code, voucher.discount);
    }).not.toEqual({ message: "Voucher already exist.", type: "conflict" });
  });

  it("should respond with 'Voucher already exist.' error", () => {
    expect(async () => {
      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockImplementationOnce((): any => {
          return [voucher];
        });

      await voucherService.createVoucher(voucher.code, voucher.discount);
    }).rejects.toStrictEqual({
      message: "Voucher already exist.",
      type: "conflict",
    });
  });
});

describe("Use voucher unit test suite", () => {
  it("should respond with 'Voucher does not exist.' error", async () => {
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return false;
      });

    const response = voucherService.applyVoucher(voucher.code, 100);
    expect(response).rejects.toEqual({
      message: "Voucher does not exist.",
      type: "conflict",
    });
  });

  it("the amount isnt valid to apply discount", async () => {
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          code: voucher.code,
          discount: voucher.discount,
          used: false,
        };
      });

    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {
        return;
      });

    const response = await voucherService.applyVoucher(voucher.code, 99);

    let expectedResult = {
      amount: 99,
      discount: voucher.discount,
      finalAmount: 99,
      applied: false,
    };

    expect(response).toEqual(expectedResult);
  });

  it("the voucher is already used", async () => {
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          code: voucher.code,
          discount: voucher.discount,
          used: true,
        };
      });

    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {
        return;
      });

    const response = await voucherService.applyVoucher(voucher.code, 100);

    let expectedResult = {
      amount: 100,
      discount: voucher.discount,
      finalAmount: 100,
      applied: false,
    };

    expect(response).toEqual(expectedResult);
  });

  it("should apply the voucher and return correct new Valor", async () => {
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          code: voucher.code,
          discount: voucher.discount,
          used: false,
        };
      });

    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {
        return;
      });

    const response = await voucherService.applyVoucher(voucher.code, 100);

    const expectedResult = {
      amount: 100,
      discount: voucher.discount,
      finalAmount: 100 - 100 * (voucher.discount / 100),
      applied: true,
    };

    expect(response).toEqual(expectedResult);
  });
});
