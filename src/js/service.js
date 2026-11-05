// ===== SERVICE: Dữ liệu và xử lý nghiệp vụ =====

// Khởi tạo hoặc lấy dữ liệu Đơn hàng từ localStorage
var orders = JSON.parse(localStorage.getItem('petpetOrders')) || [
  {
    id: '#PP2481',
    customer: 'Minh Anh',
    product: 'Royal Canin Mini Adult',
    total: 845000,
    status: 'Đã giao',
  },
  {
    id: '#PP2480',
    customer: 'Tuấn Khang',
    product: 'Cát vệ sinh Cature',
    total: 325000,
    status: 'Đang giao',
  },
  {
    id: '#PP2479',
    customer: 'Phương Nhi',
    product: 'Balo vận chuyển',
    total: 590000,
    status: 'Chờ xử lý',
  },
  {
    id: '#PP2478',
    customer: 'Hoàng Nam',
    product: 'Pate mèo Catchy',
    total: 275000,
    status: 'Đã giao',
  },
];

var products = [];

// Hàm lưu danh sách sản phẩm xuống localStorage
function saveLocalStorageProducts() {
  localStorage.setItem('petpetProducts', JSON.stringify(products));
}

// Kiểm tra và load dữ liệu sản phẩm CHỈ TỪ localStorage (Có dữ liệu mẫu mặc định nếu trống)
function loadProductData() {
  var localProducts = localStorage.getItem('petpetProducts');
  
  if (localProducts) {
    try {
      products = JSON.parse(localProducts);
    } catch (e) {
      products = [];
    }
  } else {
    // Nếu localStorage chưa có gì, khởi tạo luôn mảng sản phẩm mẫu mặc định ở đây
    products = [
      {
        id: "SPC001",
        name: "Royal Canin Mini Adult",
        brand: "Royal Canin",
        category: "L001",
        pet: "Chó",
        weight: "Túi 2kg",
        combo: null,
        image: "./src/img/img-products/DPF00238__main__20260927_230749_n5ptjh_400x400.webp",
        price: 180000,
        stock: 10,
        desc: "Hạt cho chó trưởng thành giống nhỏ",
        highlights: ["Hỗ trợ tiêu hóa", "Bảo vệ da lông"],
        discount: null,
        hidden: 0
      }
    ];
    // Lưu ngay vào localStorage
    saveLocalStorageProducts();
  }
}

// Gọi hàm load dữ liệu khi khởi động
loadProductData();

// Chèn thêm 1 phần tử vào mảng products và cập nhật localStorage
function addProduct(newProduct) {
  if (!newProduct || typeof newProduct !== 'object') {
    return false;
  }

  if (!Array.isArray(products)) {
    products = [];
  }

  var duplicated = products.some(function (item) {
    return item && item.id === newProduct.id;
  });

  if (duplicated) {
    var newId = generateProductID(newProduct.category);
    if (!newId) {
      return false;
    }
    newProduct.id = newId;
  }

  products.unshift(newProduct);
  saveLocalStorageProducts(); // Cập nhật ngay vào localStorage
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
  return number.toLocaleString('vi-VN') + 'đ';
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