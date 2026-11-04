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

var orderTable = document.getElementById('orderTable');
var searchInput = document.getElementById('searchInput');
var statusFilter = document.getElementById('statusFilter');
var orderForm = document.getElementById('orderForm');
var emptyMessage = document.getElementById('emptyMessage');

function formatMoney(number) {
  return number.toLocaleString('vi-VN') + 'đ';
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

function showMessage(text) {
  var message = document.getElementById('message');
  message.innerText = text;
  message.classList.add('show');

  setTimeout(function () {
    message.classList.remove('show');
  }, 2000);
}

// ===== PHẦN 1: Nội dung mỗi trang (chuỗi HTML) =====
var pages = {
  tongQuan: `
    <section class="stat-list">
      <article class="stat-card">
        <div class="stat-icon yellow"><i class="ri-shopping-basket-2-line"></i></div>
        <div><p>Đơn hàng hôm nay</p><h2>12</h2></div>
        <p class="stat-desc"><span class="trend-up">↑ 12%</span> so với hôm qua</p>
      </article>
      <article class="stat-card">
        <div class="stat-icon purple"><i class="ri-shopping-cart-line"></i></div>
        <div><p>Tổng sản phẩm</p><h2>86</h2></div>
        <p class="stat-desc"><span class="trend-up">↑ 12%</span> so với hôm qua</p>
      </article>
      <article class="stat-card">
        <div class="stat-icon blue"><i class="ri-user-line"></i></div>
        <div><p>Khách hàng</p><h2>245</h2></div>
        <p class="stat-desc"><span class="trend-up">↑ 12%</span> so với hôm qua</p>
      </article>
      <article class="stat-card">
        <div class="stat-icon red"><i class="ri-coupon-line"></i></div>
        <div><p>Sắp hết hàng</p><h2>1000</h2></div>
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
          <button class="add-button" id="showFormButton">Thêm đơn</button>
        </div>
      </div>

      <form class="order-form hidden" id="orderForm">
        <h3>Thêm đơn hàng mới</h3>
        <div class="form-fields">
          <input id="customerName" required placeholder="Tên khách hàng" />
          <input id="productName" required placeholder="Tên sản phẩm" />
          <input id="orderTotal" required type="number" min="1000" placeholder="Tổng tiền" />
          <select id="orderStatus">
            <option>Chờ xử lý</option>
            <option>Đang giao</option>
            <option>Đã giao</option>
          </select>
        </div>
        <div class="form-buttons">
          <button type="button" class="cancel-button" id="cancelButton">Hủy</button>
          <button type="submit" class="add-button">Lưu đơn hàng</button>
        </div>
      </form>

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
          <tbody id="orderTable"></tbody>
        </table>
        <p class="empty-message hidden" id="emptyMessage">Không tìm thấy đơn hàng phù hợp.</p>
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
                  <tbody>
                    <tr>
                      <td><div class="pp-thumb-ph">RC</div></td>
                      <td>SP001</td>
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
                            data-id="SP001"
                          >
                            Sửa</button
                          ><button
                            type="button"
                            class="pp-btn pp-btn--small"
                            data-act="prod-toggle"
                            data-id="SP001"
                          >
                            Ẩn</button
                          ><button
                            type="button"
                            class="pp-btn pp-btn--small pp-btn--danger"
                            data-act="prod-del"
                            data-id="SP001"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>`,
  khachHang: `<section class="box">
          <div class="box-title pp-toolbar">
            <div>
              <h2>Quản lý khách hàng</h2>
              <p>Danh sách tài khoản khách hàng</p>
            </div>
            <div class="pp-tools">
              <input
                type="text"
                id="fQ"
                data-filter=""
                placeholder="Tìm tên, SĐT, email, tài khoản..."
              />
              <select id="fS" data-filter="">
                <option value="">Tất cả trạng thái</option>
                <option value="0">Hoạt động</option>
                <option value="1">Đã khóa</option>
              </select>
            </div>
          </div>
          <div id="ppList">
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
                <tbody>
                  <tr>
                    <td>KH001</td>
                    <td>Minh Anh</td>
                    <td>0901234567</td>
                    <td>minhanh@example.com</td>
                    <td>Quận 1, TP.HCM</td>
                    <td>minhanh</td>
                    <td>
                      <span class="pp-badge pp-badge--done">Hoạt động</span>
                    </td>
                    <td>
                      <div class="pp-actions">
                        <button
                          type="button"
                          class="pp-btn pp-btn--small"
                          data-act="cus-reset"
                          data-id="KH001"
                        >
                          Reset mật khẩu</button
                        ><button
                          type="button"
                          class="pp-btn pp-btn--small pp-btn--danger"
                          data-act="cus-lock"
                          data-id="KH001"
                        >
                          Khóa
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>`,
  khuyenMai: `<section class="box">
          <div class="box-title pp-toolbar">
            <div>
              <h2>Quản lý khuyến mãi</h2>
              <p>
                Đặt % giảm giá hiển thị ở trang chủ.
                Giá bán = Giá gốc × (1 − % giảm)
              </p>
            </div>
            <div class="pp-tools">
              <input
                type="text"
                id="fQ"
                data-filter=""
                placeholder="Tìm mã, tên sản phẩm..."
              /><select id="fC" data-filter="">
                <option value="">Tất cả loại</option>
                <option value="L001">Thức ăn cho chó</option>
                <option value="L002">Thức ăn cho mèo</option>
                <option value="L003">Đồ dùng</option>
                <option value="L004">Phụ kiện</option>
              </select>
              <button class="pp-btn pp-btn--primary" data-act="promo-add">
                + Thêm khuyến mãi
              </button>
            </div>
          </div>
          <div id="ppList">
            <div class="table-wrapper pp-table-wrap">
              <table class="pp-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Tên sản phẩm</th>
                    <th>Loại</th>
                    <th>Giá vốn</th>
                    <th>Giá gốc</th>
                    <th>% giảm giá</th>
                    <th>Giá bán</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>SP001</td>
                    <td>Royal Canin Mini Adult</td>
                    <td>Thức ăn cho chó</td>
                    <td>150.000đ</td>
                    <td>180.000đ</td>
                    <td>—</td>
                    <td><b>180.000đ</b></td>
                    <td>
                      <button
                        type="button"
                        class="pp-btn pp-btn--small"
                        data-act="prod-margin"
                        data-id="SP001"
                      >
                        Sửa giá
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
var pageContent = document.getElementById('pageContent');

function loadPage(pageName) {
  pageContent.innerHTML = pages[pageName];

  if (pageName === 'donHang') {
    showOrders(); // đổ dữ liệu vào bảng sau khi trang đã được vẽ
  }
}
// ===== PHẦN 3: Hiển thị đơn hàng (lấy phần tử mỗi lần chạy) =====
function showOrders() {
  var keyword = searchInput.value.toLowerCase();
  var selectedStatus = statusFilter.value;
  var html = '';
  var resultCount = 0;

  for (var i = 0; i < orders.length; i++) {
    var order = orders[i];
    var matchesKeyword =
      order.id.toLowerCase().includes(keyword) ||
      order.customer.toLowerCase().includes(keyword);
    var matchesStatus =
      selectedStatus === 'Tất cả' || order.status === selectedStatus;

    if (matchesKeyword && matchesStatus) {
      resultCount++;
      html +=
        '<tr>' +
        '<td>' +
        order.id +
        '</td>' +
        '<td>' +
        order.customer +
        '</td>' +
        '<td>' +
        order.product +
        '</td>' +
        '<td>' +
        formatMoney(order.total) +
        '</td>' +
        '<td><span class="status ' +
        getStatusClass(order.status) +
        '">' +
        order.status +
        '</span></td>' +
        '</tr>';
    }
  }

  orderTable.innerHTML = html;

  if (resultCount === 0) {
    emptyMessage.classList.remove('hidden');
  } else {
    emptyMessage.classList.add('hidden');
  }
}
// ===== PHẦN 4: Sự kiện gắn lên pageContent (chỉ 1 lần) =====
pageContent.addEventListener('input', function (event) {
  if (event.target.id === 'searchInput') {
    showOrders();
  }
});

pageContent.addEventListener('change', function (event) {
  if (event.target.id === 'statusFilter') {
    showOrders();
  }
});

pageContent.addEventListener('click', function (event) {
  var orderForm = document.getElementById('orderForm');

  if (event.target.id === 'showFormButton') {
    orderForm.classList.remove('hidden');
  }

  if (event.target.id === 'cancelButton') {
    orderForm.classList.add('hidden');
    orderForm.reset();
  }
});

pageContent.addEventListener('submit', function (event) {
  if (event.target.id !== 'orderForm') return;

  event.preventDefault();

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
loadPage('tongQuan');
