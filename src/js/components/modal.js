function openModal(type, id = null) {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center border-b pb-3">
                <h3 class="font-bold text-lg text-slate-800" id="modal-title-text">Biểu mẫu thao tác</h3>
                <button onclick="closeModal()" class="text-slate-400 hover:text-slate-700 text-xl font-bold">&times;</button>
            </div>
            <div id="modal-body-content"></div>
        </div>
    </div>
  `;

  const bodyContent = modalRoot.querySelector("#modal-body-content");
  const titleText = modalRoot.querySelector("#modal-title-text");

  if (type === "add-category") {
    titleText.innerText = "Thêm Loại Sản Phẩm Mới";
    bodyContent.innerHTML = `
      <form id="form-add-cat" class="space-y-3">
          <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Mã Loại (VD: CAT06)</label>
              <input type="text" id="cat-id" required class="adm-input w-full">
          </div>
          <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Tên Loại Sản Phẩm</label>
              <input type="text" id="cat-name" required class="adm-input w-full">
          </div>
          <div class="flex justify-end gap-2 pt-2">
              <button type="button" onclick="closeModal()" class="adm-btn adm-btn-secondary">Hủy</button>
              <button type="submit" class="adm-btn adm-btn-primary">Lưu loại mới</button>
          </div>
      </form>
    `;
    bodyContent.querySelector("#form-add-cat").onsubmit = (e) => {
      e.preventDefault();
      const catId = document.getElementById("cat-id").value.trim();
      const catName = document.getElementById("cat-name").value.trim();
      const categories = DB.getCategories();
      if (categories.some((c) => c.id === catId)) {
        alert("Mã loại sản phẩm đã tồn tại!");
        return;
      }
      categories.push({ id: catId, name: catName, active: true });
      DB.saveCategories(categories);
      closeModal();
      renderApp();
    };
  } else if (type === "edit-category") {
    titleText.innerText = "Chỉnh Sửa Loại Sản Phẩm";
    const categories = DB.getCategories();
    const cat = categories.find((c) => c.id === id);
    bodyContent.innerHTML = `
      <form id="form-edit-cat" class="space-y-3">
          <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Mã Loại</label>
              <input type="text" id="cat-id" value="${cat.id}" disabled class="adm-input w-full bg-slate-100">
          </div>
          <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Tên Loại Sản Phẩm</label>
              <input type="text" id="cat-name" value="${cat.name}" required class="adm-input w-full">
          </div>
          <div class="flex justify-end gap-2 pt-2">
              <button type="button" onclick="closeModal()" class="adm-btn adm-btn-secondary">Hủy</button>
              <button type="submit" class="adm-btn adm-btn-primary">Cập nhật</button>
          </div>
      </form>
    `;
    bodyContent.querySelector("#form-edit-cat").onsubmit = (e) => {
      e.preventDefault();
      cat.name = document.getElementById("cat-name").value.trim();
      DB.saveCategories(categories);
      closeModal();
      renderApp();
    };
  } else if (type === "add-product") {
    titleText.innerText = "Thêm Sản Phẩm Mới";
    const categories = DB.getCategories();
    bodyContent.innerHTML = `
      <form id="form-add-prod" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
              <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Mã SP</label>
                  <input type="text" id="p-code" placeholder="VET-XXX" required class="adm-input w-full">
              </div>
              <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Loại sản phẩm</label>
                  <select id="p-cat" required class="adm-select w-full">
                      ${categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
                  </select>
              </div>
          </div>
          <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Tên sản phẩm</label>
              <input type="text" id="p-name" required class="adm-input w-full">
          </div>
          <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Link Ảnh sản phẩm</label>
              <input type="text" id="p-img" value="https://placehold.co/400x300/059669/ffffff?text=VetCare" required class="adm-input w-full">
          </div>
          <div class="grid grid-cols-3 gap-3">
              <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Giá vốn (VNĐ)</label>
                  <input type="number" id="p-price" required class="adm-input w-full">
              </div>
              <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">% Lợi nhuận</label>
                  <input type="number" id="p-margin" value="25" required class="adm-input w-full">
              </div>
              <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Tồn kho</label>
                  <input type="number" id="p-stock" value="50" required class="adm-input w-full">
              </div>
          </div>
          <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Mô tả sản phẩm</label>
              <textarea id="p-desc" class="adm-input w-full" rows="2"></textarea>
          </div>
          <div class="flex justify-end gap-2 pt-2">
              <button type="button" onclick="closeModal()" class="adm-btn adm-btn-secondary">Hủy</button>
              <button type="submit" class="adm-btn adm-btn-primary">Thêm sản phẩm</button>
          </div>
      </form>
    `;
    bodyContent.querySelector("#form-add-prod").onsubmit = (e) => {
      e.preventDefault();
      const products = DB.getProducts();
      const newProd = {
        id: "P" + (products.length + 101),
        code: document.getElementById("p-code").value.trim(),
        catId: document.getElementById("p-cat").value,
        name: document.getElementById("p-name").value.trim(),
        image: document.getElementById("p-img").value.trim(),
        desc: document.getElementById("p-desc").value.trim(),
        importPrice: parseFloat(document.getElementById("p-price").value),
        profitMargin: parseFloat(document.getElementById("p-margin").value),
        stock: parseInt(document.getElementById("p-stock").value),
        active: true,
      };
      products.push(newProd);
      DB.saveProducts(products);
      closeModal();
      renderApp();
    };
  } else if (type === "edit-product") {
    titleText.innerText = "Chỉnh Sửa Sản Phẩm";
    const products = DB.getProducts();
    const categories = DB.getCategories();
    const p = products.find((x) => x.id === id);
    bodyContent.innerHTML = `
      <form id="form-edit-prod" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
              <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Mã SP</label>
                  <input type="text" id="p-code" value="${p.code}" required class="adm-input w-full">
              </div>
              <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Loại sản phẩm</label>
                  <select id="p-cat" required class="adm-select w-full">
                      ${categories.map((c) => `<option value="${c.id}" ${c.id === p.catId ? "selected" : ""}>${c.name}</option>`).join("")}
                  </select>
              </div>
          </div>
          <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Tên sản phẩm</label>
              <input type="text" id="p-name" value="${p.name}" required class="adm-input w-full">
          </div>
          <div class="grid grid-cols-2 gap-3">
              <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Giá vốn (VNĐ)</label>
                  <input type="number" id="p-price" value="${p.importPrice}" required class="adm-input w-full">
              </div>
              <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">% Lợi nhuận</label>
                  <input type="number" id="p-margin" value="${p.profitMargin}" required class="adm-input w-full">
              </div>
          </div>
          <div class="flex justify-end gap-2 pt-2">
              <button type="button" onclick="closeModal()" class="adm-btn adm-btn-secondary">Hủy</button>
              <button type="submit" class="adm-btn adm-btn-primary">Lưu thay đổi</button>
          </div>
      </form>
    `;
    bodyContent.querySelector("#form-edit-prod").onsubmit = (e) => {
      e.preventDefault();
      p.code = document.getElementById("p-code").value.trim();
      p.catId = document.getElementById("p-cat").value;
      p.name = document.getElementById("p-name").value.trim();
      p.importPrice = parseFloat(document.getElementById("p-price").value);
      p.profitMargin = parseFloat(document.getElementById("p-margin").value);
      DB.saveProducts(products);
      closeModal();
      renderApp();
    };
  }
}

function closeModal() {
  const modalRoot = document.getElementById("modal-root");
  if (modalRoot) modalRoot.innerHTML = "";
}
