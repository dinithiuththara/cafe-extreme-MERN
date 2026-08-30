// Formats a number as Sri Lankan Rupees, e.g. 1300 -> "Rs 1,300"
export const formatPrice = (amount) => `Rs ${Number(amount).toLocaleString("en-LK")}`;

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
