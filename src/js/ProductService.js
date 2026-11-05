// Thêm hàm này vào ProductService.js
const STORAGE_KEY = 'petpetProducts';

export async function getProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
    return [];
  }
}

// Giữ nguyên hàm initProducts cũ của bạn
export async function initProducts(renderCallback) {
  try {
    const products = await getProducts();
    const container = document.querySelector('#todayProducts');
    if (typeof renderCallback === 'function') {
      renderCallback(container, products);
    }
  } catch (error) {
    console.error('Lỗi khi hiển thị sản phẩm:', error);
  }
}
