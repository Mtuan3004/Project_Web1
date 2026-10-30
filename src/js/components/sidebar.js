function renderSidebar() {
  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  sidebar.id = "adminSidebar";
  sidebar.innerHTML = `
    <div class="logo">
        <img src="../img/icon/favicon.ico" alt="ảnh logo" class="logo-mark"><i class="ri-shield-cross-line"></i></img>
        <div>
            <h2>PetPet</h2>
            <p>ADMIN CENTER</p>
        </div>
    </div>
    <nav>
        <p class="menu-label">TỔNG QUAN</p>
        <button onclick="navigateTo('admin-dashboard')" class="menu-item ${state.currentTab === "admin-dashboard" ? "active" : ""}">
            <div class="menu-icon"><i class="ri-dashboard-line"></i></div>
            <span class="menu-text">Tổng quan</span>
        </button>
        <p class="menu-label">QUẢN LÝ KHO & HÀNG</p>
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
        <p class="menu-label">KHÁCH HÀNG & ĐƠN</p>
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
    <button class="collapse-button" onclick="document.body.classList.toggle('sidebar-collapsed')">
        <span class="collapse-arrow">‹</span>
        <span class="collapse-text">Thu gọn menu</span>
    </button>
  `;
  return sidebar;
}
