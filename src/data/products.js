const products = JSON.parse(localStorage.getItem("products")) || [];

products.reverse();

// Bỏ dấu + viết thường: "Cá Hồi" -> "ca hoi"
function normalizeText(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

// Lấy tất cả sản phẩm đang hiển thị
function getAllProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  return products.filter((p) => p.hidden === 0);
}

// Giá cuối: có giảm giá thì tính theo giảm, không thì lấy giá gốc
function getFinalPrice(p) {
  const percent = parseFloat(String(p.discount ?? "").replace(/[^\d.]/g, ""));
  if (!percent) return p.price;
  return Math.round(p.price * (1 - percent / 100));
}

// Lọc theo loại: ["Thức ăn", "Đồ chơi"]
function filterByType(list, types = []) {
  if (types.length === 0) return list;
  return list.filter((p) => types.includes(p.type));
}

// Lọc theo thú cưng: ["Chó", "Mèo", "Cả Chó và Mèo"]
// Chọn Chó hoặc Mèo thì vẫn lấy sản phẩm dùng chung cho cả hai
function filterByPet(list, pets = []) {
  if (pets.length === 0) return list;
  return list.filter((p) => pets.includes(p.pet) || p.pet === "Cả Chó và Mèo");
}

// Lọc theo giá tối đa (tính theo giá sau giảm)
function filterByPrice(list, maxPrice = null) {
  if (maxPrice == null) return list;
  return list.filter((p) => getFinalPrice(p) <= maxPrice);
}

// Tìm theo từ khóa trong khung tìm kiếm
// Gõ nhiều từ thì sản phẩm phải chứa đủ các từ (không cần đúng thứ tự, không cần dấu)
function searchProducts(list, keyword = "") {
  const words = normalizeText(keyword).split(/\s+/).filter(Boolean);
  if (words.length === 0) return list;

  return list.filter((p) => {
    const text = normalizeText(
      [p.name, p.brand, p.type, p.pet, p.weight].filter(Boolean).join(" "),
    );
    return words.every((w) => text.includes(w));
  });
}

// Gộp tất cả bộ lọc
function filterProducts(
  { types = [], pets = [], maxPrice = null, keyword = "" } = {},
  list = getAllProducts(),
) {
  let result = list;
  result = filterByType(result, types);
  result = filterByPet(result, pets);
  result = filterByPrice(result, maxPrice);
  result = searchProducts(result, keyword);
  return result;
}

/* ========== PHẦN 2: ĐỌC GIAO DIỆN (theo đúng HTML hiện tại) ========== */

// Chữ trên giao diện -> giá trị trong data
const PET_LABEL_TO_DATA = {
  "Chó và Mèo": "Cả Chó và Mèo",
};

// Đọc các ô đã tick trong 1 khối (#products hoặc #pet)
function getCheckedLabels(selectId) {
  return Array.from(
    document.querySelectorAll(
      `#${selectId} .dropdown-item input[type="checkbox"]:checked`,
    ),
    (input) => input.closest("label").textContent.trim(),
  );
}
function readFilterFromUI() {
  const types = getCheckedLabels("products");
  const pets = getCheckedLabels("pet").map((t) => PET_LABEL_TO_DATA[t] || t);

  const slider = document.querySelector("#price .range-slider");
  const maxPrice = slider ? Number(slider.value) : null;

  const keyword = document.getElementById("search-body")?.value || "";

  return { types, pets, maxPrice, keyword };
}

// Đọc giao diện rồi lọc luôn, trả về mảng
function filterFromUI() {
  return filterProducts(readFilterFromUI());
}
