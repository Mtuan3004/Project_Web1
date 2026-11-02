// Logic xử lý toàn bộ Admin Center & Quản trị
function renderAdminLayout() {
  if (state.currentTab === "admin-login") {
    return renderAdminLoginForm();
  }

  const container = document.createElement("div");
  container.className = "admin-root admin-layout";

  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  sidebar.id = "adminSidebar";
  sidebar.innerHTML = `
    <div class="logo">
        <img src="../img/icon/favicon.ico" alt="ảnh logo" class="logo-mark"><i class="ri-shield-cross-line"></i></img>
        <div>
            <h2>PetPett</h2>
            <p>ADMIN CENTER</p>
        </div>
    </div>

    <nav>
        <p class="menu-label">TỔNG QUAN</p>
        <button onclick="navigateTo('admin-dashboard')" class="menu-item ${state.currentTab === "admin-dashboard" ? "active" : ""}">
            <div class="menu-icon"><i class="ri-dashboard-line"></i></div>
            <span class="menu-text">Tổng quan</span>
        </button>

        <p class="menu-label">QUẢN LÝ TỒN KHO & HÀNG</p>
        <button onclick="navigateTo('admin-products')" class="menu-item ${state.currentTab === "admin-products" ? "active" : ""}">
            <div class="menu-icon"><i class="ri-box-3-line"></i></div>
            <span class="menu-text">Danh mục SP</span>
        </button>
        <button onclick="navigateTo('admin-categories')" class="menu-item ${state.currentTab === "admin-categories" ? "active" : ""}">
            <div class="menu-icon"><i class="ri-folders-line"></i></div>
            <span class="menu-text">Loại sản phẩm</span>
        </button>
        <button onclick="navigateTo('admin-purchases')" class="menu-item ${state.currentTab === "admin-purchases" ? "active" : ""}">
            <div class="menu-icon"><i class="ri-truck-line"></i></div>
            <span class="menu-text">Nhập hàng</span>
        </button>
        <button onclick="navigateTo('admin-pricing')" class="menu-item ${state.currentTab === "admin-pricing" ? "active" : ""}">
            <div class="menu-icon"><i class="ri-price-tag-3-line"></i></div>
            <span class="menu-text">Quản lý giá</span>
        </button>
        <button onclick="navigateTo('admin-stock')" class="menu-item ${state.currentTab === "admin-stock" ? "active" : ""}">
            <div class="menu-icon"><i class="ri-database-2-line"></i></div>
            <span class="menu-text">Tồn kho & Cảnh báo</span>
        </button>

        <p class="menu-label">KHÁCH HÀNG & ĐƠN HÀNG</p>
        <button onclick="navigateTo('admin-orders')" class="menu-item ${state.currentTab === "admin-orders" ? "active" : ""}">
            <div class="menu-icon"><i class="ri-shopping-bag-3-line"></i></div>
            <span class="menu-text">Đơn hàng</span>
            <b class="menu-count">${DB.getOrders().length}</b>
        </button>
        <button onclick="navigateTo('admin-users')" class="menu-item ${state.currentTab === "admin-users" ? "active" : ""}">
            <div class="menu-icon"><i class="ri-user-3-line"></i></div>
            <span class="menu-text">Người dùng</span>
        </button>
    </nav>

    <button class="collapse-button" onclick="toggleSidebarCollapse()">
        <span class="collapse-arrow">‹</span>
        <span class="collapse-text">Thu gọn menu</span>
    </button>
  `;
  container.appendChild(sidebar);

  const mainContent = document.createElement("main");
  mainContent.className = "main-content";

  const getTitle = () => {
    if (state.currentTab === "admin-dashboard") return "Tổng quan & Báo cáo";
    if (state.currentTab === "admin-users")
      return "Quản lý Người dùng / Khách hàng";
    if (state.currentTab === "admin-categories") return "Quản lý Loại Sản Phẩm";
    if (state.currentTab === "admin-products")
      return "Quản lý Danh Mục Sản Phẩm";
    if (state.currentTab === "admin-purchases") return "Quản lý Nhập Hàng";
    if (state.currentTab === "admin-pricing")
      return "Quản lý Giá Bán & Tỉ Lệ Lợi Nhuận";
    if (state.currentTab === "admin-orders") return "Quản lý Đơn Đặt Hàng";
    if (state.currentTab === "admin-stock") return "Báo Cáo Tồn Kho";
    return "Admin Center";
  };

  const header = document.createElement("header");
  header.className = "admin-header";
  header.innerHTML = `
    <div class="flex items-center gap-3">
        <button onclick="toggleMobileSidebar()" class="md:hidden text-2xl p-1 text-slate-700">☰</button>
        <div>
            <h1>${getTitle()}</h1>
            <p>Xin chào, chúc bạn một ngày quản trị làm việc hiệu quả!</p>
        </div>
    </div>

    <div class="admin-info">
        <span>AD</span>
        <div>
            <strong>Admin Quản Trị</strong>
            <small>Chủ hệ thống VetCare</small>
        </div>
        <button onclick="logoutAdmin()" class="adm-btn adm-btn-secondary ml-3" title="Đăng xuất Admin">
            <i class="ri-logout-box-r-line"></i> Thoát
        </button>
    </div>
  `;
  mainContent.appendChild(header);

  const pageContent = document.createElement("div");
  pageContent.className = "admin-page-content";

  if (state.currentTab === "admin-dashboard")
    pageContent.appendChild(renderAdminDashboard());
  else if (state.currentTab === "admin-users")
    pageContent.appendChild(renderAdminUsers());
  else if (state.currentTab === "admin-categories")
    pageContent.appendChild(renderAdminCategories());
  else if (state.currentTab === "admin-products")
    pageContent.appendChild(renderAdminProducts());
  else if (state.currentTab === "admin-purchases")
    pageContent.appendChild(renderAdminPurchases());
  else if (state.currentTab === "admin-pricing")
    pageContent.appendChild(renderAdminPricing());
  else if (state.currentTab === "admin-orders")
    pageContent.appendChild(renderAdminOrders());
  else if (state.currentTab === "admin-stock")
    pageContent.appendChild(renderAdminStock());

  mainContent.appendChild(pageContent);
  container.appendChild(mainContent);
  return container;
}

function renderAdminLoginForm() {
  const container = document.createElement("div");
  container.className =
    "min-h-screen bg-slate-900 flex items-center justify-center p-4";
  container.innerHTML = `
    <div class="bg-white max-w-md w-full p-8 rounded-2xl shadow-2xl space-y-6">
        <div class="text-center space-y-2">
            <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2 text-3xl font-bold">
                <i class="ri-shield-user-line"></i>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-800">Đăng Nhập Quản Trị</h2>
            <p class="text-xs text-slate-500">Cổng đăng nhập độc lập dành riêng cho Chủ / Quản lý cửa hàng VetCare</p>
        </div>

        <form id="admin-login-form" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Tài khoản quản trị</label>
                <input type="text" id="admin-user" placeholder="Tên đăng nhập (Mặc định: admin)" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Mật khẩu</label>
                <input type="password" id="admin-pass" placeholder="Mật khẩu (Mặc định: 123)" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none">
            </div>
            <button type="submit" class="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg shadow-md transition">
                Đăng Nhập Quản Trị
            </button>
        </form>

        <div class="text-center pt-2">
            <button onclick="navigateTo('home')" class="text-xs text-slate-500 hover:text-slate-800 underline">Quay lại Giao diện Khách hàng</button>
        </div>
    </div>
  `;

  setTimeout(() => {
    const form = container.querySelector("#admin-login-form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const u = container.querySelector("#admin-user").value.trim();
        const p = container.querySelector("#admin-pass").value.trim();

        if (u === DEFAULT_ADMIN.username && p === DEFAULT_ADMIN.password) {
          setAdminLogin(true);
          showNotification("Đăng nhập Quản trị thành công!", "success");
          navigateTo("admin-dashboard");
        } else {
          showNotification("Sai tài khoản hoặc mật khẩu Quản trị!", "error");
        }
      };
    }
  }, 0);

  return container;
}

function logoutAdmin() {
  setAdminLogin(false);
  showNotification("Đã thoát phiên làm việc Admin");
  navigateTo("home");
}

function renderAdminDashboard() {
  const el = document.createElement("div");
  el.className = "space-y-6";

  const products = DB.getProducts();
  const orders = DB.getOrders();
  const users = DB.getUsers();
  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  el.innerHTML = `
    <section class="stat-list">
        <article class="stat-card">
            <div class="stat-icon green"><i class="ri-money-dollar-circle-line"></i></div>
            <div>
                <p>Doanh thu (Đã hoàn thành)</p>
                <h2>${formatVND(totalRevenue)}</h2>
            </div>
        </article>

        <article class="stat-card">
            <div class="stat-icon yellow"><i class="ri-shopping-basket-2-line"></i></div>
            <div>
                <p>Tổng đơn hàng</p>
                <h2>${orders.length}</h2>
            </div>
        </article>

        <article class="stat-card">
            <div class="stat-icon blue"><i class="ri-user-line"></i></div>
            <div>
                <p>Khách hàng đăng ký</p>
                <h2>${users.length}</h2>
            </div>
        </article>

        <article class="stat-card">
            <div class="stat-icon red"><i class="ri-alert-line"></i></div>
            <div>
                <p>Cảnh báo sắp hết hàng</p>
                <h2>${lowStockCount} SP</h2>
            </div>
        </article>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article class="adm-box">
            <div class="adm-box-title">
                <div>
                    <h2>Sản phẩm nổi bật / Tồn kho nhiều</h2>
                    <p>Top sản phẩm có lượng tồn kho cao</p>
                </div>
            </div>
            <div class="space-y-3">
                ${products
                  .slice(0, 4)
                  .map(
                    (p) => `
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <img src="${p.image}" class="w-10 h-10 object-cover rounded bg-slate-100" onerror="this.src='https://placehold.co/100x100'">
                            <div>
                                <strong class="text-xs block text-slate-800">${p.name}</strong>
                                <span class="text-[10px] text-slate-500">Mã: ${p.code}</span>
                            </div>
                        </div>
                        <span class="text-xs font-bold text-slate-700">Tồn: ${p.stock}</span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </article>

        <article class="adm-box">
            <div class="adm-box-title">
                <div>
                    <h2>Cảnh báo nhập hàng gấp</h2>
                    <p>Sản phẩm có tồn kho < 10 cần bổ sung</p>
                </div>
            </div>
            <div class="space-y-3">
                ${
                  products
                    .filter((p) => p.stock < 10)
                    .map(
                      (p) => `
                    <div class="flex items-center justify-between border-b pb-2">
                        <span class="text-xs font-medium text-slate-800">${p.name}</span>
                        <b class="text-xs text-red-600 font-bold">Còn ${p.stock} đơn vị</b>
                    </div>
                `,
                    )
                    .join("") ||
                  '<p class="text-xs text-slate-500">Tất cả sản phẩm đều an toàn về tồn kho.</p>'
                }
            </div>
        </article>
    </section>
  `;
  return el;
}

function renderAdminUsers() {
  const container = document.createElement("div");
  const users = DB.getUsers();

  container.innerHTML = `
    <div class="adm-box">
        <div class="adm-box-title">
            <div>
                <h2>Danh sách tài khoản khách hàng</h2>
                <p>Xem thông tin, Khóa / Mở khóa và Reset mật khẩu tài khoản</p>
            </div>
        </div>

        <div class="adm-table-wrapper">
            <table class="adm-table">
                <thead>
                    <tr>
                        <th>Mã KH</th>
                        <th>Tài khoản</th>
                        <th>Họ và tên</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ nhận hàng</th>
                        <th>Trạng thái</th>
                        <th style="text-align: right;">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    ${users
                      .map(
                        (u) => `
                        <tr>
                            <td>${u.id}</td>
                            <td style="color: #0284c7; font-weight: bold;">${u.username}</td>
                            <td><strong>${u.fullname}</strong></td>
                            <td>${u.phone}</td>
                            <td>${u.address}</td>
                            <td>
                                ${u.locked ? '<span class="status-badge cancelled">Đã Khóa</span>' : '<span class="status-badge done">Hoạt động</span>'}
                            </td>
                            <td style="text-align: right;">
                                <button onclick="resetUserPassword('${u.id}')" class="adm-btn adm-btn-secondary">Reset Mật Khẩu</button>
                                <button onclick="toggleLockUser('${u.id}')" class="adm-btn ${u.locked ? "adm-btn-success" : "adm-btn-danger"}">
                                    ${u.locked ? "Mở khóa" : "Khóa TK"}
                                </button>
                            </td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    </div>
  `;
  return container;
}

function resetUserPassword(userId) {
  const users = DB.getUsers();
  const u = users.find((x) => x.id === userId);
  if (u) {
    u.password = "123456";
    DB.saveUsers(users);
    showNotification(
      `Đã reset mật khẩu cho khách hàng ${u.username} về mặc định '123456'`,
      "success",
    );
    render();
  }
}

function toggleLockUser(userId) {
  const users = DB.getUsers();
  const u = users.find((x) => x.id === userId);
  if (u) {
    u.locked = !u.locked;
    DB.saveUsers(users);
    showNotification(
      `Đã ${u.locked ? "Khóa" : "Mở khóa"} tài khoản ${u.username}`,
      "info",
    );
    render();
  }
}

function renderAdminCategories() {
  const container = document.createElement("div");
  const categories = DB.getCategories();

  container.innerHTML = `
    <div class="adm-box">
        <div class="adm-box-title">
            <div>
                <h2>Quản lý các loại sản phẩm</h2>
                <p>Thêm mới, sửa tên loại hoặc Ẩn/Hiện loại sản phẩm khỏi cửa hàng</p>
            </div>
            <button onclick="openModal('add-category')" class="adm-btn adm-btn-primary">
                <i class="ri-add-line"></i> Thêm loại mới
            </button>
        </div>

        <div class="adm-table-wrapper">
            <table class="adm-table">
                <thead>
                    <tr>
                        <th>Mã Loại</th>
                        <th>Tên Loại Sản Phẩm</th>
                        <th>Trạng thái hiển thị</th>
                        <th style="text-align: right;">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    ${categories
                      .map(
                        (c) => `
                        <tr>
                            <td>${c.id}</td>
                            <td><strong>${c.name}</strong></td>
                            <td>
                                ${c.active ? '<span class="status-badge done">Đang hiển thị</span>' : '<span class="status-badge cancelled">Đã ẩn</span>'}
                            </td>
                            <td style="text-align: right;">
                                <button onclick="openModal('edit-category', '${c.id}')" class="adm-btn adm-btn-secondary">Sửa</button>
                                <button onclick="toggleCategoryActive('${c.id}')" class="adm-btn ${c.active ? "adm-btn-danger" : "adm-btn-success"}">
                                    ${c.active ? "Ẩn" : "Hiện"}
                                </button>
                            </td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    </div>
  `;
  return container;
}

function toggleCategoryActive(id) {
  const categories = DB.getCategories();
  const c = categories.find((x) => x.id === id);
  if (c) {
    c.active = !c.active;
    DB.saveCategories(categories);
    showNotification(
      `Đã ${c.active ? "hiển thị" : "ẩn"} loại sản phẩm`,
      "info",
    );
    render();
  }
}

function renderAdminProducts() {
  const container = document.createElement("div");
  const products = DB.getProducts();
  const categories = DB.getCategories();

  container.innerHTML = `
    <div class="adm-box">
        <div class="adm-box-title">
            <div>
                <h2>Danh sách sản phẩm thú y</h2>
                <p>Quản lý toàn bộ mặt hàng thuốc, vắc xin và đồ dùng</p>
            </div>
            <button onclick="openModal('add-product')" class="adm-btn adm-btn-primary">
                <i class="ri-add-line"></i> Thêm sản phẩm mới
            </button>
        </div>

        <div class="adm-table-wrapper">
            <table class="adm-table">
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>Mã SP</th>
                        <th>Tên sản phẩm</th>
                        <th>Loại</th>
                        <th>Giá vốn</th>
                        <th>Tồn kho</th>
                        <th>Trạng thái</th>
                        <th style="text-align: right;">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    ${products
                      .map((p) => {
                        const catName =
                          (categories.find((c) => c.id === p.catId) || {})
                            .name || "Khác";
                        return `
                            <tr>
                                <td>
                                    <img src="${p.image}" class="w-10 h-10 object-cover rounded bg-slate-100" onerror="this.src='https://placehold.co/100x100'">
                                </td>
                                <td>${p.code}</td>
                                <td><strong>${p.name}</strong></td>
                                <td>${catName}</td>
                                <td style="font-weight: bold; color: #059669;">${formatVND(p.importPrice)}</td>
                                <td><b style="color: ${p.stock < 10 ? "#dc2626" : "#28282c"}">${p.stock}</b></td>
                                <td>
                                    ${p.active ? '<span class="status-badge done">Kinh doanh</span>' : '<span class="status-badge cancelled">Tạm ngưng</span>'}
                                </td>
                                <td style="text-align: right;">
                                    <button onclick="openModal('edit-product', '${p.id}')" class="adm-btn adm-btn-secondary">Sửa</button>
                                    <button onclick="toggleProductActive('${p.id}')" class="adm-btn ${p.active ? "adm-btn-danger" : "adm-btn-success"}">
                                        ${p.active ? "Ẩn" : "Hiện"}
                                    </button>
                                </td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            </table>
        </div>
    </div>
  `;
  return container;
}

function toggleProductActive(id) {
  const products = DB.getProducts();
  const p = products.find((x) => x.id === id);
  if (p) {
    p.active = !p.active;
    DB.saveProducts(products);
    showNotification(`Đã ${p.active ? "hiển thị" : "ẩn"} sản phẩm`, "info");
    render();
  }
}

function renderAdminPurchases() {
  const container = document.createElement("div");
  const purchases = DB.getPurchaseOrders();

  container.innerHTML = `
    <div class="adm-box">
        <div class="adm-box-title">
            <div>
                <h2>Quản lý phiếu nhập hàng</h2>
                <p>Tạo phiếu nhập từ nhà cung cấp và hoàn tất nhập kho tự động</p>
            </div>
            <button onclick="openModal('add-purchase')" class="adm-btn adm-btn-primary">
                <i class="ri-add-line"></i> Tạo phiếu nhập mới
            </button>
        </div>

        <div class="adm-table-wrapper">
            <table class="adm-table">
                <thead>
                    <tr>
                        <th>Mã Phiếu</th>
                        <th>Ngày nhập</th>
                        <th>Số mặt hàng</th>
                        <th>Tổng tiền vốn</th>
                        <th>Trạng thái</th>
                        <th style="text-align: right;">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    ${purchases
                      .map(
                        (po) => `
                        <tr>
                            <td>${po.id}</td>
                            <td>${po.date}</td>
                            <td><strong>${po.items.length} SP</strong></td>
                            <td style="color: #059669; font-weight: bold;">${formatVND(po.totalAmount)}</td>
                            <td>
                                ${po.status === "COMPLETED" ? '<span class="status-badge done">Đã Hoàn Thành</span>' : '<span class="status-badge waiting">Phiếu Nháp</span>'}
                            </td>
                            <td style="text-align: right;">
                                ${
                                  po.status === "PENDING"
                                    ? `<button onclick="completePurchaseOrder('${po.id}')" class="adm-btn adm-btn-success">Hoàn thành & Cộng Kho</button>`
                                    : `<span style="font-size: 11px; color: #88888e; italic">Đã khóa sửa</span>`
                                }
                            </td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    </div>
  `;
  return container;
}

function completePurchaseOrder(poId) {
  const purchases = DB.getPurchaseOrders();
  const po = purchases.find((p) => p.id === poId);
  if (!po || po.status === "COMPLETED") return;

  const products = DB.getProducts();

  po.items.forEach((item) => {
    const prod = products.find((p) => p.id === item.productId);
    if (prod) {
      prod.stock += item.quantity;
      prod.importPrice = item.importPrice;
    }
  });

  po.status = "COMPLETED";

  DB.saveProducts(products);
  DB.savePurchaseOrders(purchases);

  showNotification(
    `Phiếu nhập ${po.id} đã hoàn thành. Kho hàng đã được cộng tự động!`,
    "success",
  );
  render();
}

function renderAdminPricing() {
  const container = document.createElement("div");
  const products = DB.getProducts();
  const categories = DB.getCategories();

  container.innerHTML = `
    <div class="adm-box">
        <div class="adm-box-title">
            <div>
                <h2>Điều chỉnh % lợi nhuận hàng loạt</h2>
                <p>Áp dụng mức % lợi nhuận chung cho tất cả SP thuộc 1 loại</p>
            </div>
        </div>
        <div class="flex flex-wrap gap-3">
            <select id="batch-cat-select" class="adm-select" style="min-width: 200px;">
                <option value="">-- Chọn Loại SP --</option>
                ${categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
            </select>
            <input type="number" id="batch-margin-input" placeholder="% Lợi nhuận (ví dụ: 30)" class="adm-input" style="width: 180px;">
            <button onclick="applyCategoryProfitMargin()" class="adm-btn adm-btn-primary">Áp dụng đồng loạt</button>
        </div>
    </div>

    <div class="adm-box">
        <div class="adm-box-title">
            <div>
                <h2>Quản lý giá bán từng sản phẩm</h2>
                <p>Công thức: Giá Niêm Yết = Giá Vốn * (1 + % Lợi Nhuận)</p>
            </div>
        </div>

        <div class="adm-table-wrapper">
            <table class="adm-table">
                <thead>
                    <tr>
                        <th>Mã SP</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá vốn gốc</th>
                        <th>% Lợi nhuận</th>
                        <th>Giá Bán Niêm Yết</th>
                        <th style="text-align: right;">Thay đổi % LN</th>
                    </tr>
                </thead>
                <tbody>
                    ${products
                      .map((p) => {
                        const sellingPrice = calcSellingPrice(
                          p.importPrice,
                          p.profitMargin,
                        );
                        return `
                            <tr>
                                <td>${p.code}</td>
                                <td><strong>${p.name}</strong></td>
                                <td>${formatVND(p.importPrice)}</td>
                                <td><strong style="color: #d97706;">${p.profitMargin}%</strong></td>
                                <td style="font-weight: bold; color: #047857; font-size: 13px;">${formatVND(sellingPrice)}</td>
                                <td style="text-align: right;">
                                    <div style="display: inline-flex; gap: 6px;">
                                        <input type="number" id="single-margin-${p.id}" value="${p.profitMargin}" class="adm-input" style="width: 70px; text-align: center;">
                                        <button onclick="updateSingleMargin('${p.id}')" class="adm-btn adm-btn-secondary">Lưu</button>
                                    </div>
                                </td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            </table>
        </div>
    </div>
  `;
  return container;
}

function applyCategoryProfitMargin() {
  const catId = document.getElementById("batch-cat-select").value;
  const marginVal = parseFloat(
    document.getElementById("batch-margin-input").value,
  );

  if (!catId || isNaN(marginVal)) {
    showNotification("Vui lòng chọn loại sản phẩm và nhập % hợp lệ!", "error");
    return;
  }

  const products = DB.getProducts();
  let count = 0;
  products.forEach((p) => {
    if (p.catId === catId) {
      p.profitMargin = marginVal;
      count++;
    }
  });

  DB.saveProducts(products);
  showNotification(
    `Đã cập nhật ${marginVal}% lợi nhuận cho ${count} sản phẩm!`,
    "success",
  );
  render();
}

function updateSingleMargin(productId) {
  const input = document.getElementById(`single-margin-${productId}`);
  const val = parseFloat(input.value);
  if (isNaN(val) || val < 0) {
    showNotification("Tỉ lệ % không hợp lệ!", "error");
    return;
  }

  const products = DB.getProducts();
  const p = products.find((x) => x.id === productId);
  if (p) {
    p.profitMargin = val;
    DB.saveProducts(products);
    showNotification(`Đã cập nhật giá bán cho ${p.name}`, "success");
    render();
  }
}

function renderAdminOrders() {
  const container = document.createElement("div");
  const orders = DB.getOrders();

  container.innerHTML = `
    <div class="adm-box">
        <div class="adm-box-title">
            <div>
                <h2>Danh sách đơn đặt hàng từ Khách hàng</h2>
                <p>Tra cứu đơn hàng và cập nhật trạng thái đơn</p>
            </div>
        </div>

        <div class="adm-table-wrapper">
            <table class="adm-table">
                <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Tên Khách Hàng</th>
                        <th>Số điện thoại</th>
                        <th>Ngày đặt</th>
                        <th>Tổng thanh toán</th>
                        <th>Trạng thái</th>
                        <th style="text-align: right;">Cập nhật trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders
                      .map(
                        (o) => `
                        <tr>
                            <td><strong>#${o.id}</strong></td>
                            <td>${o.customerName}</td>
                            <td>${o.phone}</td>
                            <td style="font-size: 11px; color: #88888e;">${o.date}</td>
                            <td style="font-weight: bold; color: #047857;">${formatVND(o.totalAmount)}</td>
                            <td>${renderOrderStatusBadge(o.status)}</td>
                            <td style="text-align: right;">
                                <select onchange="updateOrderStatus('${o.id}', this.value)" class="adm-select" style="font-weight: bold;">
                                    <option value="NEW" ${o.status === "NEW" ? "selected" : ""}>Mới đặt</option>
                                    <option value="PROCESSING" ${o.status === "PROCESSING" ? "selected" : ""}>Đã xử lý</option>
                                    <option value="SHIPPED" ${o.status === "SHIPPED" ? "selected" : ""}>Đang giao</option>
                                    <option value="COMPLETED" ${o.status === "COMPLETED" ? "selected" : ""}>Hoàn thành</option>
                                    <option value="CANCELLED" ${o.status === "CANCELLED" ? "selected" : ""}>Đã Hủy</option>
                                </select>
                            </td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    </div>
  `;
  return container;
}

function updateOrderStatus(orderId, newStatus) {
  const orders = DB.getOrders();
  const o = orders.find((x) => x.id === orderId);
  if (o) {
    o.status = newStatus;
    DB.saveOrders(orders);
    showNotification(
      `Đã cập nhật đơn hàng #${orderId} sang trạng thái: ${newStatus}`,
      "success",
    );
    render();
  }
}

function renderAdminStock() {
  const container = document.createElement("div");
  const products = DB.getProducts();
  const categories = DB.getCategories();
  const lowStockProducts = products.filter((p) => p.stock < 10);

  container.innerHTML = `
    ${
      lowStockProducts.length > 0
        ? `<div class="adm-box" style="border-color: #fca5a5; background: #fff5f5; margin-bottom: 18px;">
            <div class="flex items-center gap-3">
                <i class="ri-error-warning-fill text-red-600 text-3xl"></i>
                <div>
                    <strong style="color: #991b1b; font-size: 14px;">Cảnh Báo Khẩn: Có ${lowStockProducts.length} sản phẩm số lượng tồn dưới 10 đơn vị!</strong>
                    <p style="color: #b91c1c; font-size: 11px; margin-top: 2px;">Cần lập thêm phiếu nhập hàng để chuẩn bị thuốc cung ứng kịp thời.</p>
                </div>
            </div>
        </div>`
        : ""
    }

    <div class="adm-box">
        <div class="adm-box-title">
            <div>
                <h2>Báo cáo số lượng tồn kho theo sản phẩm</h2>
                <p>Xem danh sách kiểm kê và đánh giá mức độ an toàn tồn kho</p>
            </div>
        </div>

        <div class="adm-table-wrapper">
            <table class="adm-table">
                <thead>
                    <tr>
                        <th>Mã SP</th>
                        <th>Tên sản phẩm</th>
                        <th>Loại</th>
                        <th>Số lượng tồn hiện tại</th>
                        <th>Mức độ tồn kho</th>
                    </tr>
                </thead>
                <tbody>
                    ${products
                      .map((p) => {
                        const catName =
                          (categories.find((c) => c.id === p.catId) || {})
                            .name || "Khác";
                        const isLow = p.stock < 10;
                        return `
                            <tr>
                                <td>${p.code}</td>
                                <td><strong>${p.name}</strong></td>
                                <td>${catName}</td>
                                <td><strong style="font-size: 13px; color: ${isLow ? "#dc2626" : "#28282c"}">${p.stock} đơn vị</strong></td>
                                <td>
                                    ${isLow ? `<span class="status-badge cancelled">Sắp Hết Hàng</span>` : `<span class="status-badge done">An Toàn</span>`}
                                </td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            </table>
        </div>
    </div>
  `;
  return container;
}

//admin
// State Manager & Navigation
const state = {
  currentUser: JSON.parse(sessionStorage.getItem("vet_current_user") || "null"),
  isAdminLoggedIn: sessionStorage.getItem("vet_admin_logged_in") === "true",
  currentTab: "home",
  cart: JSON.parse(localStorage.getItem("vet_cart") || "[]"),

  filter: {
    search: "",
    catId: "",
    minPrice: "",
    maxPrice: "",
    page: 1,
    pageSize: 6,
  },

  activeModal: null,
  modalData: null,
};

function saveCart() {
  localStorage.setItem("vet_cart", JSON.stringify(state.cart));
}

function setCurrentUser(user) {
  state.currentUser = user;
  if (user) sessionStorage.setItem("vet_current_user", JSON.stringify(user));
  else sessionStorage.removeItem("vet_current_user");
}

function setAdminLogin(status) {
  state.isAdminLoggedIn = status;
  sessionStorage.setItem("vet_admin_logged_in", status ? "true" : "false");
}

function showNotification(msg, type = "info") {
  const toast = document.createElement("div");
  const bg =
    type === "error"
      ? "bg-red-600"
      : type === "success"
        ? "bg-emerald-600"
        : "bg-slate-800";
  toast.className = `fixed bottom-5 right-5 ${bg} text-white px-5 py-3 rounded-lg shadow-xl z-50 flex items-center space-x-2 transition-all duration-300 transform translate-y-2 opacity-0`;
  toast.innerHTML = `<i class="ph ${type === "error" ? "ph-warning-circle" : "ph-check-circle"} text-xl"></i><span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  }, 50);
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function navigateTo(tab) {
  state.currentTab = tab;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleSidebarCollapse() {
  document.body.classList.toggle("sidebar-collapsed");
}

function toggleMobileSidebar() {
  const sb = document.getElementById("adminSidebar");
  if (sb) sb.classList.toggle("open");
}

// Render System
function render() {
  const root = document.getElementById("app-root");
  if (!root) return;
  root.innerHTML = "";

  if (
    state.currentTab.startsWith("admin-") &&
    state.currentTab !== "admin-login" &&
    !state.isAdminLoggedIn
  ) {
    state.currentTab = "admin-login";
  }

  if (state.currentTab.startsWith("admin-")) {
    root.appendChild(renderAdminLayout());
  } else {
    root.appendChild(renderClientLayout());
  }

  if (state.activeModal) {
    root.appendChild(renderModal());
  }
}

// Client Views

function renderOrderStatusBadge(status) {
  const maps = {
    NEW: { label: "Mới đặt", bg: "status-badge waiting" },
    PROCESSING: { label: "Đã xử lý", bg: "status-badge shipping" },
    SHIPPED: { label: "Đang giao", bg: "status-badge shipping" },
    COMPLETED: { label: "Hoàn thành", bg: "status-badge done" },
    CANCELLED: { label: "Đã hủy", bg: "status-badge cancelled" },
  };
  const s = maps[status] || { label: status, bg: "status-badge waiting" };
  return `<span class="${s.bg}">${s.label}</span>`;
}

// Modal Handlers
function openModal(modalName, data = null) {
  state.activeModal = modalName;
  state.modalData = data;
  render();
}

function closeModal() {
  state.activeModal = null;
  state.modalData = null;
  render();
}

function openProductDetail(productId) {
  const prod = DB.getProducts().find((p) => p.id === productId);
  if (prod) {
    openModal("product-detail", prod);
  }
}

function renderModal() {
  const backdrop = document.createElement("div");
  backdrop.className =
    "fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto";

  const modalBox = document.createElement("div");
  modalBox.className =
    "bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 my-8";

  const closeBtn = document.createElement("button");
  closeBtn.className =
    "absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1";
  closeBtn.innerHTML = '<i class="ph ph-x text-xl font-bold"></i>';
  closeBtn.onclick = closeModal;
  modalBox.appendChild(closeBtn);

  if (state.activeModal === "login") {
    modalBox.appendChild(renderLoginModalContent());
  } else if (state.activeModal === "register") {
    modalBox.appendChild(renderRegisterModalContent());
  } else if (state.activeModal === "product-detail") {
    modalBox.appendChild(renderProductDetailModalContent(state.modalData));
  } else if (state.activeModal === "order-success") {
    modalBox.appendChild(renderOrderSuccessModalContent(state.modalData));
  } else if (
    state.activeModal === "add-category" ||
    state.activeModal === "edit-category"
  ) {
    modalBox.appendChild(renderCategoryFormModalContent(state.modalData));
  } else if (
    state.activeModal === "add-product" ||
    state.activeModal === "edit-product"
  ) {
    modalBox.appendChild(renderProductFormModalContent(state.modalData));
  } else if (state.activeModal === "add-purchase") {
    modalBox.appendChild(renderPurchaseFormModalContent());
  }

  backdrop.appendChild(modalBox);
  return backdrop;
}

function renderProductDetailModalContent(product) {
  const div = document.createElement("div");
  div.className = "space-y-4";
  const price = calcSellingPrice(product.importPrice, product.profitMargin);
  const category = DB.getCategories().find((c) => c.id === product.catId);

  div.innerHTML = `
    <div class="flex flex-col sm:flex-row gap-4">
        <img src="${product.image}" class="w-full sm:w-48 h-48 object-cover rounded-xl bg-slate-100" onerror="this.src='https://placehold.co/400x300'">
        <div class="space-y-2 flex-grow">
            <span class="text-xs bg-vet-100 text-vet-800 font-semibold px-2 py-0.5 rounded">${category?.name || "Thú y"}</span>
            <h3 class="text-lg font-bold text-slate-800">${product.name}</h3>
            <p class="text-xs text-slate-500 font-mono">Mã SP: ${product.code}</p>
            <div class="pt-2">
                <span class="text-xs text-slate-400 block">Giá niêm yết</span>
                <span class="text-2xl font-extrabold text-vet-700">${formatVND(price)}</span>
            </div>
            <p class="text-xs text-slate-600">Tồn kho: <span class="font-bold">${product.stock}</span> sản phẩm</p>
        </div>
    </div>

    <div class="border-t pt-3">
        <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">Mô tả & Công dụng thú y:</h4>
        <p class="text-xs text-slate-600 leading-relaxed">${product.desc}</p>
    </div>

    <div class="pt-2">
        <button onclick="addToCart('${product.id}'); closeModal();" ${product.stock <= 0 ? "disabled" : ""} class="w-full py-3 bg-vet-600 hover:bg-vet-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow transition flex items-center justify-center space-x-2">
            <i class="ph ph-shopping-cart text-xl"></i>
            <span>Thêm vào giỏ hàng ngay</span>
        </button>
    </div>
  `;
  return div;
}

function renderOrderSuccessModalContent(order) {
  const div = document.createElement("div");
  div.className = "space-y-4 text-center";
  div.innerHTML = `
    <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <i class="ph ph-check-circle text-4xl"></i>
    </div>
    <h3 class="text-xl font-bold text-slate-800">Đặt Hàng Thành Công!</h3>
    <p class="text-xs text-slate-500">Mã hóa đơn đơn hàng của bạn là <span class="font-bold text-slate-800">#${order.id}</span></p>

    <div class="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2 border border-slate-200">
        <div class="flex justify-between border-b pb-2 font-semibold">
            <span>Người nhận: ${order.customerName}</span>
            <span>SĐT: ${order.phone}</span>
        </div>
        <p class="text-slate-600">Địa chỉ giao: ${order.address}</p>
        <p class="text-slate-600">Phương thức: <span class="font-semibold text-slate-800">${order.paymentMethod}</span></p>
        <div class="border-t pt-2 space-y-1">
            ${order.items
              .map(
                (i) => `
                <div class="flex justify-between text-slate-700">
                    <span>${i.productName} x ${i.quantity}</span>
                    <span>${formatVND(i.price * i.quantity)}</span>
                </div>
            `,
              )
              .join("")}
        </div>
        <div class="border-t pt-2 flex justify-between font-bold text-slate-900 text-sm">
            <span>Tổng hóa đơn:</span>
            <span class="text-vet-700">${formatVND(order.totalAmount)}</span>
        </div>
    </div>

    <button onclick="closeModal(); navigateTo('orders');" class="w-full py-2.5 bg-vet-600 text-white font-bold rounded-lg text-sm shadow">Xem Đơn Hàng Của Tôi</button>
  `;
  return div;
}

function renderCategoryFormModalContent(catId) {
  const categories = DB.getCategories();
  const editCat = categories.find((c) => c.id === catId);

  const div = document.createElement("div");
  div.className = "space-y-4";
  div.innerHTML = `
    <h3 class="text-lg font-bold text-slate-800">${editCat ? "Sửa Loại Sản Phẩm" : "Thêm Loại Sản Phẩm Mới"}</h3>
    <form id="cat-form" class="space-y-3">
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Mã Loại</label>
            <input type="text" id="cat-id" value="${editCat ? editCat.id : "CAT" + Math.floor(10 + Math.random() * 90)}" ${editCat ? "readonly" : ""} class="w-full p-2 border rounded-lg text-sm bg-slate-50">
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Tên loại sản phẩm</label>
            <input type="text" id="cat-name" value="${editCat ? editCat.name : ""}" required class="w-full p-2 border rounded-lg text-sm">
        </div>
        <button type="submit" class="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg text-sm shadow">Lưu Loại Sản Phẩm</button>
    </form>
  `;

  setTimeout(() => {
    const form = div.querySelector("#cat-form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const id = div.querySelector("#cat-id").value;
        const name = div.querySelector("#cat-name").value;

        if (editCat) {
          editCat.name = name;
        } else {
          categories.push({ id, name, active: true });
        }
        DB.saveCategories(categories);
        showNotification("Đã lưu thông tin loại sản phẩm!", "success");
        closeModal();
      };
    }
  }, 0);

  return div;
}

function renderProductFormModalContent(productId) {
  const products = DB.getProducts();
  const categories = DB.getCategories();
  const editProd = products.find((p) => p.id === productId);

  const div = document.createElement("div");
  div.className = "space-y-4";
  div.innerHTML = `
    <h3 class="text-lg font-bold text-slate-800">${editProd ? "Sửa Thông Tin Sản Phẩm" : "Thêm Sản Phẩm Thú Y Mới"}</h3>
    <form id="product-form" class="space-y-3">
        <div class="grid grid-cols-2 gap-2">
            <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Mã sản phẩm</label>
                <input type="text" id="pf-code" value="${editProd ? editProd.code : "VET-" + Math.floor(100 + Math.random() * 900)}" required class="w-full p-2 border rounded-lg text-xs">
            </div>
            <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Loại sản phẩm</label>
                <select id="pf-cat" required class="w-full p-2 border rounded-lg text-xs">
                    ${categories.map((c) => `<option value="${c.id}" ${editProd && editProd.catId === c.id ? "selected" : ""}>${c.name}</option>`).join("")}
                </select>
            </div>
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Tên sản phẩm</label>
            <input type="text" id="pf-name" value="${editProd ? editProd.name : ""}" required class="w-full p-2 border rounded-lg text-xs">
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Link Ảnh Placeholder / URL</label>
            <input type="text" id="pf-image" value="${editProd ? editProd.image : "https://placehold.co/400x300/059669/ffffff?text=Thuoc+Thu+Y"}" class="w-full p-2 border rounded-lg text-xs">
        </div>
        <div class="grid grid-cols-3 gap-2">
            <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Giá nhập gốc</label>
                <input type="number" id="pf-import-price" value="${editProd ? editProd.importPrice : 50000}" required class="w-full p-2 border rounded-lg text-xs">
            </div>
            <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">% Lợi nhuận</label>
                <input type="number" id="pf-margin" value="${editProd ? editProd.profitMargin : 25}" required class="w-full p-2 border rounded-lg text-xs">
            </div>
            <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Số lượng tồn</label>
                <input type="number" id="pf-stock" value="${editProd ? editProd.stock : 50}" required class="w-full p-2 border rounded-lg text-xs">
            </div>
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Mô tả công dụng</label>
            <textarea id="pf-desc" class="w-full p-2 border rounded-lg text-xs" rows="3">${editProd ? editProd.desc : ""}</textarea>
        </div>
        <button type="submit" class="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg text-sm shadow">Lưu Sản Phẩm</button>
    </form>
  `;

  setTimeout(() => {
    const form = div.querySelector("#product-form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const code = div.querySelector("#pf-code").value;
        const catId = div.querySelector("#pf-cat").value;
        const name = div.querySelector("#pf-name").value;
        const image = div.querySelector("#pf-image").value;
        const importPrice = parseFloat(
          div.querySelector("#pf-import-price").value,
        );
        const profitMargin = parseFloat(div.querySelector("#pf-margin").value);
        const stock = parseInt(div.querySelector("#pf-stock").value);
        const desc = div.querySelector("#pf-desc").value;

        if (editProd) {
          editProd.code = code;
          editProd.catId = catId;
          editProd.name = name;
          editProd.image = image;
          editProd.importPrice = importPrice;
          editProd.profitMargin = profitMargin;
          editProd.stock = stock;
          editProd.desc = desc;
        } else {
          products.push({
            id: "P" + Math.floor(100 + Math.random() * 900),
            code,
            catId,
            name,
            image,
            importPrice,
            profitMargin,
            stock,
            desc,
            active: true,
          });
        }
        DB.saveProducts(products);
        showNotification("Đã cập nhật danh mục sản phẩm!", "success");
        closeModal();
      };
    }
  }, 0);

  return div;
}

function renderPurchaseFormModalContent() {
  const products = DB.getProducts();

  const div = document.createElement("div");
  div.className = "space-y-4";
  div.innerHTML = `
    <h3 class="text-lg font-bold text-slate-800">Tạo Phiếu Nhập Hàng Mới</h3>
    <form id="purchase-form" class="space-y-3">
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Chọn Sản Phẩm Nhập Kho</label>
            <select id="po-product" class="w-full p-2 border rounded-lg text-xs">
                ${products.map((p) => `<option value="${p.id}">${p.name} (Tồn hiện tại: ${p.stock})</option>`).join("")}
            </select>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Số lượng nhập</label>
                <input type="number" id="po-qty" value="50" min="1" required class="w-full p-2 border rounded-lg text-xs">
            </div>
            <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Giá nhập mỗi đơn vị (VND)</label>
                <input type="number" id="po-price" value="100000" required class="w-full p-2 border rounded-lg text-xs">
            </div>
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Ghi chú phiếu nhập</label>
            <input type="text" id="po-note" placeholder="Ví dụ: Nhập hàng lô vắc xin mới..." class="w-full p-2 border rounded-lg text-xs">
        </div>
        <button type="submit" class="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg text-sm shadow">Tạo Phiếu Nhập</button>
    </form>
  `;

  setTimeout(() => {
    const form = div.querySelector("#purchase-form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const productId = div.querySelector("#po-product").value;
        const qty = parseInt(div.querySelector("#po-qty").value);
        const price = parseFloat(div.querySelector("#po-price").value);
        const note = div.querySelector("#po-note").value;

        const purchases = DB.getPurchaseOrders();
        const newPO = {
          id:
            "PO" +
            new Date().toISOString().slice(0, 10).replace(/-/g, "") +
            Math.floor(10 + Math.random() * 90),
          date: new Date().toISOString().substring(0, 10),
          items: [{ productId, quantity: qty, importPrice: price }],
          totalAmount: qty * price,
          status: "PENDING",
          note: note,
        };

        purchases.unshift(newPO);
        DB.savePurchaseOrders(purchases);
        showNotification("Đã tạo phiếu nhập nháp thành công!", "success");
        closeModal();
      };
    }
  }, 0);

  return div;
}

window.onload = function () {
  render();
};
