import { initProducts } from './ProductService.js';

document.addEventListener('DOMContentLoaded', () => {
  initProducts(renderProducts);
});

export const formatMoney = (n) => (Number(n) || 0).toLocaleString('vi-VN');

// Tính giá gốc, giá bán và nhãn giảm giá của 1 sản phẩm
export function getPriceInfo(p) {
  // Giá gốc: ưu tiên price; data khuyến mãi (test.js) chưa có price thì lấy min_order_value
  const base = Number(p.price ?? p.min_order_value) || 0;

  // Dạng cũ: có sẵn oldPrice lớn hơn price
  if (p.oldPrice > base) {
    return {
      oldPrice: p.oldPrice,
      price: base,
      hasDiscount: true,
      badge: p.discount || '',
    };
  }

  let discount = 0;
  let badge = '';
  if (p.discount_type === 'percentage') {
    discount = (base * p.discount_value) / 100;
    badge = `-${p.discount_value}%`;
  } else if (p.discount_type === 'fixed_amount') {
    discount = p.discount_value;
    badge = `-${formatMoney(discount)} đ`;
  }
  // 'shipping' là giảm phí ship nên không trừ vào giá sản phẩm

  if (p.max_discount_amount)
    discount = Math.min(discount, p.max_discount_amount);

  return {
    oldPrice: base,
    price: base - discount,
    hasDiscount: discount > 0,
    badge,
  };
}

function renderProducts(container, products) {
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; padding: 20px; color: #666;">Không có sản phẩm nào để hiển thị.</p>';
    return;
  }

  container.innerHTML = products
    .slice(0, 5)
    .map((p) => {
      const { oldPrice, price, hasDiscount, badge } = getPriceInfo(p);

      return `
        <div class="product-card" onclick="xemChiTietSanPham('${p.id}')" style="cursor: pointer;">
          <div class="product-img-box">
            <img
              src="${p.image || './src/img/Avatar-icon.png'}"
              alt="${p.name}"
              loading="lazy"
              onerror="this.onerror=null;this.src='./src/img/Avatar-icon.png'"
            />
          </div>
          <div class="product-info">
            <h3 class="product-name" title="${p.name}">${p.name}</h3>
            <div class="product-rating">${'<i class="ri-star-fill"></i>'.repeat(5)}</div>
            <div class="price-box ${hasDiscount ? '' : 'no-discount'}">
              ${badge ? `<span class="discount-badge">${badge}</span>` : ''}
              ${hasDiscount ? `<span class="old-price">${formatMoney(oldPrice)} đ</span>` : ''}
            </div>
            <div class="current-price">${formatMoney(price)} đ</div>
          </div>
        </div>
      `;
    })
    .join('');
}
