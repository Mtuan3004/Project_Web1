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
                            <td>${po.status === "COMPLETED" ? '<span class="status-badge done">Đã Hoàn Thành</span>' : '<span class="status-badge waiting">Phiếu Nháp</span>'}</td>
                            <td style="text-align: right;">${po.status === "COMPLETED" ? '<span style="color: #88888e; font-size: 11px;">Đã khóa sửa</span>' : ""}</td>
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
