// Thêm hàm này vào ProductService.js
export async function getProducts() {
  try {
    const response = await fetch("./src/json/products.json");
    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu sản phẩm!");
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    return [];
  }
}

// Giữ nguyên hàm initProducts cũ của bạn
export async function initProducts(renderCallback) {
  try {
    const products = await getProducts();
    const container = document.querySelector("#todayProducts");
    if (typeof renderCallback === "function") {
      renderCallback(container, products);
    }
  } catch (error) {
    console.error("Lỗi khi hiển thị sản phẩm:", error);
  }
}