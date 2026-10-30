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
                            <td>${c.active ? '<span class="status-badge done">Đang hiển thị</span>' : '<span class="status-badge cancelled">Đã ẩn</span>'}</td>
                            <td style="text-align: right;">
                                <button onclick="openModal('edit-category', '${c.id}')" class="adm-btn adm-btn-secondary">Sửa</button>
                                <button onclick="toggleCategoryActive('${c.id}')" class="adm-btn ${c.active ? "adm-btn-danger" : "adm-btn-success"}">${c.active ? "Ẩn" : "Hiện"}</button>
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
    renderApp();
  }
}
