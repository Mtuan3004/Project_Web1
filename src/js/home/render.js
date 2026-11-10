const productContainer = document.getElementById("todayProducts");
const suggestProducts = document.getElementById("related-products-container");

function formatCurrency(amount) {
    const num = Math.max(0, Number(amount) || 0);
    return num.toLocaleString('vi-VN') + ' đ';
}

// Hàm render tổng quát (Nhận vào container, mảng data, và một hàm callback để tự thiết kế HTML)
function renderToContainer(container, dataArray, templateCallback, limit = null) {
    if (!container) return;

    if (!dataArray || dataArray.length === 0) {
        container.innerHTML = `<p class="no-data">Không có dữ liệu.</p>`;
        return;
    }

    // Cắt mảng theo limit 
    const processedArray = limit ? dataArray.slice(0, limit) : dataArray;

    // Map qua mảng và gọi hàm template tự định nghĩa cấu trúc HTML bên ngoài
    container.innerHTML = processedArray.map(item => templateCallback(item)).join('');
}

// Gọi hàm render khi trang được tải xong
document.addEventListener("DOMContentLoaded", () => {
    renderToContainer(productContainer, products, (product) => {
        const priceStr = formatCurrency(product.price);
        const oldPriceStr = product.oldPrice ? formatCurrency(product.oldPrice) : '';

    return `
    <div class="product-card" onclick="xemChiTietSanPham('${product.id}')">
                    <div class="product-img-box">
                        <img src="${product.image || './src/img/default-product.png'}" alt="${product.name || 'Sản phẩm'}" />
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name || 'Tên sản phẩm'}</h3>
                        <div class="product-rating">
                            <i class="ri-star-fill"></i><i class="ri-star-fill"></i>
                            <i class="ri-star-fill"></i><i class="ri-star-fill"></i>
                            <i class="ri-star-fill"></i>
                        </div>
                        <div class="price-box">
                            ${product.discount ? `<span class="discount-badge">${product.discount}</span>` : ''}
                            ${oldPriceStr ? `<span class="old-price">${product.oldPrice}</span>` : ''}
                        </div>
                        <div class="current-price">${priceStr}</div>
                    </div>
                </div>
            `;
    }, 5);
    renderToContainer(suggestProducts, products, (product) => {
        const priceStr = formatCurrency(product.price);
        const oldPriceStr = product.oldPrice ? formatCurrency(product.oldPrice) : '';

    return `
    <div class="product-card" onclick="xemChiTietSanPham('${product.id}')">
                    <div class="product-img-box">
                        <img src="${product.image || './src/img/default-product.png'}" alt="${product.name || 'Sản phẩm'}" />
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name || 'Tên sản phẩm'}</h3>
                        <div class="product-rating">
                            <i class="ri-star-fill"></i><i class="ri-star-fill"></i>
                            <i class="ri-star-fill"></i><i class="ri-star-fill"></i>
                            <i class="ri-star-fill"></i>
                        </div>
                        <div class="price-box">
                            ${product.discount ? `<span class="discount-badge">${product.discount}</span>` : ''}
                            ${oldPriceStr ? `<span class="old-price">${product.oldPrice}</span>` : ''}
                        </div>
                        <div class="current-price">${priceStr}</div>
                    </div>
                </div>
            `;
    }, );
});

// Hàm xem chi tiết sản phẩm và đổ dữ liệu vào HTML
function xemChiTietSanPham(id) {
  const p = products.find((item) => String(item.id) === String(id));
  if (!p) {
    console.warn("Không tìm thấy sản phẩm có ID:", id);
    return;
  }

  const hasDiscount = Number(p.oldPrice) > Number(p.price);

  // --- Hình ảnh ---
  const imgSrc = p.image && p.image.trim() !== "" ? p.image : '';
  const detailImg = document.getElementById('detailImg');
  const detailMiniImg = document.getElementById('detailMiniImg');
  if (detailImg) detailImg.src = imgSrc;
  if (detailMiniImg) detailMiniImg.src = imgSrc;

  // --- Tiêu đề ---
  const productName = p.name || 'Tên sản phẩm';
  const detailTitle = document.getElementById('detailTitle');
  const detailSubTitle = document.getElementById('detailSubTitle');
  if (detailTitle) detailTitle.textContent = productName;
  if (detailSubTitle) detailSubTitle.textContent = productName;

  // --- Giá & Giảm giá ---
  const salesPriceEl = document.getElementById('detailSalesPrice');
  const oldPriceEl = document.getElementById('detailOldPrice');
  const discountEl = document.getElementById('detailDiscount');

  if (salesPriceEl) salesPriceEl.textContent = formatCurrency(p.price);
  if (oldPriceEl) oldPriceEl.textContent = formatCurrency(p.oldPrice);
  if (discountEl) discountEl.textContent = p.discount || '';

  if (oldPriceEl) oldPriceEl.style.display = hasDiscount ? '' : 'none';
  if (discountEl) discountEl.style.display = hasDiscount ? '' : 'none';

  // --- Thông tin chi tiết khác ---
  const detailStock = document.getElementById('detailStock');
  if (detailStock) detailStock.textContent = p.stock || 'Còn hàng';

  const detailSoldText = document.getElementById('detailSoldText');
  if (detailSoldText) detailSoldText.textContent = `| Đã bán Online: ${p.sold ?? 0}`;

  const detailBrand = document.getElementById('detailBrand');
  if (detailBrand) detailBrand.textContent = p.brand || 'PETPET';

  const detailCategory = document.getElementById('detailCategory');
  if (detailCategory) detailCategory.textContent = p.category || 'Thức ăn cho thú cưng';

  const detailWeight = document.getElementById('detailWeight');
  if (detailWeight) detailWeight.textContent = p.weight || '—';

  const detailOrigin = document.getElementById('detailOrigin');
  if (detailOrigin) detailOrigin.textContent = p.origin || '12 Tháng ';

  // --- Mô tả & Highlights ---
  const detailFullContent = document.getElementById('detailFullContent');
  if (detailFullContent) {
    let highlightsHTML = '';
    if (p.highlights && Array.isArray(p.highlights) && p.highlights.length > 0) {
      highlightsHTML = `
        <p><strong>Đặc điểm nổi bật (Highlight):</strong></p>
        <ul>${p.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
      `;
    }

    detailFullContent.innerHTML = `
      <p><strong>${productName}</strong> ${p.description || ''}</p>
      ${highlightsHTML}
    `;
  }

  const quantityEl = document.getElementById('quantity');
  if (quantityEl) quantityEl.textContent = 1;

  if (typeof showView === 'function') {
    showView('view-detail');
  }
}