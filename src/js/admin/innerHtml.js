// ===== INNER HTML: Nội dung trang và hàm render giao diện =====
// ===== PHẦN 1: Nội dung mỗi trang (chuỗi HTML) =====
var pages = {
  tongQuan: `
    <section class="stat-list">
      <article class="stat-card">
        <div class="stat-icon yellow"><i class="ri-shopping-basket-2-line"></i></div>
        <div><p>Đơn hàng hiện có</p><h2 id="dashboardOrderCount">0</h2></div>
        <p class="stat-desc"><span class="trend-up">↑ 12%</span> so với hôm qua</p>
      </article>
      <article class="stat-card">
        <div class="stat-icon purple"><i class="ri-shopping-cart-line"></i></div>
        <div><p>Tổng sản phẩm</p><h2 id="dashboardProductCount">0</h2></div>
        <p class="stat-desc"><span class="trend-up">↑ 12%</span> so với hôm qua</p>
      </article>
      <article class="stat-card">
        <div class="stat-icon blue"><i class="ri-user-line"></i></div>
        <div><p>Khách hàng</p><h2 id="dashboardCustomerCount">0</h2></div>
        <p class="stat-desc"><span class="trend-up">↑ 12%</span> so với hôm qua</p>
      </article>
      <article class="stat-card">
        <div class="stat-icon red"><i class="ri-coupon-line"></i></div>
        <div><p>Sắp hết hàng</p><h2 id="dashboardStockCount">0</h2></div>
        <p class="stat-desc"><span class="trend-up">↑ 12%</span> so với hôm qua</p>
      </article>
    </section>

    <section class="two-columns">
      <article class="box">
        <div class="box-title">
          <div>
            <h2>Sản phẩm bán chạy</h2>
            <p>Các sản phẩm được mua nhiều trong tháng</p>
          </div>
          <span class="note">Ghi chú</span>
        </div>
        <div class="product-list">
          <div class="product">
            <span class="product-image yellow">RC</span>
            <div><strong>Royal Canin Mini Adult</strong><p>Thức ăn cho chó</p></div>
            <b>Đã bán: 56</b>
          </div>
          <div class="product">
            <span class="product-image purple">CT</span>
            <div><strong>Cát vệ sinh Cature</strong><p>Đồ dùng cho mèo</p></div>
            <b>Đã bán: 43</b>
          </div>
          <div class="product">
            <span class="product-image blue">PM</span>
            <div><strong>Pate mèo Catchy</strong><p>Thức ăn cho mèo</p></div>
            <b>Đã bán: 38</b>
          </div>
        </div>
      </article>

      <article class="box">
        <div class="box-title">
          <div>
            <h2>Cảnh báo tồn kho</h2>
            <p>Sản phẩm cần nhập thêm</p>
          </div>
        </div>
        <div class="stock-list">
          <div><span>Royal Canin Mini Adult</span><b>Còn 4</b></div>
          <div><span>Cát vệ sinh Cature</span><b>Còn 6</b></div>
          <div><span>Balo vận chuyển</span><b>Còn 3</b></div>
          <div><span>Vòng cổ thú cưng</span><b>Còn 5</b></div>
        </div>
      </article>
    </section>
  `,
  donHang: `
    <section class="box order-box">
      <div class="box-title order-title">
        <div>
          <h2>Đơn hàng gần đây</h2>
          <p>Danh sách các đơn hàng mới nhất</p>
        </div>
        <div class="order-tools">
          <input type="text" id="searchInput" placeholder="Tìm mã đơn hoặc khách hàng..." />
          <select id="statusFilter">
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Chờ xử lý">Chờ xử lý</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Đã giao">Đã giao</option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody id="orderTable">
          
          </tbody>
        </table>
        <p class="empty-message hidden" id="orderEmpty">Không tìm thấy đơn hàng phù hợp.</p>
      </div>
    </section>
  `,
  sanPham: `
          <section class="box">
            <div class="box-title pp-toolbar">
              <div>
                <h2>Quản lý sản phẩm</h2>
                <p>
                  Thêm, sửa, xóa hoặc ẩn sản phẩm (hiển thị ở trang chủ khi đã
                  nhập hàng)
                </p>
              </div>
              <div class="pp-tools">
                <input
                  type="text"
                  id="fQ"
                  data-filter=""
                  placeholder="Tìm mã, tên sản phẩm..."
                />
                <select id="fC" data-filter="">
                  <option value="">Tất cả loại</option>
                  <option value="L001">Thức ăn cho chó</option>
                  <option value="L002">Thức ăn cho mèo</option>
                  <option value="L003">Đồ dùng</option>
                  <option value="L004">Phụ kiện</option>
                </select>
                <select id="fS" data-filter="">
                  <option value="">Tất cả trạng thái</option>
                  <option value="0">Đang bán</option>
                  <option value="1">Đã ẩn</option>
                </select>
                <button class="pp-btn pp-btn--primary" data-act="prod-add">
                  + Thêm sản phẩm
                </button>
              </div>
            </div>
            <div class="product-modal hidden" id="productModal">
            <form class="product-modal-content" id="productForm">
              <div class="product-modal-header">
                <div>
                  <h2>Thêm sản phẩm mới</h2>
                  <p>Nhập thông tin chi tiết của sản phẩm</p>
                </div>
                <button type="button" class="modal-close" data-act="prod-cancel">
                  &times;
                </button>
              </div>

              <div class="product-form-grid">
                <div class="form-group">
                  <label>Tên sản phẩm *</label>
                  <input id="prodName" required placeholder="Nhập tên sản phẩm">
                </div>

                <div class="form-group">
                  <label>Thương hiệu *</label>
                  <input id="prodBrand" required placeholder="Ví dụ: JoyPet">
                </div>

                <div class="form-group">
                  <label>Danh mục *</label>
                  <select id="prodCategory" required>
                    <option value="">-- Chọn danh mục --</option>
                    <option value="L001">Thức ăn cho chó</option>
                    <option value="L002">Thức ăn cho mèo</option>
                    <option value="L003">Đồ dùng</option>
                    <option value="L004">Phụ kiện</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Đối tượng thú cưng *</label>
                  <select id="prodPet" required>
                    <option value="">-- Chọn đối tượng --</option>
                    <option value="Chó">Chó</option>
                    <option value="Mèo">Mèo</option>
                    <option value="Cả Chó và Mèo">Cả Chó và Mèo</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Quy cách / Khối lượng</label>
                  <input id="prodWeight" placeholder="Ví dụ: Chai xịt 400ml">
                </div>

                <div class="form-group">
                  <label>Combo</label>
                  <select id="prodCombo">
                    <option value="">Không thuộc combo</option>
                    <option value="Combo tiết kiệm">Combo tiết kiệm</option>
                    <option value="Combo chăm sóc">Combo chăm sóc</option>
                    <option value="Combo thức ăn">Combo thức ăn</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Đường dẫn hình ảnh</label>
                  <input id="prodImage" placeholder="./src/img/img-products/...">
                </div>

                <div class="form-group">
                  <label>Giá bán *</label>
                  <input id="prodPrice" type="number" min="0" required>
                </div>

                <div class="form-group">
                  <label>Số lượng tồn kho *</label>
                  <input id="prodStock" type="number" min="0" required>
                </div>

                <div class="form-group">
                  <label>Mô tả</label>
                  <input id="prodDesc" placeholder="Mô tả ngắn về sản phẩm">
                </div>

                <div class="form-group form-full">
                  <label>Điểm nổi bật</label>
                  <textarea id="prodHighlights"
                    placeholder="Mỗi dòng là một điểm nổi bật"></textarea>
                </div>
              </div>

              <div class="product-modal-footer">
                <button type="button" class="pp-btn" data-act="prod-cancel">
                  Hủy
                </button>
                <button type="submit" class="pp-btn pp-btn--primary" data-act="prod-export">
                  Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
            <div id="ppList">
              <div class="table-wrapper pp-table-wrap">
                <table class="pp-table">
                  <thead>
                    <tr>
                      <th>Hình</th>
                      <th>Mã</th>
                      <th>Tên sản phẩm</th>
                      <th>Loại</th>
                      <th>Mô tả</th>
                      <th>Nhóm trang chủ</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody id="productTable">
                    <tr data-cat="L001" data-hidden="0">
                      <td><div class="pp-thumb-ph">RC</div></td>
                      <td>SPC001</td>
                      <td>
                        <span class="pp-wrap" title="Royal Canin Mini Adult"
                          >Royal Canin Mini Adult</span
                        >
                      </td>
                      <td>Thức ăn cho chó</td>
                      <td>
                        <span
                          class="pp-wrap"
                          title="Hạt cho chó trưởng thành giống nhỏ, túi 2kg"
                          >Hạt cho chó trưởng thành giống nhỏ, túi 2kg</span
                        >
                      </td>
                      <td>Giá tốt hôm nay</td>
                      <td>
                        <span class="pp-badge pp-badge--done">Đang bán</span>
                      </td>
                      <td>
                        <div class="pp-actions">
                          <button
                            type="button"
                            class="pp-btn pp-btn--small"
                            data-act="prod-edit"
                            data-id="SPC001"
                          >
                            Sửa</button
                          ><button
                            type="button"
                            class="pp-btn pp-btn--small"
                            data-act="prod-toggle"
                            data-id="SPC001"
                          >
                            Ẩn</button
                          ><button
                            type="button"
                            class="pp-btn pp-btn--small pp-btn--danger"
                            data-act="prod-del"
                            data-id="SPC001"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p id="productEmpty" class="empty-message hidden">
                  Không tìm thấy sản phẩm phù hợp.
                </p>
              </div>
            </div>
          </section>`,
  khachHang: `<section class="box">
    <div class="box-title pp-toolbar">
      <div>
        <h2>Quản lý khách hàng</h2>
        <p>Danh sách tài khoản được lấy trực tiếp từ localStorage</p>
      </div>
      <div class="pp-tools">
        <input type="text" id="fQ" placeholder="Tìm tên, SĐT, email, tài khoản..." />
        <select id="fS">
          <option value="">Tất cả trạng thái</option>
          <option value="0">Hoạt động</option>
          <option value="1">Đã khóa</option>
        </select>
      </div>
    </div>
    <div class="table-wrapper pp-table-wrap">
      <table class="pp-table">
        <thead>
          <tr>
            <th>Mã KH</th>
            <th>Họ tên</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Tài khoản</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody id="customerTable"></tbody>
      </table>
      <p id="customerEmpty" class="empty-message hidden">
        Không tìm thấy khách hàng phù hợp.
      </p>
    </div>
  </section>`,

  tonKho: `
  <!-- 1) TRA CỨU TỒN THEO LOẠI TẠI MỘT THỜI ĐIỂM -->
  <section class="box inv-section">
    <div class="box-title pp-toolbar">
      <div>
        <h2>Tra cứu tồn kho theo loại</h2>
        <p>Số lượng tồn của sản phẩm theo loại tại một thời điểm (tính đến hết ngày đã chọn)</p>
      </div>
      <div class="pp-tools">
        <select id="invCategory">
          <option value="">Tất cả loại</option>
          <option value="L001">Thức ăn cho chó</option>
          <option value="L002">Thức ăn cho mèo</option>
          <option value="L003">Đồ dùng</option>
          <option value="L004">Phụ kiện</option>
        </select>
        <input type="date" id="invDate" />
      </div>
    </div>
    <div class="table-wrapper pp-table-wrap">
      <table class="pp-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên sản phẩm</th>
            <th>Loại</th>
            <th>Tồn tại thời điểm</th>
            <th>Tình trạng</th>
          </tr>
        </thead>
        <tbody id="invStockTable"></tbody>
      </table>
      <p id="invStockEmpty" class="empty-message hidden">
        Không có thông tin sản phẩm.
      </p>
    </div>
    <p class="inv-total"></p>
  </section>

  <!-- 2) CẢNH BÁO SẢN PHẨM SẮP HẾT HÀNG -->
  <section class="box inv-section">
    <div class="box-title pp-toolbar">
      <div>
        <h2>Cảnh báo sắp hết hàng</h2>
        <p>Các sản phẩm có tồn hiện tại nhỏ hơn hoặc bằng ngưỡng cảnh báo</p>
      </div>
    </div>
    <div class="table-wrapper pp-table-wrap">
      <table class="pp-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên sản phẩm</th>
            <th>Loại</th>
            <th>Tồn hiện tại</th>
            <th>Mức độ</th>
          </tr>
        </thead>
        <tbody id="invWarnTable"></tbody>
      </table>
      <p id="invWarnEmpty" class="empty-message hidden">
        Không có sản phẩm nào sắp hết hàng.
    </div>
  </section>

  <!-- 3) NHẬP - XUẤT - TỒN CỦA MỘT SẢN PHẨM TRONG KHOẢNG THỜI GIAN -->
  <section class="box inv-section">
    <div class="box-title pp-toolbar">
      <div>
        <h2>Báo cáo nhập – xuất – tồn</h2>
        <p>Tra cứu nhập, xuất, tồn của một sản phẩm trong một khoảng thời gian</p>
      </div>
      <div class="pp-tools">
        <input
          type="text"
          id="invReportProduct"
          data-filter=""
          placeholder="Tìm mã, tên sản phẩm..."
        />
        <input type="date" id="invFrom" />
        <input type="date" id="invTo" />
      </div>
    </div>
    <div class="inv-summary" id="invReportSummary"></div>
    <div class="table-wrapper pp-table-wrap">
      <table class="pp-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Loại phiếu</th>
            <th>Số lượng</th>
            <th>Ghi chú</th>
            <th>Tình trạng</th>
          </tr>
        </thead>
        <tbody id="invReportTable"></tbody>
      </table>
      <p id="invReportEmpty" class="empty-message hidden"></p>
    </div>
  </section>`,

  caiDat: `<section class="box">
          <div class="box-title pp-toolbar">
            <div>
              <h2>Cài đặt</h2>
              <p>Dữ liệu được lưu trong trình duyệt (localStorage)</p>
            </div>
            <div class="pp-tools"></div>
          </div>
          <div class="pp-form-fields" style="max-width: 420px">
            <button class="pp-btn pp-btn--danger" data-act="reset">
              Khôi phục dữ liệu mẫu (xóa toàn bộ dữ liệu hiện tại)
            </button>
          </div>
        </section>`,
};

// ===== PHẦN 2: Hàm chuyển trang =====
var pageContent = document.getElementById("pageContent");

function loadPage(pageName) {
  pageContent.innerHTML = pages[pageName];

  if (pageName === "tongQuan") {
    showDashboardNumbers();
  }

  if (pageName === "donHang") {
    showOrders(); // đổ dữ liệu vào bảng sau khi trang đã được vẽ
  }

  if (pageName === "sanPham") {
    showProducts();
  }

  if (pageName === "khachHang") {
    showCustomers();
  }
  if (pageName === "tonKho") {
    showInventory();
  }
}

function showDashboardNumbers() {
  var lowStockCount = products.filter(function (product) {
    return Number(product.stock) <= 10;
  }).length;

  document.getElementById("dashboardOrderCount").innerText = orders.length;
  document.getElementById("dashboardProductCount").innerText = products.length;
  document.getElementById("dashboardCustomerCount").innerText =
    customers.length;
  document.getElementById("dashboardStockCount").innerText = lowStockCount;
}

// ===== PHẦN 3: Hiển thị đơn hàng (lấy phần tử mỗi lần chạy) =====
function showOrders() {
  var keyword = document.getElementById("searchInput").value.toLowerCase();
  var selectedStatus = document.getElementById("statusFilter").value;
  var html = "";
  var resultCount = 0;

  for (var i = 0; i < orders.length; i++) {
    var order = orders[i];
    var matchesKeyword =
      order.id.toLowerCase().includes(keyword) ||
      order.customer.toLowerCase().includes(keyword);
    var matchesStatus =
      selectedStatus === "Tất cả" || order.status === selectedStatus;

    if (matchesKeyword && matchesStatus) {
      resultCount++;
      html +=
        "<tr>" +
        "<td>" +
        order.id +
        "</td>" +
        "<td>" +
        order.customer +
        "</td>" +
        "<td>" +
        order.product +
        "</td>" +
        "<td>" +
        formatMoney(order.total) +
        "</td>" +
        '<td><span class="status ' +
        getStatusClass(order.status) +
        '">' +
        order.status +
        "</span></td>" +
        "</tr>";
    }
  }

  document.getElementById("orderTable").innerHTML = html;
  document
    .getElementById("emptyMessage")
    .classList.toggle("hidden", resultCount !== 0);
}

// Hiển thị khách hàng từ mảng customers đã đọc từ khóa localStorage "users".
function showCustomers() {
  var searchBox = document.getElementById("fQ");
  var statusBox = document.getElementById("fS");
  var customerTable = document.getElementById("customerTable");

  if (!searchBox || !statusBox || !customerTable) {
    return;
  }

  var keyword = searchBox.value.trim().toLowerCase();
  var status = statusBox.value;
  var html = "";
  var count = 0;

  customers.forEach(function (customer) {
    var searchableText = [
      customer.id,
      customer.fullName,
      customer.phone,
      customer.email,
      customer.username,
    ]
      .join(" ")
      .toLowerCase();
    var matchesKeyword = searchableText.includes(keyword);
    var matchesStatus =
      status === "" ||
      (status === "1" && customer.locked) ||
      (status === "0" && !customer.locked);

    if (!matchesKeyword || !matchesStatus) {
      return;
    }

    count++;
    html += `
      <tr>
        <td>${customer.id}</td>
        <td>${customer.fullName}</td>
        <td>${customer.phone || "—"}</td>
        <td>${customer.email || "—"}</td>
        <td><span class="pp-wrap">${customer.address || "—"}</span></td>
        <td>${customer.username || "—"}</td>
        <td>
          <span class="pp-badge ${customer.locked ? "pp-badge--locked" : "pp-badge--done"}">
            ${customer.locked ? "Đã khóa" : "Hoạt động"}
          </span>
        </td>
        <td>
          <div class="pp-actions">
            <button class="pp-btn pp-btn--small" data-act="cus-reset" data-id="${customer.id}">
              Reset mật khẩu
            </button>
            <button class="pp-btn pp-btn--small" data-act="cus-lock" data-id="${customer.id}">
              ${customer.locked ? "Mở khóa" : "Khóa"}
            </button>
            <button class="pp-btn pp-btn--small pp-btn--danger" data-act="cus-del" data-id="${customer.id}">
              Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  customerTable.innerHTML = html;
  document
    .getElementById("customerEmpty")
    .classList.toggle("hidden", count !== 0);
}

function showProducts() {
  var keyword = document.getElementById("fQ").value.trim().toLowerCase();
  var category = document.getElementById("fC").value;
  var status = document.getElementById("fS").value;

  var html = "";
  var count = 0;

  products.forEach(function (product) {
    var hidden = product.hidden ?? 0;

    var matchesKeyword =
      product.id.toLowerCase().includes(keyword) ||
      product.name.toLowerCase().includes(keyword);

    var matchesCategory = category === "" || product.category === category;

    var matchesStatus = status === "" || String(hidden) === status;

    if (!matchesKeyword || !matchesCategory || !matchesStatus) {
      return;
    }

    count++;

    var categoryName =
      {
        L001: "Thức ăn cho chó",
        L002: "Thức ăn cho mèo",
        L003: "Đồ dùng",
        L004: "Phụ kiện",
      }[product.category] || product.category;

    var imageHTML = product.image
      ? `<img src="${product.image}" alt="${product.name}"
             style="width:50px;height:50px;object-fit:contain">`
      : `<div class="pp-thumb-ph">${product.id.substring(0, 3)}</div>`;

    html += `
      <tr data-cat="${product.category}" data-hidden="${hidden}">
        <td>${imageHTML}</td>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${categoryName}</td>
        <td>${product.desc || product.description || ""}</td>
        <td>${product.combo || "—"}</td>

        <td>
          <span class="pp-badge pp-badge--done">
            ${hidden === 0 ? "Đang bán" : "Đã ẩn"}
          </span>
        </td>

        <td>
          <div class="pp-actions">
            <button class="pp-btn pp-btn--small"
                    data-act="prod-toggle"
                    data-id="${product.id}">
              ${hidden === 0 ? "Ẩn" : "Hiện"}
            </button>

            <button class="pp-btn pp-btn--small pp-btn--danger"
                    data-act="prod-del"
                    data-id="${product.id}">
              Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  document.getElementById("productTable").innerHTML = html;

  document
    .getElementById("productEmpty")
    .classList.toggle("hidden", count !== 0);
}
function deleteProduct(id) {
  var confirmDelete = confirm("Bạn có chắc chắn muốn xóa sản phẩm " + id + "?");

  if (confirmDelete) {
    for (var i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        products.splice(i, 1);

        break;
      }
    }

    showProducts();

    showMessage("Đã xóa sản phẩm thành công.");
  }
}

function showInventory() {
  var today = todayString();
  var categoryBox = document.getElementById("invCategory");
  var dateBox = document.getElementById("invDate");
  var productBox = document.getElementById("invReportProduct");
  var fromBox = document.getElementById("invFrom");
  var toBox = document.getElementById("invTo");

  var html = "";
  var count = 0;

  // Lần đầu mở trang: điền giá trị mặc định (dataset.ready dùng để nhận biết "lần đầu")
  if (!dateBox.dataset.ready) {
    dateBox.dataset.ready = "1";
    dateBox.value = today;
    fromBox.value = today.substring(0, 8) + "01"; // ngày 1 của tháng
    toBox.value = today;
  }

  // 1) Tồn theo loại tại một thời điểm
  html = "";
  for (count = 0; count < products.length; count++) {
    var p = products[count];

    if (categoryBox.value !== "" && p.category !== categoryBox.value) {
      continue;
    }

    var stock = getStockAt(p, dateBox.value);
    var status = getStockStatus(stock, LOW_STOCK_LIMIT);

    html +=
      "<tr><td>" +
      p.id +
      "</td>" +
      "<td>" +
      p.name +
      "</td>" +
      "<td>" +
      getCategoryName(p.category) +
      "</td>" +
      "<td>" +
      stock +
      "</td>" +
      '<td><span class="pp-badge ' +
      status.cls +
      '">' +
      status.text +
      "</span></td></tr>";
  }
  document.getElementById("invStockTable").innerHTML = html;
  document
    .getElementById("invStockEmpty")
    .classList.toggle("hidden", html !== "");

  // 2) Cảnh báo sắp hết hàng (tồn hiện tại <= ngưỡng)
  var limit = LOW_STOCK_LIMIT;

  html = "";
  for (count = 0; count < products.length; count++) {
    var q = products[count];
    var qStock = Number(q.stock) || 0;

    if (qStock > limit) {
      continue;
    }

    var qStatus = getStockStatus(qStock, limit);

    html +=
      "<tr><td>" +
      q.id +
      "</td>" +
      "<td>" +
      q.name +
      "</td>" +
      "<td>" +
      getCategoryName(q.category) +
      "</td>" +
      "<td>" +
      qStock +
      "</td>" +
      '<td><span class="pp-badge ' +
      qStatus.cls +
      '">' +
      qStatus.text +
      "</span></td></tr>";
  }
  document.getElementById("invWarnTable").innerHTML = html;
  document
    .getElementById("invWarnEmpty")
    .classList.toggle("hidden", html !== "");
  if (html === "") {
    html = emptyRow(5, "Không có sản phẩm nào sắp hết hàng");
  }
  document.getElementById("invWarnTable").innerHTML = html;

  // 3) Nhập - xuất - tồn của 1 sản phẩm trong khoảng thời gian
  var summary = document.getElementById("invReportSummary");
  var reportBody = document.getElementById("invReportTable");
  var reportEmpty = document.getElementById("invReportEmpty");
  var keyword = productBox.value.trim().toLowerCase();
  var product = null;

  // Ưu tiên khớp đúng mã, nếu không có thì lấy sản phẩm đầu tiên có mã/tên chứa từ khóa
  for (count = 0; count < products.length && keyword !== ""; count++) {
    if (String(products[count].id).toLowerCase() === keyword) {
      product = products[count];
      break;
    }
  }
  for (
    count = 0;
    count < products.length && !product && keyword !== "";
    count++
  ) {
    var text = (products[count].id + " " + products[count].name).toLowerCase();

    if (text.includes(keyword)) {
      product = products[count];
    }
  }

  if (keyword === "") {
    summary.innerText = "";
    reportBody.innerHTML = "";
    reportEmpty.innerText = "Nhập mã hoặc tên sản phẩm để tra cứu.";
    reportEmpty.classList.remove("hidden");
    return;
  }

  if (
    !product ||
    fromBox.value === "" ||
    toBox.value === "" ||
    fromBox.value > toBox.value
  ) {
    summary.innerText = "";
    reportBody.innerHTML = "";
    reportEmpty.innerText = "Không có thông tin.";
    reportEmpty.classList.remove("hidden");
    return;
  }
  var report = getStockReport(product, fromBox.value, toBox.value);

  summary.innerText =
    product.id +
    " - " +
    product.name +
    ":  " +
    "Nhập: " +
    report.totalIn +
    "  |  Xuất: " +
    report.totalOut +
    "  |  Tồn hiện tại: " +
    product.stock;

  html = "";
  var balance = report.opening; // tồn chạy: bắt đầu từ tồn đầu kỳ
  for (i = 0; i < report.logs.length; i++) {
    var log = report.logs[i];
    balance += Number(log.inStock) || 0;
    var logStatus = getStockStatus(balance, LOW_STOCK_LIMIT);

    html +=
      "<tr><td>" +
      log.date +
      "</td>" +
      "<td>" +
      (log.inStock > 0 ? "Nhập kho" : "Xuất kho") +
      "</td>" +
      "<td>" +
      Math.abs(log.inStock) +
      "</td>" +
      "<td>" +
      (log.note || "—") + // [TỒN KHO - SỬA] thêm ngoặc: trước đây mất </td></tr> khi có ghi chú
      "</td>" +
      // [TỒN KHO - THÊM MỚI] ô "Tình trạng" là ô cuối cùng của dòng
      '<td><span class="pp-badge ' +
      logStatus.cls +
      '">' +
      logStatus.text +
      "</span></td></tr>";
  }
  reportBody.innerHTML = html;
  reportEmpty.innerText =
    "Không có thông tin nhập/xuất trong khoảng thời gian này.";
  reportEmpty.classList.toggle("hidden", html !== "");
}

function filterProducts() {
  var keyword = document.getElementById("fQ").value.trim().toLowerCase();
  var categoryBox = document.getElementById("fC");
  var statusBox = document.getElementById("fS");
  var category = categoryBox ? categoryBox.value : "";
  var status = statusBox ? statusBox.value : "";
  var rows = document.querySelectorAll(".pp-table tbody tr");

  for (var count = 0; count < rows.length; count++) {
    var row = rows[count];

    var matchesKeyword = (row.cells[1].innerText + " " + row.cells[2].innerText)
      .toLowerCase()
      .includes(keyword);
    var matchesCategory = category === "" || row.dataset.cat === category;
    var matchesStatus = status === "" || row.dataset.hidden === status;

    if (matchesKeyword && matchesCategory && matchesStatus) {
      row.classList.remove("hidden");
    } else {
      row.classList.add("hidden");
    }
  }
}
