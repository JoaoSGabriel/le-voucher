import { faker } from "@faker-js/faker";

function generateDiscount() {
  return Math.floor(Math.random() * 100) + 1;
}

export function generateVoucher() {
  const voucher = {
    code: faker.random.alphaNumeric(10, { casing: "upper" }),
    discount: generateDiscount(),
  };

  return voucher;
}
