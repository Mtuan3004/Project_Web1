import { initProducts } from "./ProductService.js";

// Gọi hàm và truyền hàm render của bạn vào để nó xử lý dữ liệu và đổ ra container
document.addEventListener("DOMContentLoaded", () => {
  initProducts(renderProducts);
});

// Hàm render sản phẩm của bạn
function renderProducts(container, products) {
  if (!container) {
    console.warn("Không tìm thấy container để render sản phẩm!");
    return;
  }

  container.innerHTML = products
    .slice(0, 5)
    .map((product) => {
      const hasDiscount = product.oldPrice && product.oldPrice > product.price;

      return `
            <div class="product-card" onclick="xemChiTietSanPham('${product.id}')" style="cursor: pointer;">
                <div class="product-img-box">
                    <img 
                        src="${product.image}" 
                        alt="${product.name}" 
                        loading="lazy" 
                        onerror="this.src='./src/img/Avatar-icon.png'" 
                    />
                </div>
                <div class="product-info">
                    <h3 class="product-name" title="${product.name}">${product.name}</h3>
                    
                    <div class="product-rating">
                        <i class="ri-star-fill"></i>
                        <i class="ri-star-fill"></i>
                        <i class="ri-star-fill"></i>
                        <i class="ri-star-fill"></i>
                        <i class="ri-star-fill"></i>
                    </div>

                    <div class="price-box ${hasDiscount ? "" : "no-discount"}">
                        ${hasDiscount ? `<span class="discount-badge">${product.discount || ""}</span>` : ""}
                        ${hasDiscount ? `<span class="old-price">${product.oldPrice.toLocaleString("vi-VN")} đ</span>` : ""}
                    </div>
                    
                    <div class="current-price">
                        ${product.price ? product.price.toLocaleString("vi-VN") : 0} đ
                    </div>
                </div>
            </div>
        `;
    })
    .join("");
}
