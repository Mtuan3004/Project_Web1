// ===== SERVICE: Dữ liệu và xử lý localStorage =====
// Trang khách hàng và trang đăng ký dùng chung khóa "users".

var STORAGE_KEYS = {
  orders: 'petpetOrders',
  products: 'petpetProducts',
  users: 'users',
};

var defaultProducts = [
  {
    id: 'SPC001',
    name: 'Royal Canin Mini Adult',
    brand: 'Royal Canin',
    category: 'L001',
    pet: 'Chó',
    weight: 'Túi 2kg',
    combo: null,
    image: '',
    price: 180000,
    stock: 10,
    desc: 'Hạt cho chó trưởng thành giống nhỏ',
    highlights: ['Hỗ trợ tiêu hóa', 'Bảo vệ da lông'],
    discount: null,
    hidden: 0,
  },
];

var defaultUsers = [
  {
    id: 'KH001',
    fullName: 'Minh Anh',
    phone: '0901234567',
    email: 'minhanh@example.com',
    address: 'Quận 1, TP.HCM',
    username: 'minhanh',
    password: '123456',
    locked: false,
  },
];

function readStorage(key, fallbackValue) {
  var savedValue = localStorage.getItem(key);

  if (savedValue === null) {
    return fallbackValue;
  }

  try {
    var parsedValue = JSON.parse(savedValue);
    return Array.isArray(parsedValue) ? parsedValue : fallbackValue;
  } catch (error) {
    console.warn('Dữ liệu localStorage không hợp lệ tại khóa:', key);
    return fallbackValue;
  }
}

var orders = readStorage(STORAGE_KEYS.orders, defaultOrders);
var products = readStorage(STORAGE_KEYS.products, defaultProducts);

// Hỗ trợ dữ liệu cũ nếu trước đây khách hàng được lưu ở petpetCustomers.
var legacyUsers = readStorage('petpetCustomers', defaultUsers);
var customers =
  localStorage.getItem(STORAGE_KEYS.users) !== null
    ? readStorage(STORAGE_KEYS.users, [])
    : legacyUsers;

function normalizeCustomers() {
  customers = customers.map(function (user, index) {
    var customerNumber = String(index + 1).padStart(3, '0');
    var locked =
      user.locked === true ||
      user.hidden === 1 ||
      user.status === 'Đã khóa' ||
      user.status === 'locked';

    return Object.assign({}, user, {
      id: user.id || user.customerId || 'KH' + customerNumber,
      fullName:
        user.fullName || user.name || user.customerName || 'Chưa cập nhật',
      phone: user.phone || user.phoneNumber || '',
      email: user.email || '',
      address: user.address || '',
      username: user.username || user.account || user.userName || '',
      locked: locked,
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

function loadProductData() {
  products = readStorage(STORAGE_KEYS.products, defaultProducts);
}

function addProduct(newProduct) {
  if (!newProduct || typeof newProduct !== 'object') {
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
  return true;
}

function generateProductID(category) {
  var prefix = {
    L001: 'SPC',
    L002: 'SPM',
    L003: 'SPI',
    L004: 'SPA',
  }[category];

  if (!prefix) {
    return null;
  }

  var maxID = 0;

  products.forEach(function (product) {
    var id = product && product.id ? String(product.id) : '';

    if (id.indexOf(prefix) === 0) {
      var number = parseInt(id.substring(prefix.length), 10);

      if (!isNaN(number) && number > maxID) {
        maxID = number;
      }
    }
  });

  return prefix + String(maxID + 1).padStart(3, '0');
}

function getStatusClass(status) {
  if (status === 'Đã giao') {
    return 'done';
  }

  if (status === 'Đang giao') {
    return 'shipping';
  }

  return 'waiting';
}

function formatMoney(number) {
  return Number(number || 0).toLocaleString('vi-VN') + 'đ';
}

function escapeHTML(value) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showMessage(text) {
  var message = document.getElementById('message');

  if (!message) {
    return;
  }

  message.innerText = text;
  message.classList.add('show');

  setTimeout(function () {
    message.classList.remove('show');
  }, 2000);
}

normalizeCustomers();
saveLocalStorageOrders();
saveLocalStorageProducts();
saveLocalStorageCustomers();