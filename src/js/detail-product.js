import { getProducts } from './ProductService.js';
import { getPriceInfo, formatMoney } from './product.js';

const FALLBACK_IMG = './src/img/Avatar-icon.png';

const setText = (id, text) => (document.getElementById(id).textContent = text);

async function xemChiTietSanPham(productId) {
  const products = await getProducts();
  const p = products.find((item) => String(item.id) === String(productId));
  if (!p) return console.error('Không tìm thấy sản phẩm:', productId);

  // Ảnh (lỗi ảnh thì dùng ảnh thay thế)
  ['detailImg', 'detailMiniImg'].forEach((id) => {
    const img = document.getElementById(id);
    img.onerror = () => {
      img.onerror = null;
      img.src = FALLBACK_IMG;
    };
    img.src = p.image || FALLBACK_IMG;
  });

  // Thông tin cơ bản
  setText('detailTitle', p.name);
  setText('detailSubTitle', p.name);
  setText('detailBrand', p.brand || '—');
  setText('detailCategory', p.category || '—');
  setText('detailWeight', p.weight || '—');
  setText('detailOrigin', p.origin || 'Đang cập nhật');
  setText('detailSoldText', `| Đã bán Online: ${p.sold ?? 0}`);
  setText(
    'detailStock',
    typeof p.stock === 'number' ? `Còn ${p.stock} sản phẩm` : p.stock || '—'
  );
  setText('quantity', 1);

  // Giá
  const { oldPrice, price, hasDiscount, badge } = getPriceInfo(p);
  setText('detailSalesPrice', formatMoney(price) + ' đ');
  setText('detailOldPrice', formatMoney(oldPrice) + ' đ');
  setText('detailDiscount', badge);
  document.getElementById('detailOldPrice').style.display = hasDiscount
    ? ''
    : 'none';
  document.getElementById('detailDiscount').style.display = badge ? '' : 'none';

  // Mô tả + đặc điểm nổi bật
  document.getElementById('detailFullContent').innerHTML = `
    <p><strong>${p.name}</strong> ${p.description || p.desc || ''}</p>
    <p><strong>Đặc điểm nổi bật (Highlight):</strong></p>
    <ul>${(p.highlights || []).map((h) => `<li>${h}</li>`).join('')}</ul>
  `;

  showView('view-detail'); // showView nằm trong main.js
}

// Gán ra toàn cục để onclick trong HTML gọi được



function renderProductsToScreen() {
  // 1. Lấy dữ liệu sản phẩm từ localStorage
  var data = localStorage.getItem('products');
  var products = data ? JSON.parse(data) : [];

  // 2. Tìm đến phần tử có class là .screen-product trên trang chủ
  var screenProductContainer = document.querySelector('.screen-product');
  
  if (!screenProductContainer) {
    return; // Nếu không tìm thấy khung này thì dừng lại
  }

  // 3. Nếu chưa có sản phẩm nào trong localStorage
  if (products.length === 0) {
    screenProductContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Chưa có sản phẩm nào.</p>';
    return;
  }

  // 4. Duyệt qua mảng sản phẩm để tạo chuỗi HTML cho từng product-card
  var html = '<div class="product-grid">'; // Tạo lưới chứa các card

  products.forEach(function (product) {
    // Xử lý linh hoạt tên các thuộc tính (tránh trường hợp key ở admin và trang chủ đặt khác tên nhau)
    var name = product.name || 'Sản phẩm thú cưng';
    var image = product.image || product.img || './src/img/img-products/default.webp';
    var price = product.price || product.price_vnd || product.original_price_vnd || 0;
    var formattedPrice = Number(price).toLocaleString('vi-VN') + ' đ';

    html += `
      <div class="product-card" onclick="xemChiTietSanPham('${product.id}')">
        <div class="product-img-box">
          <img src="${image}" alt="${name}" />
        </div>
        <div class="product-info">
          <h3 class="product-name">${name}</h3>
          <div class="product-rating">
            <i class="ri-star-fill"></i><i class="ri-star-fill"></i>
            <i class="ri-star-fill"></i><i class="ri-star-fill"></i>
            <i class="ri-star-fill"></i>
          </div>
          <div class="current-price">${formattedPrice}</div>
        </div>
      </div>
    `;
  });

  html += '</div>';

  // 5. InnerHTML vào trong .screen-product
  screenProductContainer.innerHTML = html;
}

// Chạy hàm ngay khi trang được tải xong
document.addEventListener('DOMContentLoaded', function () {
  renderProductsToScreen();
});
window.xemChiTietSanPham = xemChiTietSanPham;