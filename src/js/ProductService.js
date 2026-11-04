export async function initProducts(renderCallback) {
  try {
    const response = await fetch("./src/json/products.json");
    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu sản phẩm!");
    }
    const products = await response.json();

    const container = document.querySelector("#todayProducts");

    // Gọi hàm render được truyền vào từ product.js
    if (typeof renderCallback === "function") {
      renderCallback(container, products);
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
  }
}
