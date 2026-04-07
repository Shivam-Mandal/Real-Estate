export const currency = (value, listingType = "sale") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value) + (listingType === "rent" ? "/mo" : "");
