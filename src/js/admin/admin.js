// ===== ADMIN: Điều hướng và các sự kiện tương tác =====
// ===== PHẦN 4: Sự kiện gắn lên pageContent (chỉ 1 lần) =====

// ===== ADMIN: Điều hướng và các sự kiện tương tác =====

pageContent.addEventListener('input', function (event) {
  if (event.target.id === 'searchInput') {
    showOrders();
  }
  if (event.target.id === 'fQ') {
    if (document.getElementById('customerTable')) {
      showCustomers();
    } else {
      showProducts();
    }
  }
});

pageContent.addEventListener('change', function (event) {
  if (event.target.id === 'statusFilter') {
    showOrders();
  }
  if (event.target.id === 'fC' || event.target.id === 'fS') {
    if (document.getElementById('customerTable')) {
      showCustomers();
    } else {
      showProducts();
    }
  }
});

pageContent.addEventListener('click', function (event) {
  var actionButton = event.target.closest('[data-act]');
  var action = actionButton ? actionButton.dataset.act : '';
  var orderForm = document.getElementById('orderForm');

  if (event.target.id === 'showFormButton' && orderForm) {
    orderForm.classList.remove('hidden');
  }

  if (event.target.id === 'cancelButton' && orderForm) {
    orderForm.classList.add('hidden');
    orderForm.reset();
  }

  // Nút khôi phục dữ liệu mẫu ở trang Cài đặt
  if (action === 'reset') {
    if (confirm('Bạn có chắc chắn muốn khôi phục lại dữ liệu ban đầu? Mọi thay đổi sẽ bị xóa.')) {
      localStorage.removeItem('petpetProducts');
      localStorage.removeItem('petpetOrders');
      localStorage.removeItem('users');
      localStorage.removeItem('petpetCustomers');
      location.reload();
    }
  }

  // Mở form thêm sản phẩm
  if (action === 'prod-add') {
    document.getElementById('productModal').classList.remove('hidden');
  }

  // Đóng form thêm sản phẩm
  if (action === 'prod-cancel') {
    var productForm = document.getElementById('productForm');
    productForm.reset();
    document.getElementById('productModal').classList.add('hidden');
  }

  // Ẩn / hiện sản phẩm
  if (action === 'prod-toggle') {
    var toggleId = actionButton.dataset.id;

    var product = products.find(function (item) {
      return item.id === toggleId;
    });

    if (product) {
      product.hidden = product.hidden === 1 ? 0 : 1;
      saveLocalStorageProducts(); // Lưu trạng thái ẩn/hiện xuống localStorage
      showProducts();
    }
  }

  // Xóa sản phẩm
  if (action === 'prod-del') {
    var delId = actionButton.dataset.id;

    if (confirm('Bạn có chắc muốn xóa sản phẩm ' + delId + '?')) {
      var delIndex = products.findIndex(function (item) {
        return item.id === delId;
      });

      if (delIndex !== -1) {
        products.splice(delIndex, 1);
        saveLocalStorageProducts(); // Cập nhật lại localStorage sau khi xóa
      }

      showProducts();
      showMessage('Đã xóa sản phẩm.');
    }
  }

  // Khóa hoặc mở khóa khách hàng và cập nhật cùng khóa "users".
  if (action === 'cus-lock') {
    var lockId = actionButton.dataset.id;
    var lockCustomer = customers.find(function (item) {
      return item.id === lockId;
    });

    if (lockCustomer) {
      lockCustomer.locked = !lockCustomer.locked;
      saveLocalStorageCustomers();
      showCustomers();
      showMessage(lockCustomer.locked ? 'Đã khóa khách hàng.' : 'Đã mở khóa khách hàng.');
    }
  }

  // Đặt lại mật khẩu ngay trên dữ liệu user trong localStorage.
  if (action === 'cus-reset') {
    var resetId = actionButton.dataset.id;
    var resetCustomer = customers.find(function (item) {
      return item.id === resetId;
    });

    if (
      resetCustomer &&
      confirm('Đặt lại mật khẩu của ' + resetCustomer.fullName + ' thành 123456?')
    ) {
      resetCustomer.password = '123456';
      saveLocalStorageCustomers();
      showMessage('Đã đặt lại mật khẩu thành 123456.');
    }
  }

  // Xóa khỏi mảng rồi lưu lại localStorage nên trang user cũng mất tài khoản này.
  if (action === 'cus-del') {
    var customerId = actionButton.dataset.id;
    var customerIndex = customers.findIndex(function (item) {
      return item.id === customerId;
    });

    if (
      customerIndex !== -1 &&
      confirm('Bạn có chắc muốn xóa khách hàng ' + customers[customerIndex].fullName + '?')
    ) {
      customers.splice(customerIndex, 1);
      saveLocalStorageCustomers();
      showCustomers();
      showMessage('Đã xóa khách hàng khỏi localStorage.');
    }
  }
});

pageContent.addEventListener('submit', function (event) {
  event.preventDefault();

  var form = event.target;

  if (form.id === 'orderForm') {
    var newOrder = {
      id: '#PP' + (2482 + orders.length - 4),
      customer: document.getElementById('customerName').value,
      product: document.getElementById('productName').value,
      total: Number(document.getElementById('orderTotal').value),
      status: document.getElementById('orderStatus').value,
    };

    orders.unshift(newOrder);
    saveLocalStorageOrders(); // Lưu đơn hàng mới vào localStorage
    updateOrderCount();
    form.reset();
    form.classList.add('hidden');
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = 'Tất cả';
    showOrders();
    showMessage('Đã thêm đơn hàng mới.');
  } else if (form.id === 'productForm') {
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
      discount: null,
      hidden: 0,
    };

    if (!newProduct.id || newProduct.price < 0 || newProduct.stock < 0) {
      showMessage('Thông tin sản phẩm không hợp lệ.');
      return;
    }

    if (!addProduct(newProduct)) {
      showMessage('Không thêm được sản phẩm.');
      return;
    }

    form.reset();
    document.getElementById('productModal').classList.add('hidden');
    showProducts();

    showMessage('Đã thêm sản phẩm vào mảng.');
  }
});

// ===== Menu: đổi trang =====
var menuItems = document.querySelectorAll('.menu-item');

for (var i = 0; i < menuItems.length; i++) {
  menuItems[i].addEventListener('click', function () {
    var activeItem = document.querySelector('.menu-item.active');

    if (activeItem) {
      activeItem.classList.remove('active');
    }

    this.classList.add('active');
    setPageTitle(this.dataset.title);
    closeSidebar();

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

function setPageTitle(title) {
  var pageTitle = document.getElementById('pageTitle');

  if (pageTitle && title) {
    pageTitle.innerText = title;
  }
}

function closeSidebar() {
  var sidebar = document.getElementById('sidebar');

  if (sidebar) {
    sidebar.classList.remove('open');
  }
}

function updateOrderCount() {
  var orderCount = document.querySelector('.menu-count');

  if (orderCount) {
    orderCount.innerText = orders.length;
  }
}

function openHomePage() {
  var items = document.querySelectorAll('.menu-item');
  var homeItem = null;

  for (var j = 0; j < items.length; j++) {
    items[j].classList.remove('active');

    if (items[j].dataset.page === 'tongQuan') {
      homeItem = items[j];
    }
  }

  if (homeItem) {
    homeItem.classList.add('active');
    setPageTitle(homeItem.dataset.title);
  }

  closeSidebar();
  loadPage('tongQuan');
  window.scrollTo(0, 0);
}

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

loadProductData();
updateOrderCount();
openHomePage();
