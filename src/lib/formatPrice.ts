export function formatPrice(
  price: string | number | null | undefined
) {
  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return "Contact";
  }

  const numericPrice =
    Number(price);

  if (
    Number.isNaN(
      numericPrice
    )
  ) {
    return String(price);
  }

  return `$${numericPrice.toLocaleString()}`;
}