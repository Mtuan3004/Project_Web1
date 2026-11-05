import { getProducts } from "./ProductService.js";

export async function renderProductDetail(productId) {
  // Lấy danh sách sản phẩm từ ProductService
  const products = await getProducts();

  if (!products || products.length === 0) {
    console.error("Dữ liệu sản phẩm chưa được tải!");
    return;
  }

  // Tìm sản phẩm theo ID
  const product = products.find((item) => item.id === productId);

  if (!product) {
    console.error("Không tìm thấy sản phẩm:", productId);
    return;
  }

  // Định dạng tiền Việt Nam
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " đ";
  };

  // Lấy các thành phần HTML
  const detailImg = document.getElementById("detailImg");
  const detailMiniImg = document.getElementById("detailMiniImg");

  // Ảnh sản phẩm
  if (detailImg) detailImg.src = product.image;
  if (detailMiniImg) detailMiniImg.src = product.image;

  // Tên sản phẩm
  document.getElementById("detailTitle").textContent = product.name;
  document.getElementById("detailSubTitle").textContent = product.name;

  // Thông tin cơ bản
  document.getElementById("detailBrand").textContent = product.brand;
  document.getElementById("detailCategory").textContent = product.category;
  document.getElementById("detailWeight").textContent = product.weight;
  document.getElementById("detailStock").textContent = product.stock;

  // Xử lý giá sản phẩm
  const discountElement = document.getElementById("detailDiscount");
  const oldPriceElement = document.getElementById("detailOldPrice");
  const salesPriceElement = document.getElementById("detailSalesPrice");

  // Kiểm tra an toàn trước khi gọi trim()
  const hasDiscount = product.discount && product.discount.trim() !== "";

  if (hasDiscount) {
    // Có giảm giá
    discountElement.style.display = "inline-block";
    oldPriceElement.style.display = "inline-block";

    discountElement.textContent = product.discount;
    oldPriceElement.textContent = formatPrice(product.oldPrice);
  } else {
    // Không giảm giá
    discountElement.style.display = "none";
    oldPriceElement.style.display = "none";
  }

  // Luôn hiển thị giá bán
  salesPriceElement.textContent = formatPrice(product.price);

  // Nội dung mô tả và đặc điểm nổi bật
  document.getElementById("detailFullContent").innerHTML = `
    <p>
      <strong id="contentTitleBold">${product.name}</strong>
      ${product.description}
    </p>

    <p>
      <strong>Đặc điểm nổi bật (Highlight):</strong>
    </p>

    <ul>
      ${(product.highlights || [])
        .map((item) => `<li>${item}</li>`)
        .join("")}
    </ul>
  `;
}

function xemChiTietSanPham(productId) {
  renderProductDetail(productId);
}
// Gán hàm ra phạm vi toàn cục để sự kiện onclick trong HTML có thể gọi được
window.xemChiTietSanPham = xemChiTietSanPham;