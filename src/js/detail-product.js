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
window.xemChiTietSanPham = xemChiTietSanPham;
