
export async function fetchVouchers() {
  try {
    const res = await fetch("https://tripgo-api.onrender.com/api/public/vouchers/hotel-page");
    const api = await res.json();
    const apiResult = Array.isArray(api.result) ? api.result : [];

    // Map the API result to ensure all fields are present
    const mapped = apiResult.map((voucher) => ({
      id: voucher.id ?? 0,
      name: voucher.name || "",
      code: voucher.code || "",
      description: voucher.description || "",
      image: voucher.image || "",
      discountType: voucher.discountType || "PERCENTAGE",
      discountValue: voucher.discountValue ?? 0,
      maxDiscountAmount: voucher.maxDiscountAmount ?? 0,
      isActive: voucher.isActive ?? true,
    }));

    return {
      code: typeof api.code !== "undefined" ? api.code : 0,
      message: api.message || "Success",
      result: mapped,
    };
  } catch (err) {
    console.error("fetchVouchers error:", err);
    // Return fallback response on error
    return {
      code: -1,
      message: err?.message || "Failed to fetch vouchers",
      result: [],
    };
  }
}

export default { fetchVouchers };
