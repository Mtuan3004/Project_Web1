function renderAdminStock() {
  const container = document.createElement("div");
  const products = DB.getProducts();
  const categories = DB.getCategories();
  const lowStockProducts = products.filter((p) => p.stock < 10);

  container.innerHTML = `
    ${
      lowStockProducts.length > 0
        ? `
    <div class="adm-box mb-4" style="border-color: #fca5a5; background: #fff5f5;">
        <div class="flex items-center gap-3">
            <i class="ri-error-warning-fill text-red-600 text-3xl"></i>
            <div>
                <strong style="color: #991b1b; font-size: 13px;">Cảnh Báo Khẩn: Có ${lowStockProducts.length} sản phẩm số lượng tồn dưới 10 đơn vị!</strong>
                <p class="text-xs text-slate-600 mt-1">Cần lập thêm phiếu nhập hàng để chuẩn bị thuốc cung ứng kịp thời.</p>
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
                                <td><b style="color: ${isLow ? "#dc2626" : "#28282c"}">${p.stock} đơn vị</b></td>
                                <td>${isLow ? '<span class="status-badge cancelled">Sắp Hết Hàng</span>' : '<span class="status-badge done">An Toàn</span>'}</td>
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
