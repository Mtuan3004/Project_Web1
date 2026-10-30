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
                            <td>${u.locked ? '<span class="status-badge cancelled">Đã Khóa</span>' : '<span class="status-badge done">Hoạt động</span>'}</td>
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
    alert(`Đã reset mật khẩu cho khách hàng ${u.username} về '123456'`);
    renderApp();
  }
}

function toggleLockUser(userId) {
  const users = DB.getUsers();
  const u = users.find((x) => x.id === userId);
  if (u) {
    u.locked = !u.locked;
    DB.saveUsers(users);
    renderApp();
  }
}
