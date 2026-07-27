const formatter = new Intl.NumberFormat("es-HN", {
  style: "currency",
  currency: "HNL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (n: number): string => {
  return formatter.format(n);
};