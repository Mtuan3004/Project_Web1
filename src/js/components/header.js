function renderHeader() {
  const titles = {
    "admin-dashboard": "Tổng quan & Báo cáo",
    "admin-users": "Quản lý Người dùng / Khách hàng",
    "admin-categories": "Quản lý Loại Sản Phẩm",
    "admin-products": "Quản lý Danh Mục Sản Phẩm",
    "admin-purchases": "Quản lý Nhập Hàng",
    "admin-pricing": "Quản lý Giá Bán & Tỉ Lệ Lợi Nhuận",
    "admin-orders": "Quản lý Đơn Đặt Hàng",
    "admin-stock": "Báo Cáo Tồn Kho",
  };

  const header = document.createElement("header");
  header.className = "admin-header";
  header.innerHTML = `
    <div>
        <h1>${titles[state.currentTab] || "Admin Center"}</h1>
        <p>Xin chào, chúc bạn một ngày quản trị làm việc hiệu quả!</p>
    </div>
    <div class="admin-info">
        <span>AD</span>
        <div>
            <strong>Admin Quản Trị</strong>
            <small>Chủ hệ thống VetCare</small>
        </div>
        <button onclick="logoutAdmin()" class="adm-btn adm-btn-secondary ml-3"><i class="ri-logout-box-r-line"></i> Thoát</button>
    </div>
  `;
  return header;
}
