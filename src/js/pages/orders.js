function renderAdminOrders() {
  const container = document.createElement("div");
  const orders = DB.getOrders();

  container.innerHTML = `
    <div class="adm-box">
        <div class="adm-box-title">
            <div>
                <h2>Danh sách đơn đặt hàng</h2>
                <p>Tra cứu đơn hàng và cập nhật trạng thái đơn</p>
            </div>
        </div>
        <div class="adm-table-wrapper">
            <table class="adm-table">
                <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>SĐT</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th style="text-align: right;">Cập nhật</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders
                      .map(
                        (o) => `
                        <tr>
                            <td><b>#${o.id}</b></td>
                            <td>${o.customerName}</td>
                            <td>${o.phone}</td>
                            <td style="font-size: 11px; color: #88888e;">${o.date}</td>
                            <td style="color: #047857; font-weight: bold;">${formatVND(o.totalAmount)}</td>
                            <td><span class="status-badge done">${o.status}</span></td>
                            <td style="text-align: right;">
                                <select onchange="updateOrderStatus('${o.id}', this.value)" class="adm-select font-bold">
                                    <option value="NEW" ${o.status === "NEW" ? "selected" : ""}>Mới đặt</option>
                                    <option value="COMPLETED" ${o.status === "COMPLETED" ? "selected" : ""}>Hoàn thành</option>
                                    <option value="CANCELLED" ${o.status === "CANCELLED" ? "selected" : ""}>Đã hủy</option>
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

function updateOrderStatus(id, newStatus) {
  const orders = DB.getOrders();
  const o = orders.find((x) => x.id === id);
  if (o) {
    o.status = newStatus;
    DB.saveOrders(orders);
    renderApp();
  }
}
