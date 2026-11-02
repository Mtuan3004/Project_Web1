// Dữ liệu Mock ban đầu cho Hệ thống VetCare
const DEFAULT_CATEGORIES = [
  { id: "CAT01", name: "Thuốc Đặc Trị & Kháng Sinh", active: true },
  { id: "CAT02", name: "Vaccine & Biologicals", active: true },
  { id: "CAT03", name: "Thức Ăn Dinh Dưỡng & Gel", active: true },
  { id: "CAT04", name: "Phụ Kiện & Vệ Sinh Thú Y", active: true },
  { id: "CAT05", name: "Dụng Cụ Y Tế & Tiêu Hao", active: true },
];

const DEFAULT_PRODUCTS = [
  {
    id: "P001",
    catId: "CAT01",
    code: "VET-AMOX",
    name: "Amoxicillin 50% Powder 100g",
    image: "https://placehold.co/400x300/059669/ffffff?text=Amoxicillin+50%25",
    desc: "Đặc trị nhiễm trùng đường hô hấp, tiêu hóa cho gia súc, gia cầm.",
    importPrice: 120000,
    profitMargin: 25,
    stock: 150,
    active: true,
  },
  {
    id: "P002",
    catId: "CAT01",
    code: "VET-ENRO",
    name: "Enrofloxacin Inj 10% (100ml)",
    image: "https://placehold.co/400x300/0284c7/ffffff?text=Enrofloxacin+10%25",
    desc: "Dung dịch tiêm đặc trị viêm phổi, tiêu chảy, tụ huyết trùng.",
    importPrice: 85000,
    profitMargin: 30,
    stock: 80,
    active: true,
  },
  {
    id: "P003",
    catId: "CAT02",
    code: "VAC-RAB",
    name: "Vaccine Phòng Dại Rabisin (1 liều)",
    image: "https://placehold.co/400x300/7c3aed/ffffff?text=Vaccine+Rabisin",
    desc: "Phòng bệnh Dại hiệu quả cao cho chó, mèo từ 3 tháng tuổi.",
    importPrice: 45000,
    profitMargin: 40,
    stock: 200,
    active: true,
  },
  {
    id: "P004",
    catId: "CAT03",
    code: "NUT-GEL",
    name: "Nutri-Plus Gel Dinh Dưỡng Virbac 120g",
    image: "https://placehold.co/400x300/ea580c/ffffff?text=Nutri-Plus+Gel",
    desc: "Bổ sung vitamin, khoáng chất cho chó mèo chó hồi phục sức khỏe.",
    importPrice: 140000,
    profitMargin: 25,
    stock: 45,
    active: true,
  },
  {
    id: "P005",
    catId: "CAT04",
    code: "SAN-SPRAY",
    name: "Xịt Trị Ve Rận Hantox-Spray 300ml",
    image: "https://placehold.co/400x300/16a34a/ffffff?text=Hantox+Spray",
    desc: "Diệt sạch ve, rận, bọ trét ở chó mèo và khu vực chăn nuôi.",
    importPrice: 50000,
    profitMargin: 35,
    stock: 8,
    active: true,
  },
  {
    id: "P006",
    catId: "CAT05",
    code: "MED-SYR",
    name: "Bơm Tiêm Tự Động Thú Y 5ml",
    image: "https://placehold.co/400x300/475569/ffffff?text=Syringe+5ml",
    desc: "Xy-lanh tiêm liên tục chính xác cho heo, bò, gà.",
    importPrice: 210000,
    profitMargin: 20,
    stock: 25,
    active: true,
  },
];

const DEFAULT_USERS = [
  {
    id: "U001",
    username: "user",
    password: "123",
    fullname: "Nguyễn Văn An",
    phone: "0908123456",
    address: "123 Đường Nguyễn Trãi, Q.5, TP.HCM",
    locked: false,
  },
  {
    id: "U002",
    username: "khachhang2",
    password: "123",
    fullname: "Trần Thị Bình",
    phone: "0912345678",
    address: "456 Lê Lợi, Q.1, TP.HCM",
    locked: false,
  },
];

const DEFAULT_ADMIN = { username: "admin", password: "123" };

const DEFAULT_PURCHASE_ORDERS = [
  {
    id: "PO20261001",
    date: "2026-10-15",
    items: [
      { productId: "P001", quantity: 100, importPrice: 120000 },
      { productId: "P002", quantity: 50, importPrice: 85000 },
    ],
    totalAmount: 16250000,
    status: "COMPLETED",
    note: "Nhập hàng định kỳ tháng 10",
  },
];

const DEFAULT_CUSTOMER_ORDERS = [
  {
    id: "ORD-1001",
    userId: "U001",
    customerName: "Nguyễn Văn An",
    phone: "0908123456",
    address: "123 Đường Nguyễn Trãi, Q.5, TP.HCM",
    date: "2026-10-20 14:30",
    items: [
      {
        productId: "P004",
        productName: "Nutri-Plus Gel Dinh Dưỡng Virbac 120g",
        price: 175000,
        quantity: 2,
      },
      {
        productId: "P005",
        productName: "Xịt Trị Ve Rận Hantox-Spray 300ml",
        price: 67500,
        quantity: 1,
      },
    ],
    totalAmount: 417500,
    paymentMethod: "COD",
    status: "COMPLETED",
  },
];

function initDB() {
  if (!localStorage.getItem("vet_categories"))
    localStorage.setItem("vet_categories", JSON.stringify(DEFAULT_CATEGORIES));
  if (!localStorage.getItem("vet_products"))
    localStorage.setItem("vet_products", JSON.stringify(DEFAULT_PRODUCTS));
  if (!localStorage.getItem("vet_users"))
    localStorage.setItem("vet_users", JSON.stringify(DEFAULT_USERS));
  if (!localStorage.getItem("vet_purchase_orders"))
    localStorage.setItem(
      "vet_purchase_orders",
      JSON.stringify(DEFAULT_PURCHASE_ORDERS),
    );
  if (!localStorage.getItem("vet_orders"))
    localStorage.setItem("vet_orders", JSON.stringify(DEFAULT_CUSTOMER_ORDERS));
}
initDB();

const DB = {
  getCategories: () =>
    JSON.parse(localStorage.getItem("vet_categories") || "[]"),
  saveCategories: (data) =>
    localStorage.setItem("vet_categories", JSON.stringify(data)),
  getProducts: () => JSON.parse(localStorage.getItem("vet_products") || "[]"),
  saveProducts: (data) =>
    localStorage.setItem("vet_products", JSON.stringify(data)),
  getUsers: () => JSON.parse(localStorage.getItem("vet_users") || "[]"),
  saveUsers: (data) => localStorage.setItem("vet_users", JSON.stringify(data)),
  getPurchaseOrders: () =>
    JSON.parse(localStorage.getItem("vet_purchase_orders") || "[]"),
  savePurchaseOrders: (data) =>
    localStorage.setItem("vet_purchase_orders", JSON.stringify(data)),
  getOrders: () => JSON.parse(localStorage.getItem("vet_orders") || "[]"),
  saveOrders: (data) =>
    localStorage.setItem("vet_orders", JSON.stringify(data)),
};

function calcSellingPrice(importPrice, profitMargin) {
  return Math.round((importPrice * (1 + profitMargin / 100)) / 1000) * 1000;
}

function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
