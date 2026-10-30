function renderAdminDashboard() {
  const el = document.createElement("div");
  el.className = "space-y-6";
  const products = DB.getProducts();
  const orders = DB.getOrders();
  const users = DB.getUsers();
  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockProducts = products.filter((p) => p.stock < 10);

  el.innerHTML = `
    <section class="stat-list">
        <article class="stat-card">
            <div class="stat-icon green"><i class="ri-money-dollar-circle-line"></i></div>
            <div><p>Doanh thu (Đã hoàn thành)</p><h2>${formatVND(totalRevenue)}</h2></div>
        </article>
        <article class="stat-card">
            <div class="stat-icon yellow"><i class="ri-shopping-basket-2-line"></i></div>
            <div><p>Tổng đơn hàng</p><h2>${orders.length}</h2></div>
        </article>
        <article class="stat-card">
            <div class="stat-icon blue"><i class="ri-user-line"></i></div>
            <div><p>Khách hàng đăng ký</p><h2>${users.length}</h2></div>
        </article>
        <article class="stat-card">
            <div class="stat-icon red"><i class="ri-alert-line"></i></div>
            <div><p>Cảnh báo sắp hết hàng</p><h2>${lowStockProducts.length} SP</h2></div>
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
                  lowStockProducts
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
