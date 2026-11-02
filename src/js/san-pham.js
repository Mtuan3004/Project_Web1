/**
 * File: src/js/san-pham.js
 * Nhiệm vụ: Tải file data/products.json và vẽ các card sản phẩm lên trang
 */

document.addEventListener('DOMContentLoaded', () => {
  taiDanhSachSanPham();
});

function taiDanhSachSanPham() {
  fetch('./src/js/products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Không thể tải file data/products.json');
      }
      return response.json();
    })
    .then(data => {
      renderProducts(data);
    })
    .catch(error => {
      console.error('Lỗi khi nạp dữ liệu sản phẩm:', error);
      const container = document.getElementById('productList');
      if (container) {
        container.innerHTML = '<p style="color: #666; padding: 20px;">Chưa tải được danh sách sản phẩm. Hãy kiểm tra lại file data/products.json!</p>';
      }
    });
}

function renderProducts(products) {
  const container = document.getElementById('productList');
  const countSpan = document.getElementById('productCount');

  if (countSpan) {
    countSpan.textContent = `Hiển thị ${products.length} sản phẩm`;
  }

  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = '<p>Không có sản phẩm nào để hiển thị.</p>';
    return;
  }

  // Tạo HTML card cho từng sản phẩm và gắn link dẫn sang trang chi tiết kèm ID
  container.innerHTML = products.map(sp => {
    const giaGoc = sp.originalPrice || sp.oldPrice;
    const giaGocHtml = giaGoc 
      ? `<span class="old-price">${Number(giaGoc).toLocaleString('vi-VN')} đ</span>` 
      : '';

    return `
      <a href="chi-tiet-san-pham.html?id=${sp.id}" class="product-card-link">
        <div class="product-card">
          <div class="product-img-box">
            <img src="${sp.image}" alt="${sp.name}" loading="lazy" />
          </div>
          <div class="product-info">
            <h3 class="product-name" title="${sp.name}">${sp.name}</h3>
            <div class="price-box">
              <span class="current-price">${Number(sp.price).toLocaleString('vi-VN')} đ</span>
              ${giaGocHtml}
            </div>
          </div>
        </div>
      </a>
    `;
  }).join('');
}