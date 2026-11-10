// ===== SERVICE: Dữ liệu và xử lý localStorage =====
// Trang khách hàng và trang đăng ký dùng chung khóa "users".

var STORAGE_KEYS = {
  orders: "orders",
  products: "products",
  users: "users",
  stocks: "stocks",
  sales: "sales",
};

var defaultOrders = [
  {
    id: "#PP2481",
    customer: "Minh Anh",
    product: "Royal Canin Mini Adult",
    total: 180000,
    status: "Chờ xử lý",
  },
];

var defaultProducts = [
  {
    id: "SPC001",
    name: "Royal Canin Mini Adult",
    brand: "Royal Canin",
    category: "L001",
    pet: "Chó",
    weight: "Túi 2kg",
    combo: null,
    type: "Thức ăn",
    image: "",
    cost: 150000,
    price: 180000,
    stock: 10,
    desc: "Hạt cho chó trưởng thành giống nhỏ",
    highlights: ["Hỗ trợ tiêu hóa", "Bảo vệ da lông"],
    discount: null,
    hidden: 0,
  },
];

var defaultUsers = [
  {
    id: "KH001",
    fullName: "Minh Anh",
    phone: "0901234567",
    email: "minhanh@example.com",
    address: "Quận 1, TP.HCM",
    username: "minhanh",
    password: "123456",
    locked: false,
  },
];

var defaultStocks = [
  {
    id: "SL001",
    productId: "SPC001",
    inStock: 30,
    date: "2026-10-05",
    note: "Nhập hàng đợt 1",
  },
  {
    id: "SL002",
    productId: "SPC001",
    inStock: -12,
    date: "2026-10-20",
    note: "Bán lẻ",
  },
  {
    id: "SL003",
    productId: "SPC001",
    inStock: -8,
    date: "2026-11-02",
    note: "",
  },
];

var defaultSales = [
  { category: "L001", rate: 20 },
  { category: "L002", rate: 20 },
  { category: "L003", rate: 25 },
  { category: "L004", rate: 30 },
];

var LOW_STOCK_LIMIT = 10;

var CATEGORY_NAMES = {
  L001: "Thức ăn cho chó",
  L002: "Thức ăn cho mèo",
  L003: "Đồ dùng",
  L004: "Phụ kiện",
};

function getCategoryName(category) {
  var key = String(category || "")
    .trim()
    .toUpperCase();

  return CATEGORY_NAMES[key] || "Khác";
}

function readStorage(key, fallbackValue) {
  var savedValue = localStorage.getItem(key);

  if (savedValue === null) {
    return fallbackValue;
  }

  try {
    var parsedValue = JSON.parse(savedValue);
    return Array.isArray(parsedValue) ? parsedValue : fallbackValue;
  } catch (error) {
    console.warn("Dữ liệu localStorage không hợp lệ tại khóa:", key);
    return fallbackValue;
  }
}

var orders = readStorage(STORAGE_KEYS.orders, defaultOrders);
var products = readStorage(STORAGE_KEYS.products, defaultProducts);
var stocks = readStorage(STORAGE_KEYS.stocks, defaultStocks);
var sales = readStorage(STORAGE_KEYS.sales, defaultSales);

var legacyUsers = readStorage("customers", defaultUsers);
var customers =
  localStorage.getItem(STORAGE_KEYS.users) !== null
    ? readStorage(STORAGE_KEYS.users, [])
    : legacyUsers;

function normalizeCustomers() {
  customers = customers.map(function (user, index) {
    var customerNumber = String(index + 1).padStart(3, "0");
    var locked =
      user.locked === true ||
      user.hidden === 1 ||
      user.status === "Đã khóa" ||
      user.status === "locked";

    return Object.assign({}, user, {
      id: user.id || user.customerId || "KH" + customerNumber,
      fullName:
        user.fullName || user.name || user.customerName || "Chưa cập nhật",
      phone: user.phone || user.phoneNumber || "",
      email: user.email || "",
      address: user.address || "",
      username: user.username || user.account || user.userName || "",
      locked: locked,
    });
  });
}

function normalizeOrders() {
  var legacyStatus = { "Mới đặt": "Chờ xử lý", "Đã xử lý": "Đang giao" };
  orders = orders.map(function (order, index) {
    var total = Number(order.total) || 0;
    var status = legacyStatus[order.status] || order.status;

    if (!status) {
      status = "Chờ xử lý";
    }

    var items =
      Array.isArray(order.items) && order.items.length
        ? order.items
        : [{ name: order.product || "—", qty: 1, price: total }];

    return Object.assign({}, order, {
      id: order.id || "#PP" + (2481 + index),
      customer: order.customer || "Chưa cập nhật",
      phone: order.phone || "",
      address: order.address || "",
      date: order.date || todayISO(),
      items: items,
      total: total,
      status: status,
    });
  });
}

function saveLocalStorageOrders() {
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

function saveLocalStorageProducts() {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
}

function saveLocalStorageCustomers() {
  // Ghi lại đúng khóa "users" để trang người dùng và admin luôn thống nhất.
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(customers));
}

function saveLocalStorageStockLogs() {
  localStorage.setItem(STORAGE_KEYS.stocks, JSON.stringify(stocks));
}

function saveLocalStorageSales() {
  localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
}

function loadProductData() {
  products = readStorage(STORAGE_KEYS.products, defaultProducts);
}

function addProduct(newProduct) {
  if (!newProduct || typeof newProduct !== "object") {
    return false;
  }

  var duplicated = products.some(function (item) {
    return item && item.id === newProduct.id;
  });

  if (duplicated) {
    newProduct.id = generateProductID(newProduct.category);
  }

  if (!newProduct.id) {
    return false;
  }

  products.unshift(newProduct);
  saveLocalStorageProducts();

  if (Number(newProduct.stock) > 0) {
    stocks.push({
      id: "SL" + Date.now() + "-" + stocks.length,
      productId: newProduct.id,
      inStock: Number(newProduct.stock),
      date: todayString(),
      note: "Nhập kho ban đầu",
    });
    saveLocalStorageStockLogs();
  }

  return true;
}

function generateProductID(category) {
  var prefix = {
    L001: "SPC",
    L002: "SPM",
    L003: "SPI",
    L004: "SPA",
  }[category];

  if (!prefix) {
    return null;
  }

  var maxID = 0;

  products.forEach(function (product) {
    var id = product && product.id ? String(product.id) : "";

    if (id.indexOf(prefix) === 0) {
      var number = parseInt(id.substring(prefix.length), 10);

      if (!isNaN(number) && number > maxID) {
        maxID = number;
      }
    }
  });

  return prefix + String(maxID + 1).padStart(3, "0");
}

function getStatusClass(status) {
  if (status === "Đã giao") {
    return "done";
  }

  if (status === "Đang giao") {
    return "shipping";
  }

  return "waiting";
}

function todayISO() {
  var now = new Date();
  var month = String(now.getMonth() + 1).padStart(2, "0");
  var day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

// "2026-11-05" -> "05/11/2026"
function formatDate(iso) {
  var parts = String(iso || "").split("-");
  return parts.length === 3 ? parts[2] + "/" + parts[1] + "/" + parts[0] : "—";
}

function formatMoney(number) {
  return Number(number || 0).toLocaleString("vi-VN") + "đ";
}

function showMessage(text) {
  var message = document.getElementById("message");

  if (!message) {
    return;
  }

  message.innerText = text;
  message.classList.add("show");

  setTimeout(function () {
    message.classList.remove("show");
  }, 2000);
}

// Ngày hôm nay theo giờ máy, dạng "YYYY-MM-DD" (so sánh chuỗi được vì cùng định dạng)
function todayString() {
  var d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

function getProductLogs(productId) {
  return stocks.filter(function (log) {
    return log && log.productId === productId;
  });
}

// Tồn cuối ngày dateStr = tồn hiện tại, lùi lại các phiếu có ngày SAU dateStr
function getStockAt(product, dateStr) {
  var stock = Number(product.stock) || 0;

  getProductLogs(product.id).forEach(function (log) {
    if (log.date > dateStr) {
      stock -= Number(log.inStock) || 0;
    }
  });

  return stock;
}
// Lấy mảng products <= LOW_STOCK_LIMIT
function getLowStockProducts() {
  return products.filter(function (product) {
    return (Number(product.stock) || 0) <= LOW_STOCK_LIMIT;
  });
}
// Báo cáo nhập - xuất - tồn của 1 sản phẩm từ ngày fromDate đến hết ngày toDate
function getStockReport(product, fromDate, toDate) {
  var report = { opening: 0, totalIn: 0, totalOut: 0, closing: 0, logs: [] };
  var opening = Number(product.stock) || 0;

  getProductLogs(product.id).forEach(function (log) {
    var amount = Number(log.inStock) || 0;

    if (log.date >= fromDate) {
      opening -= amount; // lùi về tồn đầu kỳ
    }

    if (log.date >= fromDate && log.date <= toDate) {
      if (amount > 0) {
        report.totalIn += amount;
      } else {
        report.totalOut += -amount;
      }
      report.logs.push(log);
    }
  });

  report.logs.sort(function (a, b) {
    return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
  });
  report.opening = opening;
  report.closing = getStockAt(product, toDate);
  return report;
}

// Tình trạng tồn kho: hết hàng / sắp hết / còn hàng
function getStockStatus(stock, limit) {
  if (stock <= 0) {
    return { text: "Hết hàng", cls: "pp-badge--locked" };
  }
  if (stock <= limit) {
    return { text: "Sắp hết", cls: "pp-badge--sale" };
  }
  return { text: "Còn hàng", cls: "pp-badge--done" };
}

// Xóa lịch sử kho của sản phẩm đã bị xóa (tránh dính sang sản phẩm mới trùng mã)
function removeStockLogsOfProduct(productId) {
  stocks = stocks.filter(function (log) {
    return log && log.productId !== productId;
  });
  saveLocalStorageStockLogs();
}

// % lợi nhuận của 1 loại sản phẩm (lấy từ sales)
function getRate(category) {
  var item = sales.find(function (row) {
    return row.category === category;
  });

  return item ? Number(item.rate) : 0;
}

// Giá bán = giá vốn x (1 + % lợi nhuận / 100)
function calcPrice(product) {
  return Math.round(product.cost * (1 + getRate(product.category) / 100));
}

// Lưu % lợi nhuận của 1 loại rồi tính lại giá bán các sản phẩm trong loại
function setRate(category, value) {
  var rate = Number(value);

  if (value === "" || isNaN(rate) || rate < 0 || rate > 500) {
    return false;
  }

  var item = sales.find(function (row) {
    return row.category === category;
  });

  if (item) {
    item.rate = rate;
  } else {
    sales.push({ category: category, rate: rate });
  }

  products.forEach(function (p) {
    if (p.category === category && p.cost > 0) {
      p.price = calcPrice(p);
    }
  });

  saveLocalStorageSales();
  saveLocalStorageProducts();
  return true;
}

function setDiscount(productId, value) {
  var product = products.find(function (item) {
    return item.id === productId;
  });

  if (!product) {
    return false;
  }

  if (String(value).trim() === "") {
    product.discount = null;
  } else {
    var discount = Number(value);

    if (isNaN(discount) || discount < 0 || discount > 100) {
      return false;
    }

    product.discount = discount;
  }

  saveLocalStorageProducts();
  return true;
}

normalizeCustomers();
saveLocalStorageOrders();
saveLocalStorageProducts();
saveLocalStorageCustomers();
saveLocalStorageStockLogs();
