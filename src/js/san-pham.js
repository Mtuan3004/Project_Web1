/**
 * File: src/js/san-pham.js
 * Nhiệm vụ: Tải dữ liệu JSON và hiển thị danh sách sản phẩm đồng bộ với hệ thống SPA
 */

document.addEventListener("DOMContentLoaded", () => {
  taiDanhSachSanPham();
});

// Hàm nạp dữ liệu từ products.json
function taiDanhSachSanPham() {
  fetch("./src/js/products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Lỗi tải file JSON: Mã phản hồi ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        renderProducts(data);
      } else {
        hienThiKhongCoSanPham("Danh sách sản phẩm hiện đang trống.");
      }
    })
    .catch((error) => {
      console.warn(
        "Không thể nạp ./src/js/products.json, thử chuyển sang FALLBACK_LIST:",
        error,
      );
      // Dùng FALLBACK_LIST có sẵn trong index.html nếu fetch file gặp lỗi
      if (
        typeof FALLBACK_LIST !== "undefined" &&
        Array.isArray(FALLBACK_LIST)
      ) {
        renderProducts(FALLBACK_LIST);
      } else {
        hienThiKhongCoSanPham(
          "Chưa thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.",
        );
      }
    });
}

// Hàm render danh sách card sản phẩm vào id="productList"
function renderProducts(products) {
  const container = document.getElementById("productList");
  const countSpan = document.getElementById("productCount");

  if (countSpan) {
    countSpan.textContent = `Hiển thị ${products.length} sản phẩm`;
  }

  if (!container) {
    console.error("LỖI: Không tìm thấy phần tử HTML mang id='productList'!");
    return;
  }

  // Khớp đúng cấu trúc HTML và class CSS trong index.html
  container.innerHTML = products
    .map((sp) => {
      const giaHienTai = Number(sp.price || 0).toLocaleString("vi-VN");
      const giaGocVal = sp.originalPrice || sp.oldPrice;
      const giaGocHtml = giaGocVal
        ? `<span class="old-price">${Number(giaGocVal).toLocaleString("vi-VN")} đ</span>`
        : "";

      // Gọi hàm openProductDetail(id) của SPA để mở thẳng View 4 chi tiết
      return `
      <div class="product-card-link" onclick="xemChiTietSanPham('${sp.id}')">
        <div class="product-card-item">
          <div class="product-img-box">
            <img 
              src="${sp.image}" 
              alt="${sp.name}" 
              loading="lazy" 
              onerror="this.src='./src/img/Avatar-icon.png'" 
            />
          </div>
          <div class="product-info">
            <h3 class="product-name" title="${sp.name}">${sp.name}</h3>
            <div class="price-box">
              <span class="current-price">${giaHienTai} đ</span>
              ${giaGocHtml}
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// Hàm điều hướng sang view chi tiết sản phẩm
function xemChiTietSanPham(id) {
  if (typeof window.openProductDetail === "function") {
    window.openProductDetail(id);
  } else {
    // Dự phòng nếu mở dưới dạng file HTML truyền thống
    window.location.href = `chi-tiet-san-pham.html?id=${id}`;
  }
}

// Hàm thông báo
