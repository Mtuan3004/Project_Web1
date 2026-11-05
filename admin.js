// ===== ADMIN: Điều hướng và các sự kiện tương tác =====
// ===== PHẦN 4: Sự kiện gắn lên pageContent (chỉ 1 lần) =====

pageContent.addEventListener('input', function (event) {
  if (event.target.id === 'searchInput') {
    showOrders();
  }
  if (event.target.id === 'fQ') {
    showProducts();
  }
});

pageContent.addEventListener('change', function (event) {
  if (event.target.id === 'statusFilter') {
    showOrders();
  }
  if (event.target.id === 'fC' || event.target.id === 'fS') {
    showProducts();
  }
});

pageContent.addEventListener('click', function (event) {
  // nút thêm đơn hàng
  var actionButton = event.target.closest('[data-act]');
  var action = actionButton ? actionButton.dataset.act : '';
  var orderForm = document.getElementById('orderForm');
  if (event.target.id === 'showFormButton') {
    orderForm.classList.remove('hidden');
  }

  if (event.target.id === 'cancelButton') {
    orderForm.classList.add('hidden');
    orderForm.reset();
  }
  // nút thêm sản phẩm
  // Mở form
  if (action === 'prod-add') {
    document.getElementById('productModal').classList.remove('hidden');
  }

  // Đóng form
  if (action === 'prod-cancel') {
    var productForm = document.getElementById('productForm');

    productForm.reset();
    document.getElementById('productModal').classList.add('hidden');
  }

  // Ẩn / hiện sản phẩm
  if (action === 'prod-toggle') {
    var id = actionButton.dataset.id;

    var product = products.find(function (item) {
      return item.id === id;
    });

    if (product) {
      product.hidden = product.hidden === 1 ? 0 : 1;
      saveProducts();
      showProducts();
    }
  }

  // Xóa sản phẩm
  if (action === 'prod-del') {
    var id = actionButton.dataset.id;

    if (confirm('Bạn có chắc muốn xóa sản phẩm ' + id + '?')) {
      products = products.filter(function (item) {
        return item.id !== id;
      });

      saveProducts();
      showProducts();
      showMessage('Đã xóa sản phẩm.');
    }
  }
});

pageContent.addEventListener('submit', async function (event) {
  event.preventDefault();
  if (event.target.id === 'orderForm') {
    var newOrder = {
      id: '#PP' + (2482 + orders.length - 4),
      customer: document.getElementById('customerName').value,
      product: document.getElementById('productName').value,
      total: Number(document.getElementById('orderTotal').value),
      status: document.getElementById('orderStatus').value,
    };

    orders.unshift(newOrder);
    event.target.reset();
    event.target.classList.add('hidden');
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = 'Tất cả';
    showOrders();
    showMessage('Đã thêm đơn hàng mới.');
  } else if (event.target.id === 'productForm') {
    var comboValue = document.getElementById('prodCombo').value;
    var category = document.getElementById('prodCategory').value;

    var newProduct = {
      id: generateProductID(category),

      name: document.getElementById('prodName').value.trim(),
      brand: document.getElementById('prodBrand').value.trim(),
      category: category,
      pet: document.getElementById('prodPet').value,
      weight: document.getElementById('prodWeight').value.trim(),

      combo: comboValue === '' ? null : comboValue,

      image: document.getElementById('prodImage').value.trim(),

      // Chỉ lưu giá bán
      price: Number(document.getElementById('prodPrice').value),

      stock: Number(document.getElementById('prodStock').value),

      desc: document.getElementById('prodDesc').value.trim(),

      highlights: document
        .getElementById('prodHighlights')
        .value.split('\n')
        .map(function (item) {
          return item.trim();
        })
        .filter(function (item) {
          return item !== '';
        }),

      // Discount luôn luôn null
      discount: null,

      hidden: 0,
    };

    if (!newProduct.id || newProduct.price < 0 || newProduct.stock < 0) {
      showMessage('Thông tin sản phẩm không hợp lệ.');
      return;
    }

    // Thêm sản phẩm vào đầu danh sách
    products.unshift(newProduct);

    await saveProductsToFile();
    // Lưu vào localStorage
    saveProducts();

    // Tự động xuất file JSON
    exportProductsJSON();

    // Đóng và reset form
    event.target.reset();
    document.getElementById('productModal').classList.add('hidden');

    // Cập nhật bảng
    showProducts();

    showMessage('Đã thêm sản phẩm và xuất file JSON.');
  }
});

var menuItems = document.querySelectorAll('.menu-item');

for (var i = 0; i < menuItems.length; i++) {
  menuItems[i].addEventListener('click', function () {
    document.querySelector('.menu-item.active').classList.remove('active');
    this.classList.add('active');
    document.getElementById('pageTitle').innerText = this.dataset.title;
    document.getElementById('sidebar').classList.remove('open');

    loadPage(this.dataset.page);
  });
}

document.getElementById('mobileMenu').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('open');
});

document
  .getElementById('collapseButton')
  .addEventListener('click', function () {
    document.body.classList.toggle('sidebar-collapsed');
  });


// Trang mặc định

loadProductData().then(function () {
  loadPage('tongQuan');
});
