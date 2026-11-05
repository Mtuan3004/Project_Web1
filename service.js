// ===== SERVICE: Dữ liệu và xử lý nghiệp vụ =====
var orders = [
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

var products = [
  {
    id: 'SPC001',
    name: 'Royal Canin Mini Adult',
    brand: 'Royal Canin',
    category: 'L001',
    pet: 'Chó',
    weight: 'Túi 2kg',
    combo: null,
    desc: 'Hạt cho chó trưởng thành giống nhỏ, túi 2kg',
    image: '', // Chưa có đường dẫn ảnh thì hiển thị chữ RC
    price: 180000,
    stock: 4,
    discount: null,
    hidden: 0,
  },
];

// Số thứ tự hiện tại của từng loại

async function loadProductData() {
  var savedProducts = localStorage.getItem('petpetProducts');

  // Ưu tiên dữ liệu đã được thêm trong trình duyệt
  if (savedProducts) {
    products = JSON.parse(savedProducts);
    return;
  }

  // Nếu chưa có dữ liệu localStorage thì đọc từ JSON
  try {
    var response = await fetch('./src/data/products.json');

    if (!response.ok) {
      throw new Error('Không thể đọc products.json');
    }

    products = await response.json();
  } catch (error) {
    console.error(error);
    products = [
      {
        id: 'SPC001',
        name: 'Royal Canin Mini Adult',
        brand: 'Royal Canin',
        category: 'L001',
        pet: 'Chó',
        weight: 'Túi 2kg',
        combo: null,
        desc: 'Hạt cho chó trưởng thành giống nhỏ, túi 2kg',
        image: '', // Chưa có đường dẫn ảnh thì hiển thị chữ RC
        price: 180000,
        stock: 4,
        discount: null,
        hidden: 0,
      },
    ];
  }
}

function saveProducts() {
  localStorage.setItem('petpetProducts', JSON.stringify(products));
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
    if (product.id.startsWith(prefix)) {
      var number = Number(product.id.substring(3));

      if (number > maxID) {
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
  message.innerText = text;
  message.classList.add('show');

  setTimeout(function () {
    message.classList.remove('show');
  }, 2000);
}


function exportProductsJSON() {
  var json = JSON.stringify(products, null, 2);

  var blob = new Blob([json], {
    type: 'application/json',
  });

  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');

  link.href = url;
  link.download = 'product.json';

  link.click();

  URL.revokeObjectURL(url);
}
async function saveProductsToFile() {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: 'product.json',
      types: [
        {
          description: 'JSON file',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    });

    const writable = await handle.createWritable();

    await writable.write(JSON.stringify(products, null, 2));

    await writable.close();

    showMessage('Đã cập nhật product.json!');
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error(error);
      showMessage('Không thể lưu file!');
    }
  }
}
