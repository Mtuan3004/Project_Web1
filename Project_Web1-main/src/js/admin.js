// =====================================================================
// admin.js v5 — PETPET Admin
// Chạy được cả khi mở file trực tiếp (không cần type="module"):
//   <script src="../js/admin.js"></script>
//
// Chức năng:
//  2. Khách hàng: danh sách, reset mật khẩu, khóa/mở khóa
//  3. Loại sản phẩm: thêm, sửa, xóa/ẩn
//  4. Sản phẩm: thêm (loại, mã, tên, hình, mô tả, nhóm hiển thị), sửa, xóa/ẩn
//  5. Nhập hàng: tìm phiếu, thêm phiếu, sửa phiếu (chỉ khi chưa hoàn thành), hoàn thành
//  6. Giá bán: % lợi nhuận theo loại / theo sản phẩm, % giảm giá, tra cứu giá vốn - giá bán
//  7. Đơn hàng: tìm theo khoảng ngày + tình trạng, xem chi tiết, cập nhật tình trạng
//  8. Tồn kho: tồn theo loại tại thời điểm, cảnh báo sắp hết, báo cáo nhập-xuất-tồn
//
// Trang index (storefront.js) đọc cùng key localStorage để hiển thị sản phẩm.
// =====================================================================
(function () {
  "use strict";
  console.log("[PETPET] admin.js v5 đã chạy");

  /* ---------- Báo lỗi JS ngay trên màn hình ---------- */
  window.addEventListener("error", function (e) {
    var bar = document.getElementById("ppErrorBar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "ppErrorBar";
      bar.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:99999;background:#c62828;color:#fff;padding:10px 16px;font:14px/1.4 sans-serif";
      document.body.appendChild(bar);
    }
    bar.textContent = "Lỗi JS: " + e.message + (e.lineno ? " (dòng " + e.lineno + ")" : "");
  });

  /* =================================================================
     TIỆN ÍCH
     ================================================================= */
  const STORAGE_KEY = "petpet_admin_v3"; // storefront.js dùng cùng key này
  const DEFAULT_PW = "123456";
  const pad2 = (n) => String(n).padStart(2, "0");
  const dateStr = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const today = () => dateStr(new Date());
  const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return dateStr(d); };
  const fmtDate = (s) => { if (!s) return ""; const [y, m, d] = s.split("-"); return `${d}/${m}/${y}`; };
  const money = (n) => Math.round(Number(n || 0)).toLocaleString("vi-VN") + "đ";
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const $ = (id) => document.getElementById(id);
  const val = (id) => ($(id) ? $(id).value : "");
  const inRange = (d, from, to) => (!from || d >= from) && (!to || d <= to);
  const initials = (name) => String(name).split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase();
  function nextId(list, prefix, pad) {
    const max = list.reduce((m, r) => Math.max(m, parseInt(String(r.id).replace(/\D/g, ""), 10) || 0), 0);
    return prefix + String(max + 1).padStart(pad, "0");
  }

  /* =================================================================
     DỮ LIỆU
     ================================================================= */
  const STATUS_FLOW = {
    "Mới đặt": ["Đã xử lý", "Hủy"],
    "Đã xử lý": ["Đã giao", "Hủy"],
    "Đã giao": [],
    "Hủy": [],
  };
  const ORDER_STATUS = Object.keys(STATUS_FLOW);
  const ORDER_KIND = { "Mới đặt": "pending", "Đã xử lý": "shipping", "Đã giao": "done", "Hủy": "cancel" };

  // Nhóm hiển thị của sản phẩm trên trang chủ
  const GROUPS = [
    { v: "deal", t: "Giá tốt hôm nay" },
    { v: "combo", t: "Combo tiết kiệm" },
  ];
  const groupName = (g) => (GROUPS.find((x) => x.v === g) || GROUPS[0]).t;

  let data = null; // được nạp sau khi các hàm truy xuất bên dưới đã khai báo

  // Bổ sung các trường mới cho dữ liệu đã lưu từ phiên bản cũ
  function migrate(d) {
    d.products.forEach((p) => {
      if (p.discount == null) p.discount = 0;
      if (!p.group) p.group = "deal";
    });
    return d;
  }
  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && Array.isArray(d.categories) && Array.isArray(d.products)) return migrate(d);
      }
    } catch (e) { console.warn("Không đọc được localStorage", e); }
    return buildSeed();
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (e) { console.warn("Không lưu được localStorage (có thể do ảnh quá lớn)", e); showMessage("Không lưu được dữ liệu (bộ nhớ đầy)."); }
  }

  /* ---------- Truy xuất ---------- */
  const prod = (id) => data.products.find((p) => p.id === id);
  const cat = (id) => data.categories.find((c) => c.id === id);
  const cus = (id) => data.customers.find((c) => c.id === id);
  const ord = (id) => data.orders.find((o) => o.id === id);
  const imp = (id) => data.imports.find((i) => i.id === id);
  const catName = (id) => (cat(id) ? cat(id).name : "(đã xóa)");

  /* ---------- Tồn kho: tính từ sổ nhập-xuất (log) ---------- */
  // opts.upTo: tính đến hết ngày này; opts.before: chỉ tính trước ngày này
  function stockOf(pid, opts) {
    let s = 0;
    for (const e of data.log) {
      if (e.pid !== pid) continue;
      if (opts && opts.upTo && e.date > opts.upTo) continue;
      if (opts && opts.before && e.date >= opts.before) continue;
      s += e.type === "out" ? -e.qty : e.qty;
    }
    return s;
  }

  /* ---------- Giá bán ---------- */
  // priceOf: giá gốc (giá vốn + lợi nhuận) -> hiện gạch ngang ở trang chủ khi có giảm giá
  // sellOf : giá bán thực tế sau giảm giá -> dùng cho đơn hàng và hiển thị ở trang chủ
  const marginOf = (p) => (p.margin != null ? p.margin : (cat(p.cat) ? cat(p.cat).margin : 0) || 0);
  const discountOf = (p) => Number(p.discount) || 0;
  const priceOf = (p) => Math.round((p.cost * (1 + marginOf(p) / 100)) / 100) * 100;
  const sellOf = (p) => Math.round((priceOf(p) * (1 - discountOf(p) / 100)) / 100) * 100;

  /* ---------- Nghiệp vụ nhập hàng ---------- */
  // Hoàn thành phiếu: cộng tồn + tính giá vốn bình quân gia quyền
  function completeImport(im) {
    im.items.forEach((it) => {
      const p = prod(it.pid);
      const cur = stockOf(it.pid);
      const total = cur + it.qty;
      p.cost = total > 0 ? Math.round((cur * p.cost + it.qty * it.cost) / total) : it.cost;
      data.log.push({ date: im.date, pid: it.pid, type: "in", qty: it.qty, ref: im.id });
    });
    im.status = "Hoàn thành";
  }
  const importTotal = (im) => im.items.reduce((s, i) => s + i.qty * i.cost, 0);

  /* ---------- Nghiệp vụ đơn hàng ---------- */
  const orderTotal = (o) => o.items.reduce((s, i) => s + i.qty * i.price, 0);
  function deduct(o, date) {
    o.items.forEach((i) => data.log.push({ date, pid: i.pid, type: "out", qty: i.qty, ref: o.id }));
    o.deducted = true;
  }
  function restock(o, date) {
    o.items.forEach((i) => data.log.push({ date, pid: i.pid, type: "return", qty: i.qty, ref: "Hủy " + o.id }));
    o.deducted = false;
  }
  // Trả về chuỗi lỗi hoặc null nếu thành công
  function changeStatus(o, next) {
    if (!STATUS_FLOW[o.status].includes(next)) return "Không thể chuyển sang trạng thái này.";
    if (next === "Đã xử lý") {
      const short = o.items.filter((i) => stockOf(i.pid) < i.qty);
      if (short.length) return "Không đủ tồn kho: " + short.map((i) => `${prod(i.pid).name} (còn ${stockOf(i.pid)})`).join(", ");
      deduct(o, today()); // xuất kho khi xử lý đơn
    }
    if (next === "Hủy" && o.deducted) restock(o, today());
    o.status = next;
    return null;
  }

  /* ---------- Dữ liệu mẫu ---------- */
  function buildSeed() {
    data = {
      categories: [
        { id: "L001", name: "Thức ăn cho chó", desc: "Hạt, pate, snack cho chó", margin: 20, hidden: false },
        { id: "L002", name: "Thức ăn cho mèo", desc: "Hạt, pate, snack cho mèo", margin: 20, hidden: false },
        { id: "L003", name: "Đồ dùng", desc: "Cát vệ sinh, bát ăn, đồ chơi", margin: 25, hidden: false },
        { id: "L004", name: "Phụ kiện", desc: "Vòng cổ, balo, quần áo", margin: 30, hidden: false },
      ],
      products: [
        { id: "SP001", cat: "L001", name: "Royal Canin Mini Adult", desc: "Hạt cho chó trưởng thành giống nhỏ, túi 2kg", image: "", cost: 0, margin: null, discount: 0, group: "deal", hidden: false },
        { id: "SP002", cat: "L001", name: "Hạt Pedigree vị bò", desc: "Thức ăn khô cho chó, túi 1.5kg", image: "", cost: 0, margin: null, discount: 5, group: "deal", hidden: false },
        { id: "SP003", cat: "L002", name: "Pate mèo Catchy", desc: "Pate cá ngừ cho mèo, lon 85g", image: "", cost: 0, margin: null, discount: 14, group: "deal", hidden: false },
        { id: "SP004", cat: "L003", name: "Cát vệ sinh Cature", desc: "Cát đậu nành vón cục, túi 6L", image: "", cost: 0, margin: null, discount: 0, group: "deal", hidden: false },
        { id: "SP005", cat: "L004", name: "Balo vận chuyển", desc: "Balo phi hành gia cho thú cưng", image: "", cost: 0, margin: 35, discount: 0, group: "combo", hidden: false },
        { id: "SP006", cat: "L004", name: "Vòng cổ thú cưng", desc: "Vòng cổ có chuông, nhiều màu", image: "", cost: 0, margin: null, discount: 0, group: "combo", hidden: false },
      ],
      customers: [
        { id: "KH001", name: "Minh Anh", phone: "0901234567", email: "minhanh@example.com", address: "Quận 1, TP.HCM", username: "minhanh", password: DEFAULT_PW, locked: false },
        { id: "KH002", name: "Tuấn Khang", phone: "0912345678", email: "khang@example.com", address: "Quận 3, TP.HCM", username: "tuankhang", password: DEFAULT_PW, locked: false },
        { id: "KH003", name: "Phương Nhi", phone: "0987654321", email: "nhi@example.com", address: "Thủ Đức, TP.HCM", username: "phuongnhi", password: DEFAULT_PW, locked: true },
      ],
      imports: [], orders: [], log: [], settings: { lowStock: 10 },
    };
    const im1 = {
      id: "PN001", date: daysAgo(30), status: "Chưa hoàn thành",
      items: [
        { pid: "SP001", qty: 50, cost: 150000 }, { pid: "SP002", qty: 40, cost: 90000 },
        { pid: "SP003", qty: 100, cost: 18000 }, { pid: "SP004", qty: 30, cost: 80000 },
        { pid: "SP005", qty: 12, cost: 250000 }, { pid: "SP006", qty: 8, cost: 45000 },
      ],
    };
    completeImport(im1);
    const im2 = { id: "PN002", date: today(), status: "Chưa hoàn thành", items: [{ pid: "SP001", qty: 20, cost: 155000 }, { pid: "SP003", qty: 50, cost: 19000 }] };
    data.imports.push(im1, im2);

    const mk = (id, daysBack, cid, lines, status) => {
      const o = { id, date: daysAgo(daysBack), cid, address: cus(cid).address, status, deducted: false, items: lines.map(([pid, qty]) => ({ pid, qty, price: sellOf(prod(pid)) })) };
      if (status === "Đã xử lý" || status === "Đã giao") deduct(o, o.date);
      data.orders.push(o);
    };
    mk("DH001", 10, "KH001", [["SP001", 2], ["SP003", 5]], "Đã giao");
    mk("DH002", 5, "KH002", [["SP004", 2]], "Đã xử lý");
    mk("DH003", 2, "KH003", [["SP005", 1]], "Mới đặt");
    mk("DH004", 1, "KH001", [["SP006", 3]], "Hủy");
    return data;
  }

  data = loadData();

  /* ---------- Nhận dữ liệu từ trang index (khách đăng ký, đơn đặt hàng) ---------- */
  // Trang index ghi vào "hàng đợi" trong localStorage; admin lấy ra và gộp vào dữ liệu của mình.
  const findCustomer = (username) => data.customers.find((c) => String(c.username).toLowerCase() === String(username || "").trim().toLowerCase());
  function addCustomer(u) {
    const username = String(u.username || "").trim();
    if (!username || findCustomer(username)) return false;
    data.customers.push({
      id: nextId(data.customers, "KH", 3), name: u.name || username, phone: u.phone || "", email: u.email || "",
      address: u.address || "", username, password: u.password || DEFAULT_PW, locked: false,
    });
    return true;
  }
  function addOrder(u) {
    const items = (u.items || []).filter((i) => prod(i.pid) && i.qty > 0).map(({ pid, qty, price }) => ({ pid, qty, price }));
    if (!items.length || (u.ref && data.orders.some((o) => o.ref === u.ref))) return false;
    addCustomer(u); // khách chưa có trong danh sách thì tạo mới
    const c = findCustomer(u.username);
    if (!c) return false;
    data.orders.push({ id: nextId(data.orders, "DH", 3), ref: u.ref, date: u.date || today(), cid: c.id, address: u.address || c.address, status: "Mới đặt", deducted: false, items });
    return true;
  }
  const QUEUES = {
    petpet_new_customers: { add: addCustomer, msg: "Có khách hàng mới đăng ký." },
    petpet_new_orders: { add: addOrder, msg: "Có đơn hàng mới từ khách." },
  };
  // Trả về danh sách thông báo (rỗng nếu không có gì mới)
  function syncQueues() {
    const msgs = [];
    for (const [key, q] of Object.entries(QUEUES)) {
      let list = [];
      try { list = JSON.parse(localStorage.getItem(key)) || []; } catch (e) { /* bỏ qua */ }
      if (!Array.isArray(list) || !list.length) continue;
      localStorage.removeItem(key);
      if (list.map((u) => q.add(u || {})).some(Boolean)) msgs.push(q.msg);
    }
    if (msgs.length) save();
    return msgs;
  }
  syncQueues();
  // Khách đăng ký / đặt hàng ở tab khác trong lúc admin đang mở -> cập nhật ngay
  window.addEventListener("storage", (e) => {
    if (!QUEUES[e.key]) return;
    const msgs = syncQueues();
    if (msgs.length) { redraw(); showMessage(msgs[0]); }
  });

  /* =================================================================
     CSS NHÚNG
     ================================================================= */
  const style = document.createElement("style");
  style.textContent = `
[hidden]{display:none !important}
.pp-toolbar{gap:16px;flex-wrap:wrap;align-items:center}
.pp-tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.pp-tools input,.pp-tools select,.pp-modal input,.pp-modal select,.pp-modal textarea,.pp-inline input{padding:9px 11px;border:1px solid #dddddf;border-radius:6px;font-size:12px;background:#fff;min-width:0;font-family:inherit}
.pp-tools input[type=text]{width:220px}
.pp-tools input:focus,.pp-tools select:focus,.pp-modal input:focus,.pp-modal select:focus,.pp-modal textarea:focus{outline:2px solid #ffc83d;border-color:transparent}
.pp-tools label{font-size:11px;color:#77777d;display:flex;align-items:center;gap:6px}
.pp-btn{white-space:nowrap;border:0;border-radius:6px;padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;transition:filter .15s}
.pp-btn:hover{filter:brightness(.95)}
.pp-btn--primary{background:#ffc83d;color:#29292d}
.pp-btn--ghost{background:#f1f1f1;color:#444}
.pp-btn--small{padding:6px 10px;font-size:11px;background:#fff3c4;color:#7a5a00}
.pp-btn--danger{background:#fde4e4;color:#c62828}
.pp-btn--ok{background:#e4f7ec;color:#267450}
.pp-table-wrap{overflow-x:auto}
.pp-table{width:100%;border-collapse:collapse}
.pp-table th,.pp-table td{padding:12px 18px;text-align:left;border-top:1px solid #e9e9ea;border-bottom:0;white-space:nowrap;font-size:12px}
.pp-table th{font-size:10px;color:#818187;background:#fafafa}
.pp-table tbody tr:hover{background:#fffbea}
.pp-wrap{display:block;white-space:normal;min-width:150px;max-width:260px;line-height:1.5}
#ppList .pp-table th:last-child,#ppList .pp-table td:last-child{position:sticky;right:0;background:#fff;box-shadow:-8px 0 8px -8px rgba(0,0,0,.18)}
#ppList .pp-table th:last-child{background:#fafafa}
#ppList .pp-table tbody tr:hover td:last-child{background:#fffbea}
.pp-actions{display:flex;gap:6px;flex-wrap:nowrap}
.pp-empty{padding:24px;text-align:center;color:#77777d;font-size:12px}
.pp-low{color:#d32f2f;font-weight:700}
.pp-gap{height:18px}
.pp-thumb{width:42px;height:42px;border-radius:8px;object-fit:cover;display:block;background:#fff3c9}
.pp-thumb-ph{width:42px;height:42px;border-radius:8px;background:#fff3c9;color:#8f6800;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700}
.pp-preview{width:80px;height:80px;object-fit:cover;border-radius:8px;display:block;margin-bottom:6px;border:1px solid #eee}
.pp-badge{padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;display:inline-block}
.pp-badge--pending{background:#fff3c4;color:#8a6400}
.pp-badge--shipping{background:#e3f0ff;color:#1b5fb5}
.pp-badge--done{background:#dff7e8;color:#17803d}
.pp-badge--cancel{background:#fde4e4;color:#c62828}
.pp-badge--gray{background:#eee;color:#666}
.status.cancel{background:#fde4e4;color:#c62828}
.pp-modal{position:fixed;inset:0;z-index:1000;background:rgba(30,18,8,.55);display:flex;align-items:center;justify-content:center;padding:16px}
.pp-modal-box{background:#fff;border-radius:12px;padding:24px;width:min(480px,100%);max-height:92vh;overflow:auto}
.pp-modal-box.wide{width:min(780px,100%)}
.pp-modal-box h3{margin:0 0 16px;font-size:16px}
.pp-modal .table-wrapper{margin:0}
.pp-form-fields{display:grid;gap:14px}
.pp-form-fields label,.pp-detail label{display:grid;gap:6px;font-size:12px;font-weight:600;color:#444}
.pp-form-buttons{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}
.pp-error{color:#c62828;font-size:12px;margin-top:10px;min-height:0}
.pp-error:empty{display:none}
.pp-detail p{font-size:12px;margin:6px 0;color:#444}
.pp-detail .pp-note{color:#77777d;font-style:italic}
.pp-total{text-align:right;font-size:13px !important}
.pp-lines{width:100%;border-collapse:collapse}
.pp-lines th,.pp-lines td{padding:6px 4px;border-top:0;font-size:11px;text-align:left;white-space:nowrap}
.pp-lines input,.pp-lines select{width:100%}
.pp-sum{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:16px}
.pp-sum div{border:1px solid #e6e6e6;border-radius:8px;padding:12px;font-size:11px;color:#77777d}
.pp-sum b{display:block;font-size:20px;color:#28282c;margin-top:4px}
.pp-inline{display:flex;gap:6px;align-items:center}
.pp-inline input{width:90px}
.pp-off{background:#fdecec;color:#d32f2f;border:1px solid #f5a3a3;border-radius:4px;padding:1px 6px;font-size:11px}
@media(max-width:640px){.pp-tools input[type=text]{width:100%}.pp-tools{width:100%}}
`;
  document.head.appendChild(style);

  /* =================================================================
     PHẦN TỬ TRANG + THÔNG BÁO
     ================================================================= */
  const overview = document.querySelector(".page-content");
  const pageTitle = $("pageTitle");
  const orderTable = $("orderTable");
  const searchInput = $("searchInput");
  const statusFilter = $("statusFilter");
  const emptyMessage = $("emptyMessage");
  if (!overview) throw new Error("Không tìm thấy .page-content trong HTML");

  const view = document.createElement("div");
  view.className = "page-content pp-view";
  view.style.display = "none";
  overview.after(view);

  function showMessage(text) {
    const m = $("message");
    if (!m) return alert(text);
    m.innerText = text;
    m.classList.add("show");
    clearTimeout(showMessage.t);
    showMessage.t = setTimeout(() => m.classList.remove("show"), 2200);
  }

  /* =================================================================
     MODAL + FORM CHUNG
     ================================================================= */
  const modal = document.createElement("div");
  modal.className = "pp-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="pp-modal-box" id="ppBox" role="dialog" aria-modal="true">
      <h3 id="ppModalTitle"></h3>
      <form id="ppModalForm" novalidate>
        <div id="ppModalBody"></div>
        <p class="pp-error" id="ppModalError"></p>
        <div class="pp-form-buttons">
          <button type="button" class="pp-btn pp-btn--ghost" id="ppModalCancel">Hủy</button>
          <button type="submit" class="pp-btn pp-btn--primary" id="ppModalOk">Lưu</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(modal);
  const modalForm = $("ppModalForm");
  const closeModal = () => { modal.hidden = true; };
  modal.addEventListener("mousedown", (e) => { if (e.target === modal) closeModal(); });
  $("ppModalCancel").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // o: {title, body, wide, ok, onMount, onSubmit}. Không có onSubmit => chế độ chỉ xem.
  function openModal(o) {
    $("ppModalTitle").textContent = o.title;
    $("ppModalBody").innerHTML = o.body;
    $("ppModalError").textContent = "";
    $("ppBox").classList.toggle("wide", !!o.wide);
    $("ppModalOk").hidden = !o.onSubmit;
    $("ppModalOk").textContent = o.ok || "Lưu";
    $("ppModalCancel").textContent = o.onSubmit ? "Hủy" : "Đóng";
    modalForm.onsubmit = async (e) => {
      e.preventDefault();
      if (!o.onSubmit) return;
      if (!modalForm.reportValidity()) return;
      const r = await o.onSubmit(modalForm);
      if (typeof r === "string") { $("ppModalError").textContent = r; return; }
      closeModal();
    };
    modal.hidden = false;
    if (o.onMount) o.onMount();
    const first = $("ppModalBody").querySelector("input:not([readonly]):not([disabled]),select,textarea");
    if (first) first.focus();
  }

  function fieldsHtml(fields, row) {
    return fields.map((f) => {
      const v = row ? row[f.name] : (typeof f.default === "function" ? f.default() : (f.default ?? ""));
      const vv = v ?? "";
      let input;
      if (f.type === "select") {
        input = `<select name="${f.name}">${f.options.map((o) => {
          const ov = o.v ?? o, ot = o.t ?? o;
          return `<option value="${esc(ov)}" ${String(ov) === String(vv) ? "selected" : ""}>${esc(ot)}</option>`;
        }).join("")}</select>`;
      } else if (f.type === "textarea") {
        input = `<textarea name="${f.name}" rows="3">${esc(vv)}</textarea>`;
      } else if (f.type === "file") {
        input = (vv ? `<img class="pp-preview" src="${esc(vv)}" alt="Hình hiện tại">` : "") + `<input type="file" name="${f.name}" accept="image/*">`;
      } else {
        input = `<input name="${f.name}" type="${f.type}" value="${esc(vv)}" ${f.required ? "required" : ""} ${f.readonly ? "readonly" : ""}
          ${f.min != null ? `min="${f.min}"` : ""} ${f.max != null ? `max="${f.max}"` : ""} ${f.step ? `step="${f.step}"` : ""}>`;
      }
      return `<label>${esc(f.label)}${f.required ? " *" : ""}${input}</label>`;
    }).join("");
  }
  function readValues(fields, form) {
    const out = {};
    fields.forEach((f) => {
      const el = form.elements[f.name];
      if (f.type === "file") out[f.name] = el.files[0] || null;
      else {
        const v = el.value.trim();
        out[f.name] = f.type === "number" ? (v === "" ? null : Number(v)) : v;
      }
    });
    return out;
  }
  function readImage(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = reject;
      fr.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const k = Math.min(1, 240 / Math.max(img.width, img.height));
          const c = document.createElement("canvas");
          c.width = Math.round(img.width * k);
          c.height = Math.round(img.height * k);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL("image/jpeg", 0.75));
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  /* =================================================================
     KHUNG TRANG CON
     ================================================================= */
  let current = null;          // {draw, filterDraw}
  const actions = {};          // data-act -> hàm xử lý
  const box = (title, sub, tools, inner) =>
    `<section class="box"><div class="box-title pp-toolbar"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div><div class="pp-tools">${tools || ""}</div></div>${inner}</section>`;
  const table = (heads, rows, emptyText) => rows.length
    ? `<div class="table-wrapper pp-table-wrap"><table class="pp-table"><thead><tr>${heads.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
    : `<p class="pp-empty">${emptyText || "Không có dữ liệu phù hợp."}</p>`;
  const btn = (act, id, label, cls) => `<button type="button" class="pp-btn pp-btn--small ${cls || ""}" data-act="${act}" data-id="${esc(id)}">${label}</button>`;
  const badge = (text, kind) => `<span class="pp-badge pp-badge--${kind}">${esc(text)}</span>`;
  const catOptions = (all) => (all ? `<option value="">Tất cả loại</option>` : "") + data.categories.map((c) => `<option value="${c.id}">${esc(c.name)}${c.hidden ? " (ẩn)" : ""}</option>`).join("");
  function mount(html, page) { view.innerHTML = html; current = page; page.draw(); }
  const redraw = () => { if (current) current.draw(); refreshOverview(); };

  view.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (b && actions[b.dataset.act]) actions[b.dataset.act](b.dataset.id, b);
  });
  view.addEventListener("input", (e) => {
    if (e.target.closest("[data-filter]") && current) (current.filterDraw || current.draw)();
  });

  /* =================================================================
     2. KHÁCH HÀNG
     ================================================================= */
  function pageCustomers() {
    mount(box("Quản lý khách hàng", "Danh sách tài khoản khách hàng",
      `<input type="text" id="fQ" data-filter placeholder="Tìm tên, SĐT, email, tài khoản...">
       <select id="fS" data-filter><option value="">Tất cả trạng thái</option><option value="0">Hoạt động</option><option value="1">Đã khóa</option></select>`,
      `<div id="ppList"></div>`), {
      draw() {
        const q = val("fQ").trim().toLowerCase(), s = val("fS");
        const rows = data.customers.filter((c) =>
          (!q || [c.id, c.name, c.phone, c.email, c.username].some((x) => String(x).toLowerCase().includes(q))) &&
          (s === "" || String(+c.locked) === s));
        $("ppList").innerHTML = table(["Mã KH", "Họ tên", "Điện thoại", "Email", "Địa chỉ", "Tài khoản", "Trạng thái", "Thao tác"],
          rows.map((c) => [esc(c.id), esc(c.name), esc(c.phone), esc(c.email), esc(c.address), esc(c.username),
            c.locked ? badge("Đã khóa", "cancel") : badge("Hoạt động", "done"),
            `<div class="pp-actions">${btn("cus-reset", c.id, "Reset mật khẩu")}${btn("cus-lock", c.id, c.locked ? "Mở khóa" : "Khóa", c.locked ? "pp-btn--ok" : "pp-btn--danger")}</div>`]));
      },
    });
    actions["cus-reset"] = (id) => {
      const c = cus(id);
      if (!confirm(`Đặt lại mật khẩu của "${c.name}" về mặc định (${DEFAULT_PW})?`)) return;
      c.password = DEFAULT_PW; save();
      showMessage(`Đã reset mật khẩu của ${c.name} về ${DEFAULT_PW}.`);
    };
    actions["cus-lock"] = (id) => {
      const c = cus(id);
      if (!confirm(`${c.locked ? "Mở khóa" : "Khóa"} tài khoản "${c.name}"?`)) return;
      c.locked = !c.locked; save(); redraw();
      showMessage(c.locked ? "Đã khóa tài khoản." : "Đã mở khóa tài khoản.");
    };
  }

  /* =================================================================
     3. LOẠI SẢN PHẨM
     ================================================================= */
  const catFields = [
    { name: "name", label: "Tên loại", type: "text", required: true },
    { name: "desc", label: "Mô tả", type: "textarea" },
  ];
  function pageCategories() {
    mount(box("Quản lý loại sản phẩm", "Thêm, sửa, xóa hoặc ẩn loại sản phẩm",
      `<input type="text" id="fQ" data-filter placeholder="Tìm loại sản phẩm...">
       <button class="pp-btn pp-btn--primary" data-act="cat-add">+ Thêm loại</button>`,
      `<div id="ppList"></div>`), {
      draw() {
        const q = val("fQ").trim().toLowerCase();
        const rows = data.categories.filter((c) => !q || (c.id + c.name + c.desc).toLowerCase().includes(q));
        $("ppList").innerHTML = table(["Mã", "Tên loại", "Mô tả", "Số sản phẩm", "Trạng thái", "Thao tác"],
          rows.map((c) => [esc(c.id), esc(c.name), `<span title="${esc(c.desc)}">${esc(c.desc)}</span>`,
            data.products.filter((p) => p.cat === c.id).length,
            c.hidden ? badge("Đã ẩn", "gray") : badge("Đang dùng", "done"),
            `<div class="pp-actions">${btn("cat-edit", c.id, "Sửa")}${btn("cat-toggle", c.id, c.hidden ? "Hiện" : "Ẩn")}${btn("cat-del", c.id, "Xóa", "pp-btn--danger")}</div>`]));
      },
    });
    const form = (row) => openModal({
      title: (row ? "Sửa" : "Thêm") + " loại sản phẩm",
      body: `<div class="pp-form-fields">${fieldsHtml(catFields, row)}</div>`,
      onSubmit(f) {
        const v = readValues(catFields, f);
        if (data.categories.some((c) => (!row || c.id !== row.id) && c.name.toLowerCase() === v.name.toLowerCase())) return "Tên loại đã tồn tại.";
        if (row) Object.assign(row, v);
        else data.categories.push({ id: nextId(data.categories, "L", 3), name: v.name, desc: v.desc, margin: 20, hidden: false });
        save(); redraw(); showMessage("Đã lưu loại sản phẩm.");
      },
    });
    actions["cat-add"] = () => form(null);
    actions["cat-edit"] = (id) => form(cat(id));
    actions["cat-toggle"] = (id) => { const c = cat(id); c.hidden = !c.hidden; save(); redraw(); showMessage(c.hidden ? "Đã ẩn loại sản phẩm." : "Đã hiện loại sản phẩm."); };
    actions["cat-del"] = (id) => {
      const c = cat(id);
      if (data.products.some((p) => p.cat === id)) return alert("Loại này đã có sản phẩm nên không thể xóa. Bạn chỉ có thể ẩn loại này.");
      if (!confirm(`Xóa loại "${c.name}"?`)) return;
      data.categories = data.categories.filter((x) => x.id !== id); save(); redraw(); showMessage("Đã xóa loại sản phẩm.");
    };
  }

  /* =================================================================
     4. SẢN PHẨM (DANH MỤC)
     ================================================================= */
  const usedProduct = (pid) => data.log.some((e) => e.pid === pid) || data.imports.some((i) => i.items.some((x) => x.pid === pid)) || data.orders.some((o) => o.items.some((x) => x.pid === pid));
  function pageProducts() {
    mount(box("Quản lý sản phẩm", "Thêm, sửa, xóa hoặc ẩn sản phẩm (hiển thị ở trang chủ khi đã nhập hàng)",
      `<input type="text" id="fQ" data-filter placeholder="Tìm mã, tên sản phẩm...">
       <select id="fC" data-filter>${catOptions(true)}</select>
       <select id="fS" data-filter><option value="">Tất cả trạng thái</option><option value="0">Đang bán</option><option value="1">Đã ẩn</option></select>
       <button class="pp-btn pp-btn--primary" data-act="prod-add">+ Thêm sản phẩm</button>`,
      `<div id="ppList"></div>`), {
      draw() {
        const q = val("fQ").trim().toLowerCase(), c = val("fC"), s = val("fS");
        const rows = data.products.filter((p) => (!q || (p.id + p.name).toLowerCase().includes(q)) && (!c || p.cat === c) && (s === "" || String(+p.hidden) === s));
        $("ppList").innerHTML = table(["Hình", "Mã", "Tên sản phẩm", "Loại", "Mô tả", "Nhóm trang chủ", "Trạng thái", "Thao tác"],
          rows.map((p) => [
            p.image ? `<img class="pp-thumb" src="${esc(p.image)}" alt="">` : `<div class="pp-thumb-ph">${esc(initials(p.name))}</div>`,
            esc(p.id), `<span class="pp-wrap" title="${esc(p.name)}">${esc(p.name)}</span>`, esc(catName(p.cat)), `<span class="pp-wrap" title="${esc(p.desc)}">${esc(p.desc)}</span>`,
            esc(groupName(p.group)),
            p.hidden ? badge("Đã ẩn", "gray") : badge("Đang bán", "done"),
            `<div class="pp-actions">${btn("prod-edit", p.id, "Sửa")}${btn("prod-toggle", p.id, p.hidden ? "Hiện" : "Ẩn")}${btn("prod-del", p.id, "Xóa", "pp-btn--danger")}</div>`]));
      },
    });
    const form = (row) => {
      const opts = data.categories.filter((c) => !c.hidden || (row && row.cat === c.id)).map((c) => ({ v: c.id, t: c.name }));
      if (!opts.length) return alert("Chưa có loại sản phẩm nào. Hãy tạo loại sản phẩm trước.");
      const fields = [
        { name: "cat", label: "Loại sản phẩm", type: "select", options: opts },
        { name: "id", label: "Mã sản phẩm", type: "text", required: true, readonly: !!row, default: () => nextId(data.products, "SP", 3) },
        { name: "name", label: "Tên sản phẩm", type: "text", required: true },
        { name: "image", label: "Hình ảnh", type: "file" },
        { name: "desc", label: "Mô tả", type: "textarea" },
        { name: "group", label: "Hiển thị ở trang chủ", type: "select", options: GROUPS },
      ];
      openModal({
        title: row ? `Sửa sản phẩm ${row.id}` : "Thêm sản phẩm",
        body: `<div class="pp-form-fields">${fieldsHtml(fields, row)}</div>`,
        async onSubmit(f) {
          const v = readValues(fields, f);
          const code = v.id.toUpperCase().replace(/\s+/g, "");
          if (!/^[A-Z0-9_-]+$/.test(code)) return "Mã sản phẩm chỉ gồm chữ, số, gạch ngang.";
          if (!row && prod(code)) return "Mã sản phẩm đã tồn tại.";
          let image = row ? row.image : "";
          if (v.image) { try { image = await readImage(v.image); } catch (e) { return "Không đọc được file hình."; } }
          const item = { cat: v.cat, name: v.name, desc: v.desc, image, group: v.group || "deal" };
          if (row) Object.assign(row, item);
          else data.products.push({ id: code, ...item, cost: 0, margin: null, discount: 0, hidden: false });
          save(); redraw(); showMessage("Đã lưu sản phẩm.");
        },
      });
    };
    actions["prod-add"] = () => form(null);
    actions["prod-edit"] = (id) => form(prod(id));
    actions["prod-toggle"] = (id) => { const p = prod(id); p.hidden = !p.hidden; save(); redraw(); showMessage(p.hidden ? "Đã ẩn sản phẩm." : "Đã hiện sản phẩm."); };
    actions["prod-del"] = (id) => {
      const p = prod(id);
      if (usedProduct(id)) return alert("Sản phẩm này đã phát sinh nhập/xuất/đơn hàng nên không thể xóa. Bạn chỉ có thể ẩn sản phẩm.");
      if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return;
      data.products = data.products.filter((x) => x.id !== id); save(); redraw(); showMessage("Đã xóa sản phẩm.");
    };
  }

  /* =================================================================
     5. NHẬP HÀNG
     ================================================================= */
  function pageImports() {
    mount(box("Quản lý phiếu nhập hàng", "Chỉ sửa được phiếu khi chưa hoàn thành",
      `<input type="text" id="fQ" data-filter placeholder="Tìm mã phiếu, tên sản phẩm...">
       <select id="fS" data-filter><option value="">Tất cả trạng thái</option><option>Chưa hoàn thành</option><option>Hoàn thành</option></select>
       <label>Từ <input type="date" id="fF" data-filter></label><label>Đến <input type="date" id="fT" data-filter></label>
       <button class="pp-btn pp-btn--primary" data-act="imp-add">+ Thêm phiếu nhập</button>`,
      `<div id="ppList"></div>`), {
      draw() {
        const q = val("fQ").trim().toLowerCase(), s = val("fS"), f = val("fF"), t = val("fT");
        const rows = data.imports
          .filter((i) => (!q || i.id.toLowerCase().includes(q) || i.items.some((x) => (prod(x.pid) ? prod(x.pid).name : "").toLowerCase().includes(q))) && (!s || i.status === s) && inRange(i.date, f, t))
          .sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
        $("ppList").innerHTML = table(["Mã phiếu", "Ngày nhập", "Số mặt hàng", "Tổng giá trị", "Trạng thái", "Thao tác"],
          rows.map((i) => {
            const done = i.status === "Hoàn thành";
            return [esc(i.id), fmtDate(i.date), i.items.length, money(importTotal(i)), badge(i.status, done ? "done" : "pending"),
              `<div class="pp-actions">${btn("imp-open", i.id, done ? "Xem" : "Sửa")}${done ? "" : btn("imp-done", i.id, "Hoàn thành", "pp-btn--ok") + btn("imp-del", i.id, "Xóa", "pp-btn--danger")}</div>`];
          }));
      },
    });

    function form(im) {
      const readonly = !!im && im.status === "Hoàn thành";
      const dis = readonly ? "disabled" : "";
      const products = data.products.filter((p) => !p.hidden || (im && im.items.some((i) => i.pid === p.id)));
      const lineHtml = (it) => `<tr class="pp-line">
        <td><select name="pid" ${dis}><option value="">-- Chọn sản phẩm --</option>${products.map((p) => `<option value="${p.id}" ${it && it.pid === p.id ? "selected" : ""}>${esc(p.id + " - " + p.name)}</option>`).join("")}</select></td>
        <td style="width:90px"><input type="number" name="qty" min="1" step="1" value="${it ? it.qty : ""}" ${dis}></td>
        <td style="width:130px"><input type="number" name="cost" min="0" step="1" value="${it ? it.cost : ""}" ${dis}></td>
        <td style="width:40px">${readonly ? "" : `<button type="button" class="pp-btn pp-btn--small pp-btn--danger" data-rm>✕</button>`}</td></tr>`;
      const lines = im ? im.items : [null];
      openModal({
        title: im ? `${readonly ? "Chi tiết" : "Sửa"} phiếu nhập ${im.id}` : "Thêm phiếu nhập hàng",
        wide: true,
        ok: "Lưu phiếu",
        body: `<div class="pp-form-fields"><label>Ngày nhập *<input type="date" name="date" required value="${im ? im.date : today()}" ${dis}></label></div>
          <table class="pp-lines" style="margin-top:14px"><thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Giá nhập (đ)</th><th></th></tr></thead><tbody id="ppLines">${lines.map(lineHtml).join("")}</tbody></table>
          ${readonly ? "" : `<button type="button" class="pp-btn pp-btn--ghost" id="ppAddLine" style="margin-top:10px">+ Thêm dòng</button>`}
          <p class="pp-total">Tổng giá trị: <b id="ppImpTotal">0đ</b></p>`,
        onMount() {
          const body = $("ppLines");
          const total = () => {
            let s = 0;
            body.querySelectorAll(".pp-line").forEach((tr) => { s += (Number(tr.querySelector("[name=qty]").value) || 0) * (Number(tr.querySelector("[name=cost]").value) || 0); });
            $("ppImpTotal").textContent = money(s);
          };
          body.addEventListener("input", total);
          body.addEventListener("click", (e) => {
            if (e.target.closest("[data-rm]")) {
              if (body.querySelectorAll(".pp-line").length > 1) e.target.closest("tr").remove();
              total();
            }
          });
          const add = $("ppAddLine");
          if (add) add.onclick = () => body.insertAdjacentHTML("beforeend", lineHtml(null));
          total();
        },
        onSubmit: readonly ? undefined : (f) => {
          const date = f.elements.date.value;
          if (!date) return "Vui lòng chọn ngày nhập.";
          const items = [], seen = new Set();
          for (const tr of $("ppLines").querySelectorAll(".pp-line")) {
            const pid = tr.querySelector("[name=pid]").value;
            const qty = Number(tr.querySelector("[name=qty]").value);
            const cost = Number(tr.querySelector("[name=cost]").value);
            if (!pid && !qty && !tr.querySelector("[name=cost]").value) continue; // dòng trống
            if (!pid) return "Có dòng chưa chọn sản phẩm.";
            if (seen.has(pid)) return `Sản phẩm ${pid} bị trùng, hãy gộp thành một dòng.`;
            if (!Number.isInteger(qty) || qty <= 0) return `Số lượng của ${pid} phải là số nguyên dương.`;
            if (!(cost >= 0) || tr.querySelector("[name=cost]").value === "") return `Giá nhập của ${pid} không hợp lệ.`;
            seen.add(pid); items.push({ pid, qty, cost });
          }
          if (!items.length) return "Phiếu nhập cần ít nhất một sản phẩm.";
          if (im) { im.date = date; im.items = items; }
          else data.imports.push({ id: nextId(data.imports, "PN", 3), date, status: "Chưa hoàn thành", items });
          save(); redraw(); showMessage("Đã lưu phiếu nhập.");
        },
      });
    }
    actions["imp-add"] = () => form(null);
    actions["imp-open"] = (id) => form(imp(id));
    actions["imp-done"] = (id) => {
      const im = imp(id);
      if (!confirm(`Hoàn thành phiếu ${id}? Sau khi hoàn thành sẽ cập nhật tồn kho, giá vốn và KHÔNG thể sửa phiếu.`)) return;
      completeImport(im); save(); redraw(); showMessage("Đã hoàn thành phiếu nhập, tồn kho đã được cập nhật.");
    };
    actions["imp-del"] = (id) => {
      if (!confirm(`Xóa phiếu nhập ${id}?`)) return;
      data.imports = data.imports.filter((i) => i.id !== id); save(); redraw(); showMessage("Đã xóa phiếu nhập.");
    };
  }

  /* =================================================================
     6. GIÁ BÁN
     ================================================================= */
  function pagePricing() {
    mount(
      box("Tỉ lệ lợi nhuận theo loại sản phẩm", "Giá gốc = Giá vốn bình quân × (1 + % lợi nhuận)", "", `<div id="ppCats"></div>`) +
      `<div class="pp-gap"></div>` +
      box("Tra cứu giá vốn, % lợi nhuận, giá bán", "Đặt % lợi nhuận riêng (để trống thì theo loại) và % giảm giá hiển thị ở trang chủ. Giá bán = Giá gốc × (1 − % giảm)",
        `<input type="text" id="fQ" data-filter placeholder="Tìm mã, tên sản phẩm..."><select id="fC" data-filter>${catOptions(true)}</select>`,
        `<div id="ppList"></div>`), {
      draw() { this.drawCats(); this.filterDraw(); },
      drawCats() {
        $("ppCats").innerHTML = table(["Loại sản phẩm", "Số SP", "% lợi nhuận mặc định", "Thao tác"],
          data.categories.map((c) => [esc(c.name), data.products.filter((p) => p.cat === c.id).length,
            `<input type="number" id="m-${c.id}" min="0" step="0.1" value="${c.margin}" style="width:90px;padding:7px;border:1px solid #ddd;border-radius:6px"> %`,
            btn("cat-margin", c.id, "Lưu")]));
      },
      filterDraw() {
        const q = val("fQ").trim().toLowerCase(), c = val("fC");
        const rows = data.products.filter((p) => (!q || (p.id + p.name).toLowerCase().includes(q)) && (!c || p.cat === c));
        $("ppList").innerHTML = table(["Mã", "Tên sản phẩm", "Loại", "Giá vốn", "% lợi nhuận", "Giá gốc", "% giảm giá", "Giá bán", "Thao tác"],
          rows.map((p) => {
            const noCost = !p.cost;
            const d = discountOf(p);
            return [esc(p.id), esc(p.name), esc(catName(p.cat)), noCost ? "Chưa nhập" : money(p.cost),
              `${marginOf(p)}% <small style="color:#999">(${p.margin != null ? "riêng" : "theo loại"})</small>`,
              noCost ? "—" : money(priceOf(p)),
              d > 0 ? `<span class="pp-off">-${d}%</span>` : "—",
              noCost ? "—" : `<b>${money(sellOf(p))}</b>`,
              btn("prod-margin", p.id, "Sửa giá")];
          }));
      },
    });
    actions["cat-margin"] = (id) => {
      const v = $("m-" + id).value;
      if (v === "" || Number(v) < 0) return alert("% lợi nhuận phải là số không âm.");
      cat(id).margin = Number(v); save(); current.draw(); showMessage("Đã cập nhật % lợi nhuận của loại.");
    };
    actions["prod-margin"] = (id) => {
      const p = prod(id);
      const fields = [
        { name: "margin", label: "% lợi nhuận riêng (để trống = theo loại)", type: "number", min: 0, step: "0.1" },
        { name: "discount", label: "% giảm giá hiển thị ở trang chủ (0 = không giảm)", type: "number", min: 0, max: 90, step: "1" },
      ];
      openModal({
        title: `Giá bán - ${p.name}`,
        body: `<div class="pp-form-fields">${fieldsHtml(fields, p)}</div><p class="pp-note" style="font-size:11px;color:#77777d;margin-top:10px">Mặc định theo loại "${esc(catName(p.cat))}": ${cat(p.cat) ? cat(p.cat).margin : 0}%</p>`,
        onSubmit(f) {
          const v = readValues(fields, f);
          if (v.margin !== null && v.margin < 0) return "% lợi nhuận phải không âm.";
          if (v.discount !== null && (v.discount < 0 || v.discount > 90)) return "% giảm giá phải từ 0 đến 90.";
          p.margin = v.margin; p.discount = v.discount || 0;
          save(); current.draw(); showMessage("Đã cập nhật giá bán.");
        },
      });
    };
  }

  /* =================================================================
     7. ĐƠN HÀNG
     ================================================================= */
  const statusBadge = (s) => badge(s, ORDER_KIND[s] || "gray");
  function pageOrders() {
    mount(box("Quản lý đơn đặt hàng", "Tra cứu theo ngày đặt và tình trạng đơn hàng",
      `<input type="text" id="fQ" data-filter placeholder="Tìm mã đơn, khách hàng...">
       <select id="fS" data-filter><option value="">Tất cả tình trạng</option>${ORDER_STATUS.map((s) => `<option>${s}</option>`).join("")}</select>
       <label>Từ ngày <input type="date" id="fF" data-filter></label><label>Đến ngày <input type="date" id="fT" data-filter></label>`,
      `<div id="ppList"></div>`), {
      draw() {
        const q = val("fQ").trim().toLowerCase(), s = val("fS"), f = val("fF"), t = val("fT");
        const rows = data.orders
          .filter((o) => (!q || o.id.toLowerCase().includes(q) || (cus(o.cid) ? cus(o.cid).name : "").toLowerCase().includes(q)) && (!s || o.status === s) && inRange(o.date, f, t))
          .sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
        $("ppList").innerHTML = table(["Mã đơn", "Ngày đặt", "Khách hàng", "Tổng tiền", "Tình trạng", "Thao tác"],
          rows.map((o) => [esc(o.id), fmtDate(o.date), esc(cus(o.cid) ? cus(o.cid).name : "(đã xóa)"), money(orderTotal(o)), statusBadge(o.status), btn("ord-view", o.id, "Chi tiết")]));
      },
    });
    actions["ord-view"] = (id) => {
      const o = ord(id), c = cus(o.cid), next = STATUS_FLOW[o.status];
      const lines = o.items.map((i) => [esc(i.pid), esc(prod(i.pid) ? prod(i.pid).name : "(đã xóa)"), i.qty, money(i.price), money(i.qty * i.price)]);
      openModal({
        title: "Chi tiết đơn " + o.id, wide: true, ok: "Cập nhật tình trạng",
        body: `<div class="pp-detail">
          <p><b>Mã đơn:</b> ${esc(o.id)} &nbsp;·&nbsp; <b>Ngày đặt:</b> ${fmtDate(o.date)}</p>
          <p><b>Khách hàng:</b> ${esc(c ? c.name : "(đã xóa)")} ${c ? "— " + esc(c.phone) : ""}</p>
          <p><b>Địa chỉ giao:</b> ${esc(o.address || (c ? c.address : ""))}</p>
          ${table(["Mã SP", "Tên sản phẩm", "SL", "Đơn giá", "Thành tiền"], lines)}
          <p class="pp-total">Tổng tiền: <b>${money(orderTotal(o))}</b></p>
          <p><b>Tình trạng hiện tại:</b> ${statusBadge(o.status)}</p>
          ${next.length ? `<label>Chuyển sang<select name="status">${next.map((s) => `<option>${s}</option>`).join("")}</select></label>` : `<p class="pp-note">Đơn hàng đã kết thúc, không thể đổi tình trạng.</p>`}
        </div>`,
        onSubmit: next.length ? (f) => {
          const err = changeStatus(o, f.elements.status.value);
          if (err) return err;
          save(); redraw(); showMessage("Đã cập nhật tình trạng đơn hàng.");
        } : undefined,
      });
    };
  }

  /* =================================================================
     QUẢN LÝ KHUYẾN MÃI (mã giảm giá)
     ================================================================= */
  const promotionForm = document.getElementById("promotionForm");
  const promotionList = document.getElementById("promotionList");
  const promotionKey = "petpetPromotions";

  function getPromotions() {
    try { return JSON.parse(localStorage.getItem(promotionKey)) || []; }
    catch (e) { return []; }
  }
  function savePromotions(promotions) {
    localStorage.setItem(promotionKey, JSON.stringify(promotions));
  }

  function displayPromotions() {
    if (!promotionList) return;
    const promotions = getPromotions();
    promotionList.innerHTML = "";

    if (promotions.length === 0) {
      promotionList.textContent = "Chưa có chương trình khuyến mãi.";
      return;
    }

    promotions.forEach(function (promotion) {
      const item = document.createElement("div");
      item.style.padding = "15px";
      item.style.marginTop = "10px";
      item.style.border = "1px solid #ddd";
      item.style.borderRadius = "8px";

      const title = document.createElement("h3");
      title.textContent = promotion.name;

      const code = document.createElement("p");
      code.textContent = "Mã giảm giá: " + promotion.code;

      const percent = document.createElement("p");
      percent.textContent = "Giảm " + promotion.percent + "%";

      const description = document.createElement("p");
      description.textContent = promotion.description || "";

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Xóa khuyến mãi";
      deleteButton.className = "cancel-button";
      deleteButton.addEventListener("click", function () {
        savePromotions(getPromotions().filter(function (p) { return p.id !== promotion.id; }));
        displayPromotions();
      });

      item.append(title, code, percent, description, deleteButton);
      promotionList.appendChild(item);
    });
  }

  if (promotionForm) {
    promotionForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("promotionName").value.trim();
      const code = document.getElementById("promotionCode").value.trim().toUpperCase();
      const percent = Number(document.getElementById("promotionPercent").value);
      const description = document.getElementById("promotionDescription").value.trim();

      if (!(percent >= 1 && percent <= 100)) {
        alert("Phần trăm giảm giá phải từ 1 đến 100!");
        return;
      }

      const promotions = getPromotions();
      if (promotions.some(function (p) { return p.code.toUpperCase() === code; })) {
        alert("Mã giảm giá này đã tồn tại!");
        return;
      }

      promotions.push({ id: Date.now(), name: name, code: code, percent: percent, description: description });
      savePromotions(promotions);
      promotionForm.reset();
      displayPromotions();
      alert("Đã thêm khuyến mãi thành công!");
    });
  }
  displayPromotions();

  /* =================================================================
     8. TỒN KHO
     ================================================================= */
  function pageStock() {
    mount(
      box("Tồn kho theo loại tại một thời điểm", "Số lượng tồn tính đến hết ngày được chọn",
        `<label>Ngày <input type="date" id="sD" data-filter value="${today()}"></label><select id="sC" data-filter>${catOptions(true)}</select>`,
        `<div id="ppStockAt"></div>`) +
      `<div class="pp-gap"></div>` +
      box("Cảnh báo sản phẩm sắp hết hàng", "Tồn hiện tại thấp hơn hoặc bằng ngưỡng",
        `<label>Ngưỡng cảnh báo <input type="number" id="sT" data-filter min="0" step="1" value="${data.settings.lowStock}" style="width:80px"></label>`,
        `<div id="ppLow"></div>`) +
      `<div class="pp-gap"></div>` +
      box("Báo cáo nhập – xuất – tồn của một sản phẩm", "Tra cứu trong một khoảng thời gian",
        `<select id="sP" data-filter>${data.products.map((p) => `<option value="${p.id}">${esc(p.id + " - " + p.name)}</option>`).join("")}</select>
         <label>Từ <input type="date" id="sF" data-filter value="${daysAgo(30)}"></label><label>Đến <input type="date" id="sE" data-filter value="${today()}"></label>`,
        `<div id="ppMove"></div>`), {
      draw() {
        // A. Tồn tại thời điểm
        const d = val("sD") || today(), c = val("sC"), thr = data.settings.lowStock;
        const rows = data.products.filter((p) => !c || p.cat === c).map((p) => {
          const n = stockOf(p.id, { upTo: d });
          const st = n <= 0 ? badge("Hết hàng", "cancel") : n <= thr ? badge("Sắp hết", "pending") : badge("Đủ hàng", "done");
          return [esc(p.id), esc(p.name) + (p.hidden ? " (ẩn)" : ""), esc(catName(p.cat)), `<b class="${n <= thr ? "pp-low" : ""}">${n}</b>`, st];
        });
        $("ppStockAt").innerHTML = table(["Mã", "Tên sản phẩm", "Loại", `Tồn đến ${fmtDate(d)}`, "Tình trạng"], rows);

        // B. Cảnh báo
        const t = Number(val("sT"));
        if (val("sT") !== "" && t >= 0) { data.settings.lowStock = t; save(); }
        const low = data.products.filter((p) => !p.hidden).map((p) => ({ p, n: stockOf(p.id) })).filter((x) => x.n <= data.settings.lowStock).sort((a, b) => a.n - b.n);
        $("ppLow").innerHTML = table(["Mã", "Tên sản phẩm", "Loại", "Tồn hiện tại"],
          low.map((x) => [esc(x.p.id), esc(x.p.name), esc(catName(x.p.cat)), `<b class="pp-low">${x.n}</b>`]), "Không có sản phẩm nào sắp hết hàng.");

        // C. Nhập - xuất - tồn
        const pid = val("sP"), from = val("sF"), to = val("sE");
        if (!pid || !from || !to) { $("ppMove").innerHTML = `<p class="pp-empty">Hãy chọn sản phẩm và khoảng thời gian.</p>`; return; }
        if (from > to) { $("ppMove").innerHTML = `<p class="pp-empty">Ngày bắt đầu phải trước ngày kết thúc.</p>`; return; }
        const ev = data.log.filter((e) => e.pid === pid && inRange(e.date, from, to)).sort((a, b) => a.date.localeCompare(b.date));
        const sum = (type) => ev.filter((e) => e.type === type).reduce((s, e) => s + e.qty, 0);
        const open = stockOf(pid, { before: from }), close = stockOf(pid, { upTo: to });
        $("ppMove").innerHTML = `<div class="pp-sum">
            <div>Tồn đầu kỳ<b>${open}</b></div><div>Nhập trong kỳ<b>${sum("in")}</b></div>
            <div>Hoàn kho (hủy đơn)<b>${sum("return")}</b></div><div>Xuất trong kỳ<b>${sum("out")}</b></div><div>Tồn cuối kỳ<b>${close}</b></div></div>`
          + table(["Ngày", "Loại", "Chứng từ", "Nhập", "Xuất"],
            ev.map((e) => [fmtDate(e.date), e.type === "in" ? "Nhập hàng" : e.type === "out" ? "Xuất bán" : "Hoàn kho", esc(e.ref), e.type === "out" ? "" : e.qty, e.type === "out" ? e.qty : ""]),
            "Không có phát sinh nhập/xuất trong kỳ.");
      },
    });
  }

  /* =================================================================
     CÀI ĐẶT
     ================================================================= */
  function pageSettings() {
    mount(box("Cài đặt", "Dữ liệu được lưu trong trình duyệt (localStorage)", "",
      `<div class="pp-form-fields" style="max-width:420px"><button class="pp-btn pp-btn--danger" data-act="reset">Khôi phục dữ liệu mẫu (xóa toàn bộ dữ liệu hiện tại)</button></div>`), { draw() {} });
    actions.reset = () => {
      if (!confirm("Xóa toàn bộ dữ liệu và quay về dữ liệu mẫu?")) return;
      localStorage.removeItem(STORAGE_KEY); data = buildSeed(); save(); refreshOverview(); showMessage("Đã khôi phục dữ liệu mẫu.");
    };
  }

  /* =================================================================
     TỔNG QUAN
     ================================================================= */
  const ovStatusClass = { "Mới đặt": "waiting", "Đã xử lý": "shipping", "Đã giao": "done", "Hủy": "cancel" };
  function showOrders() {
    if (!orderTable) return;
    const q = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const s = statusFilter ? statusFilter.value : "Tất cả";
    const rows = data.orders
      .filter((o) => (!q || o.id.toLowerCase().includes(q) || (cus(o.cid) ? cus(o.cid).name : "").toLowerCase().includes(q)) && (s === "Tất cả" || o.status === s))
      .sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id)).slice(0, 8);
    orderTable.innerHTML = rows.map((o) => {
      const names = o.items.map((i) => (prod(i.pid) ? prod(i.pid).name : "?"));
      const summary = names[0] + (names.length > 1 ? ` +${names.length - 1} sản phẩm` : "");
      return `<tr><td>${esc(o.id)}</td><td>${esc(cus(o.cid) ? cus(o.cid).name : "(đã xóa)")}</td><td>${esc(summary)}</td><td>${money(orderTotal(o))}</td><td><span class="status ${ovStatusClass[o.status]}">${esc(o.status)}</span></td></tr>`;
    }).join("");
    if (emptyMessage) emptyMessage.classList.toggle("hidden", rows.length > 0);
  }

  function refreshOverview() {
    const t = today(), y = daysAgo(1);
    const lowCount = data.products.filter((p) => !p.hidden && stockOf(p.id) <= data.settings.lowStock);
    const nums = overview.querySelectorAll(".stat-card h2");
    const descs = overview.querySelectorAll(".stat-card .stat-desc");
    if (nums.length >= 4) {
      const todayN = data.orders.filter((o) => o.date === t).length, yN = data.orders.filter((o) => o.date === y).length;
      nums[0].textContent = todayN;
      nums[1].textContent = data.products.length;
      nums[2].textContent = data.customers.length;
      nums[3].textContent = lowCount.length;
      if (descs.length >= 4) {
        const diff = yN ? Math.round(((todayN - yN) / yN) * 100) : null;
        descs[0].innerHTML = diff === null ? "Hôm qua chưa có đơn" : `<span class="${diff >= 0 ? "trend-up" : "trend-down"}">${diff >= 0 ? "↑" : "↓"} ${Math.abs(diff)}%</span> so với hôm qua`;
        descs[1].textContent = `${data.products.filter((p) => p.hidden).length} sản phẩm đang ẩn`;
        descs[2].textContent = `${data.customers.filter((c) => c.locked).length} tài khoản bị khóa`;
        descs[3].textContent = `Ngưỡng cảnh báo ≤ ${data.settings.lowStock}`;
      }
    }
    const nb = document.querySelector(".menu-count");
    if (nb) nb.textContent = data.orders.filter((o) => o.status === "Mới đặt").length;

    // Sản phẩm bán chạy
    const list = overview.querySelector(".product-list");
    if (list) {
      const sold = {};
      data.orders.filter((o) => o.status !== "Hủy").forEach((o) => o.items.forEach((i) => { sold[i.pid] = (sold[i.pid] || 0) + i.qty; }));
      const top = Object.entries(sold).sort((a, b) => b[1] - a[1]).slice(0, 3);
      const cls = ["yellow", "purple", "blue"];
      list.innerHTML = top.length ? top.map(([pid, n], k) => {
        const p = prod(pid);
        return `<div class="product"><span class="product-image ${cls[k]}">${esc(initials(p ? p.name : "?"))}</span><div><strong>${esc(p ? p.name : pid)}</strong><p>${esc(p ? catName(p.cat) : "")}</p></div><b>Đã bán: ${n}</b></div>`;
      }).join("") : `<p class="pp-empty">Chưa có dữ liệu bán hàng.</p>`;
    }
    // Cảnh báo tồn kho
    const sl = overview.querySelector(".stock-list");
    if (sl) {
      const low = lowCount.map((p) => ({ p, n: stockOf(p.id) })).sort((a, b) => a.n - b.n).slice(0, 5);
      sl.innerHTML = low.length ? low.map((x) => `<div><span>${esc(x.p.name)}</span><b>Còn ${x.n}</b></div>`).join("") : `<p class="pp-empty">Tất cả sản phẩm đều đủ hàng.</p>`;
    }
    showOrders();
  }

  /* =================================================================
     MENU + ĐIỀU HƯỚNG
     ================================================================= */
  const MENU = [
    { label: "TỔNG QUAN", items: [["Tổng quan", "ri-home-3-line"]] },
    { label: "QUẢN LÝ", items: [["Khách hàng", "ri-user-line"], ["Loại sản phẩm", "ri-price-tag-3-line"], ["Sản phẩm", "ri-box-3-line"], ["Nhập hàng", "ri-inbox-archive-line"], ["Giá bán", "ri-money-dollar-circle-line"], ["Đơn hàng", "ri-suitcase-line"], ["Tồn kho", "ri-stack-line"]] },
    { label: "HỆ THỐNG", items: [["Cài đặt", "ri-settings-4-line"]] },
  ];
  function buildMenu() {
    const nav = document.querySelector("#sidebar nav");
    if (!nav) return;
    nav.innerHTML = MENU.map((g) => `<p class="menu-label">${g.label}</p>` + g.items.map(([t, ic]) =>
      `<button class="menu-item${t === "Tổng quan" ? " active" : ""}" data-title="${t}"><div class="menu-icon flexRow-center"><i class="${ic}"></i></div><span class="menu-text">${t}</span>${t === "Đơn hàng" ? '<b class="menu-count">0</b>' : ""}</button>`).join("")).join("");
  }

  const PAGES = {
    "Khách hàng": pageCustomers, "Loại sản phẩm": pageCategories, "Sản phẩm": pageProducts, "Nhập hàng": pageImports,
    "Giá bán": pagePricing, "Đơn hàng": pageOrders, "Tồn kho": pageStock, "Cài đặt": pageSettings,
  };

  function navigate(title) {
    document.querySelectorAll(".menu-item").forEach((m) => m.classList.toggle("active", m.dataset.title === title));
    if (pageTitle) pageTitle.innerText = title;
    const sb = $("sidebar"); if (sb) sb.classList.remove("open");
    Object.keys(actions).forEach((k) => delete actions[k]);
    closeModal();
    window.scrollTo(0, 0);
    syncQueues();
    if (title === "Tổng quan" || !PAGES[title]) {
      overview.style.display = ""; view.style.display = "none"; current = null; refreshOverview(); return;
    }
    overview.style.display = "none"; view.style.display = "";
    PAGES[title]();
  }

  // Click menu (ủy quyền sự kiện, chịu được lớp trang trí đè lên nút)
  document.addEventListener("click", (e) => {
    let item = e.target.closest && e.target.closest(".menu-item");
    if (!item && e.target.closest && e.target.closest("#sidebar")) {
      item = document.elementsFromPoint(e.clientX, e.clientY).map((el) => el.closest && el.closest(".menu-item")).find(Boolean);
    }
    if (item) navigate(item.dataset.title);
  }, true);

  const mm = $("mobileMenu"); if (mm) mm.addEventListener("click", () => $("sidebar").classList.toggle("open"));
  const cb = $("collapseButton"); if (cb) cb.addEventListener("click", () => document.body.classList.toggle("sidebar-collapsed"));

  /* ---------- Khởi động ---------- */
  buildMenu();
  if (statusFilter) {
    statusFilter.innerHTML = `<option value="Tất cả">Tất cả trạng thái</option>` + ORDER_STATUS.map((s) => `<option>${s}</option>`).join("");
    statusFilter.addEventListener("change", showOrders);
  }
  if (searchInput) searchInput.addEventListener("input", showOrders);
  const addBtn = $("showFormButton"); if (addBtn) addBtn.style.display = "none"; // đơn hàng do khách đặt, admin chỉ xử lý
  const oForm = $("orderForm"); if (oForm) oForm.style.display = "none";
  save(); // ghi dữ liệu đã nâng cấp (migrate) để trang index đọc được ngay
  refreshOverview();
})();