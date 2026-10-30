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
                                <td><img src="${p.image}" class="w-10 h-10 object-cover rounded bg-slate-100" onerror="this.src='https://placehold.co/100x100'"></td>
                                <td>${p.code}</td>
                                <td><strong>${p.name}</strong></td>
                                <td>${catName}</td>
                                <td style="color: #059669; font-weight: bold;">${formatVND(p.importPrice)}</td>
                                <td><b style="color: ${p.stock < 10 ? "#dc2626" : "#28282c"}">${p.stock}</b></td>
                                <td>${p.active ? '<span class="status-badge done">Kinh doanh</span>' : '<span class="status-badge cancelled">Tạm ngưng</span>'}</td>
                                <td style="text-align: right;">
                                    <button onclick="openModal('edit-product', '${p.id}')" class="adm-btn adm-btn-secondary">Sửa</button>
                                    <button onclick="toggleProductActive('${p.id}')" class="adm-btn ${p.active ? "adm-btn-danger" : "adm-btn-success"}">${p.active ? "Ẩn" : "Hiện"}</button>
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
    renderApp();
  }
}
