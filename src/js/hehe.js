async function getProducts() {
  try {
    const response = await fetch("./src/js/products.json");

    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu sản phẩm!");
    }

    const products = await response.json();

    return products;
  } catch (error) {
    console.error("Lỗi:", error);
    return [];
  }
}
function renderProducts(container, products) {
  if (!container) {
    console.warn("Không tìm thấy container để render sản phẩm!");
    return;
  }
  container.innerHTML = products
    .map((product) => {
      return `
            <div class="product-card"
                 data-product-id="${product.id}">

                <div class="product-img-box">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >
                </div>

                <div class="product-info">

                    <h3 class="product-name">
                        ${product.name}
                    </h3>

                    <div class="product-rating">
                        <i class="ri-star-fill"></i>
                        <i class="ri-star-fill"></i>
                        <i class="ri-star-fill"></i>
                        <i class="ri-star-fill"></i>
                        <i class="ri-star-fill"></i>
                    </div>

                    <div class="price-box">
                        <span class="discount-badge">
                            ${product.discount}
                        </span>

                        <span class="old-price">
                            ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString("vi-VN")} đ</span>` : ""}
                        </span>
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

async function initProducts() {
  const products = await getProducts();

  const todayProductsEl = document.querySelector(".product-grid");

  renderProducts(todayProductsEl, products);
}

initProducts();
