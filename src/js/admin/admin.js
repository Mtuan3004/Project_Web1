// ===== ADMIN: Điều hướng và các sự kiện tương tác =====
// ===== PHẦN 4: Sự kiện gắn lên pageContent (chỉ 1 lần) =====

// ===== ADMIN: Điều hướng và các sự kiện tương tác =====

var editingProductId = null;

pageContent.addEventListener("input", function (event) {
  if (event.target.id === "searchInput") {
    showOrders();
  }
  if (event.target.id === "invReportProduct") {
    showInventory();
  }
  if (event.target.id === "priceSearch") {
    showPriceLookup();
  }
  if (event.target.id === "priceCatSearch") {
    showPriceCategories();
  }
  if (event.target.id === "fQ") {
    if (document.getElementById("customerTable")) {
      showCustomers();
    } else {
      showProducts();
    }
  }
});

pageContent.addEventListener("change", function (event) {
  // Cập nhật trạng thái đơn hàng ngay khi chọn trạng thái mới.
  if (event.target.classList.contains("order-status-select")) {
    var orderId = event.target.dataset.orderId;
    var selectedOrder = orders.find(function (item) {
      return item.id === orderId;
    });

    if (selectedOrder) {
      selectedOrder.status = event.target.value;
      saveLocalStorageOrders();
      showOrders();
      showMessage("Đã cập nhật trạng thái đơn hàng.");
    }
  }

  if (event.target.id === "statusFilter") {
    showOrders();
  }
  if (
    event.target.id === "invCategory" ||
    event.target.id === "invDate" ||
    event.target.id === "invFrom" ||
    event.target.id === "invTo"
  ) {
    showInventory();
  }
  if (event.target.id === "priceCategory") {
    showPriceCategories();
  }
  if (event.target.id === "fC" || event.target.id === "fS") {
    if (document.getElementById("customerTable")) {
      showCustomers();
    } else {
      showProducts();
    }
  }
});

pageContent.addEventListener("click", function (event) {
  var actionButton = event.target.closest("[data-act]");
  var action = actionButton ? actionButton.dataset.act : "";
  var orderForm = document.getElementById("orderForm");

  if (event.target.id === "showFormButton" && orderForm) {
    orderForm.classList.remove("hidden");
  }

  if (event.target.id === "cancelButton" && orderForm) {
    orderForm.classList.add("hidden");
    orderForm.reset();
  }

  // Nút khôi phục dữ liệu mẫu ở trang Cài đặt
  if (action === "reset") {
    if (
      confirm(
        "Bạn có chắc chắn muốn khôi phục lại dữ liệu ban đầu? Mọi thay đổi sẽ bị xóa.",
      )
    ) {
      localStorage.removeItem("products");
      localStorage.removeItem("orders");
      localStorage.removeItem("stocks");
      localStorage.removeItem("users");
      localStorage.removeItem("customers");
      localStorage.removeItem("sales");
      location.reload();
    }
  }

  if (action === "price-save-cat") {
    var catInput = actionButton.closest("tr").querySelector("input");
    if (setRate(actionButton.dataset.id, catInput.value)) {
      showMessage("Đã lưu % lợi nhuận và cập nhật giá bán.");
      showPrices();
    } else {
      showMessage("% lợi nhuận phải là số từ 0 đến 500.");
    }
  }
  // Mở form thêm sản phẩm
  if (action === "prod-add") {
    editingProductId = null;
    var addForm = document.getElementById("productForm");
    addForm.reset();
    document.getElementById("productFormTitle").innerText = "Thêm sản phẩm mới";
    document.querySelector('#productForm button[type="submit"]').innerText = "Lưu sản phẩm";
    document.getElementById("productModal").classList.remove("hidden");
  }

  // Mở form sửa và điền dữ liệu sản phẩm hiện tại
  if (action === "prod-edit") {
    var editId = actionButton.dataset.id;
    var editProduct = products.find(function (item) {
      return item.id === editId;
    });

    if (editProduct) {
      editingProductId = editId;
      document.getElementById("prodName").value = editProduct.name || "";
      document.getElementById("prodBrand").value = editProduct.brand || "";
      document.getElementById("prodCategory").value = editProduct.category || "";
      document.getElementById("prodPet").value = editProduct.pet || "";
      document.getElementById("prodWeight").value = editProduct.weight || "";
      document.getElementById("prodCombo").value = editProduct.combo || "";
      document.getElementById("prodImage").value = editProduct.image || "";
      document.getElementById("prodPrice").value = editProduct.price || 0;
      document.getElementById("prodStock").value = editProduct.stock || 0;
      document.getElementById("prodDesc").value = editProduct.desc || editProduct.description || "";
      document.getElementById("prodHighlights").value = (editProduct.highlights || []).join("\n");
      document.getElementById("productFormTitle").innerText = "Sửa thông tin sản phẩm";
      document.querySelector('#productForm button[type="submit"]').innerText = "Lưu thay đổi";
      document.getElementById("productModal").classList.remove("hidden");
    }
  }

  // Đóng form sản phẩm
  if (action === "prod-cancel") {
    var productForm = document.getElementById("productForm");
    productForm.reset();
    editingProductId = null;
    document.getElementById("productModal").classList.add("hidden");
  }

  // Ẩn / hiện sản phẩm
  if (action === "prod-toggle") {
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
  if (action === "prod-del") {
    var delId = actionButton.dataset.id;

    if (confirm("Bạn có chắc muốn xóa sản phẩm " + delId + "?")) {
      var delIndex = products.findIndex(function (item) {
        return item.id === delId;
      });

      if (delIndex !== -1) {
        products.splice(delIndex, 1);
        saveLocalStorageProducts(); // Cập nhật lại localStorage sau khi xóa
        removeStockLogsOfProduct(delId);
      }

      showProducts();
      showMessage("Đã xóa sản phẩm.");
    }
  }

  // Khóa hoặc mở khóa khách hàng và cập nhật cùng khóa "users".
  if (action === "cus-lock") {
    var lockId = actionButton.dataset.id;
    var lockCustomer = customers.find(function (item) {
      return item.id === lockId;
    });

    if (lockCustomer) {
      lockCustomer.locked = !lockCustomer.locked;
      saveLocalStorageCustomers();
      showCustomers();
      showMessage(
        lockCustomer.locked ? "Đã khóa khách hàng." : "Đã mở khóa khách hàng.",
      );
    }
  }

  // Đặt lại mật khẩu ngay trên dữ liệu user trong localStorage.
  if (action === "cus-reset") {
    var resetId = actionButton.dataset.id;
    var resetCustomer = customers.find(function (item) {
      return item.id === resetId;
    });

    if (
      resetCustomer &&
      confirm(
        "Đặt lại mật khẩu của " + resetCustomer.fullName + " thành 123456?",
      )
    ) {
      resetCustomer.password = "123456";
      saveLocalStorageCustomers();
      showMessage("Đã đặt lại mật khẩu thành 123456.");
    }
  }

  // Xóa khỏi mảng rồi lưu lại localStorage nên trang user cũng mất tài khoản này.
  if (action === "cus-del") {
    var customerId = actionButton.dataset.id;
    var customerIndex = customers.findIndex(function (item) {
      return item.id === customerId;
    });

    if (
      customerIndex !== -1 &&
      confirm(
        "Bạn có chắc muốn xóa khách hàng " +
          customers[customerIndex].fullName +
          "?",
      )
    ) {
      customers.splice(customerIndex, 1);
      saveLocalStorageCustomers();
      showCustomers();
      showMessage("Đã xóa khách hàng khỏi localStorage.");
    }
  }
});

pageContent.addEventListener("submit", function (event) {
  event.preventDefault();

  var form = event.target;

  if (form.id === "orderForm") {
    var newOrder = {
      id: "#PP" + (2482 + orders.length - 4),
      customer: document.getElementById("customerName").value,
      product: document.getElementById("productName").value,
      total: Number(document.getElementById("orderTotal").value),
      status: document.getElementById("orderStatus").value,
    };

    orders.unshift(newOrder);
    saveLocalStorageOrders(); // Lưu đơn hàng mới vào localStorage
    updateOrderCount();
    form.reset();
    form.classList.add("hidden");
    document.getElementById("searchInput").value = "";
    document.getElementById("statusFilter").value = "Tất cả";
    showOrders();
    showMessage("Đã thêm đơn hàng mới.");
  } else if (form.id === "productForm") {
    var comboValue = document.getElementById("prodCombo").value;
    var category = document.getElementById("prodCategory").value;
    var productData = {
      name: document.getElementById("prodName").value.trim(),
      brand: document.getElementById("prodBrand").value.trim(),
      category: category,
      pet: document.getElementById("prodPet").value,
      weight: document.getElementById("prodWeight").value.trim(),
      combo: comboValue === "" ? null : comboValue,
      image: document.getElementById("prodImage").value.trim(),
      price: Number(document.getElementById("prodPrice").value),
      stock: Number(document.getElementById("prodStock").value),
      desc: document.getElementById("prodDesc").value.trim(),
      highlights: document.getElementById("prodHighlights").value
        .split("\n")
        .map(function (item) { return item.trim(); })
        .filter(function (item) { return item !== ""; }),
    };

    if (!category || productData.price < 0 || productData.stock < 0) {
      showMessage("Thông tin sản phẩm không hợp lệ.");
      return;
    }

    if (editingProductId) {
      var productToEdit = products.find(function (item) {
        return item.id === editingProductId;
      });

      if (!productToEdit) {
        showMessage("Không tìm thấy sản phẩm cần sửa.");
        return;
      }

      // Giữ nguyên mã sản phẩm, trạng thái ẩn/hiện và các thông tin khác.
      var oldStock = Number(productToEdit.stock) || 0;
      Object.assign(productToEdit, productData);
      productToEdit.cost = Math.round(
        productData.price / (1 + getRate(category) / 100)
      );
      saveLocalStorageProducts();

      // Ghi nhận chênh lệch tồn kho để báo cáo nhập - xuất vẫn đúng.
      var stockDifference = productData.stock - oldStock;
      if (stockDifference !== 0) {
        stocks.push({
          id: "SL" + Date.now() + "-" + stocks.length,
          productId: productToEdit.id,
          inStock: stockDifference,
          date: todayString(),
          note: "Điều chỉnh tồn kho khi sửa sản phẩm",
        });
        saveLocalStorageStockLogs();
      }

      showMessage("Đã cập nhật thông tin sản phẩm.");
    } else {
      var newProduct = Object.assign({
        id: generateProductID(category),
        discount: null,
        hidden: 0,
      }, productData);

      if (!newProduct.id || !addProduct(newProduct)) {
        showMessage("Không thêm được sản phẩm.");
        return;
      }
      showMessage("Đã thêm sản phẩm mới.");
    }

    editingProductId = null;
    form.reset();
    document.getElementById("productModal").classList.add("hidden");
    showProducts();
  }
});

// ===== Menu: đổi trang =====
var menuItems = document.querySelectorAll(".menu-item");

for (var i = 0; i < menuItems.length; i++) {
  menuItems[i].addEventListener("click", function () {
    var activeItem = document.querySelector(".menu-item.active");

    if (activeItem) {
      activeItem.classList.remove("active");
    }

    this.classList.add("active");
    setPageTitle(this.dataset.title);
    closeSidebar();

    loadPage(this.dataset.page);
  });
}

document.getElementById("mobileMenu").addEventListener("click", function () {
  document.getElementById("sidebar").classList.toggle("open");
});

document
  .getElementById("collapseButton")
  .addEventListener("click", function () {
    document.body.classList.toggle("sidebar-collapsed");
  });

function setPageTitle(title) {
  var pageTitle = document.getElementById("pageTitle");

  if (pageTitle && title) {
    pageTitle.innerText = title;
  }
}

function closeSidebar() {
  var sidebar = document.getElementById("sidebar");

  if (sidebar) {
    sidebar.classList.remove("open");
  }
}

function updateOrderCount() {
  var orderCount = document.querySelector(".menu-count");

  if (orderCount) {
    orderCount.innerText = orders.length;
  }
}

function openHomePage() {
  var items = document.querySelectorAll(".menu-item");
  var homeItem = null;

  for (var j = 0; j < items.length; j++) {
    items[j].classList.remove("active");

    if (items[j].dataset.page === "tongQuan") {
      homeItem = items[j];
    }
  }

  if (homeItem) {
    homeItem.classList.add("active");
    setPageTitle(homeItem.dataset.title);
  }

  closeSidebar();
  loadPage("tongQuan");
  window.scrollTo(0, 0);
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

loadProductData();
updateOrderCount();
openHomePage();
