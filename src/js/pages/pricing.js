function renderAdminPricing() {
  const container = document.createElement("div");
  const products = DB.getProducts();

  container.innerHTML = `
    <div class="adm-box mb-6 p-4 border rounded-lg bg-white">
        <div class="mb-3">
            <h3 class="font-bold text-sm text-slate-800">Điều chỉnh % lợi nhuận hàng loạt</h3>
            <p class="text-xs text-slate-500">Áp dụng mức % lợi nhuận chung cho tất cả sản phẩm</p>
        </div>
        <div class="flex gap-3 items-center">
            <input type="number" id="batch-margin-val" placeholder="% Lợi nhuận (vd: 30)" class="adm-input" style="width: 200px;">
            <button onclick="applyBatchMargin()" class="adm-btn adm-btn-primary">Áp dụng đồng loạt</button>
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
                                <td style="color: #047857; font-weight: bold;">${formatVND(sellingPrice)}</td>
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

function updateSingleMargin(productId) {
  const input = document.getElementById(`single-margin-${productId}`);
  const val = parseFloat(input.value);
  if (isNaN(val) || val < 0) return;

  const products = DB.getProducts();
  const p = products.find((x) => x.id === productId);
  if (p) {
    p.profitMargin = val;
    DB.saveProducts(products);
    renderApp();
  }
}

function applyBatchMargin() {
  const val = parseFloat(document.getElementById("batch-margin-val").value);
  if (isNaN(val) || val < 0) {
    alert("Vui lòng nhập số % hợp lệ!");
    return;
  }
  const products = DB.getProducts();
  products.forEach((p) => (p.profitMargin = val));
  DB.saveProducts(products);
  alert(`Đã áp dụng ${val}% lợi nhuận cho toàn bộ sản phẩm!`);
  renderApp();
}
