const productContainer = document.getElementById("todayProducts");

function formatCurrency(amount) {
    const num = Math.max(0, Number(amount) || 0);
    return num.toLocaleString('vi-VN') + ' đ';
}

// 2. Hàm render tổng quát (Nhận vào container, mảng data, và một hàm callback để tự thiết kế HTML)
function renderToContainer(container, dataArray, templateCallback, limit = null) {
    if (!container) return;

    if (!dataArray || dataArray.length === 0) {
        container.innerHTML = `<p class="no-data">Không có dữ liệu.</p>`;
        return;
    }

    // Cắt mảng theo limit nếu có
    const processedArray = limit ? dataArray.slice(0, limit) : dataArray;

    // Map qua mảng và gọi hàm template do mày tự định nghĩa cấu trúc HTML bên ngoài
    container.innerHTML = processedArray.map(item => templateCallback(item)).join('');
}

// 4. Gọi hàm render khi trang được tải xong
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
});