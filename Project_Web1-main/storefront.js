// =====================================================================
// storefront.js — PETPET (trang index / cửa hàng)
//  1. Hiển thị sản phẩm do admin quản lý (đọc localStorage của admin.js)
//  2. Giỏ hàng popup/drawer + đặt hàng cho khách
//  3. PETPET.registerCustomer(): ghi khách mới đăng ký để admin nhận
// =====================================================================
(function () {
  "use strict";

  const KEY = {
    data: "petpet_admin_v3",
    customers: "petpet_new_customers",
    orders: "petpet_new_orders",
    user: "currentUser",
  };
  const LOGIN_URL = "./src/html/signUp.html?mode=register";

  /* ---------- Tiện ích ---------- */
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );
  const money = (n) => Math.round(Number(n || 0)).toLocaleString("en-US") + " đ";
  const initials = (s) =>
    String(s).split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase();
  const today = () => {
    const d = new Date(),
      p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  };
  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch (e) {
      return fallback;
    }
  };
  const write = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  };
  const toast = (text) => {
    const t = Object.assign(document.createElement("div"), {
      className: "pp-toast",
      textContent: text,
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  };

  /* ---------- Quản lý User & Giỏ hàng ---------- */
  const user = () => read(KEY.user, null);
  const uid = (u) => {
    if (!u || typeof u !== "object") return "guest";
    return String(u.id || u.username || u.email || u.name || "guest").trim().toLowerCase();
  };
  const cartKey = () => `petpet_cart_${uid(user())}`;
  const getCart = () => read(cartKey(), []);
  const setCart = (cart) => {
    write(cartKey(), Array.isArray(cart) ? cart : []);
    updateBadge();
  };

  /* ---------- Nút giỏ hàng có sẵn ---------- */
  const cartBtn =
    $("cartBtn") ||
    document.querySelector(".cart-btn-wrapper") ||
    document.querySelector(".cart-btn");

  /* ---------- Dữ liệu từ admin ---------- */
  const load = () => {
    const d = read(KEY.data, null);
    return d && Array.isArray(d.products) && Array.isArray(d.categories) ? d : null;
  };
  const stockOf = (data, pid) =>
    (data.log || []).reduce(
      (s, e) => (e.pid === pid ? s + (e.type === "out" ? -e.qty : e.qty) : s),
      0
    );

  function calc(data, p) {
    const c = data.categories.find((x) => x.id === p.cat);
    const margin = p.margin != null ? p.margin : (c ? c.margin : 0) || 0;
    const base = Math.round((p.cost * (1 + margin / 100)) / 100) * 100;
    const disc = Number(p.discount) || 0;
    return {
      base,
      disc,
      sell: disc > 0 ? Math.round((base * (1 - disc / 100)) / 100) * 100 : base,
    };
  }

  const sellable = (data, p) => {
    const c = data.categories.find((x) => x.id === p.cat);
    return !p.hidden && !(c && c.hidden) && p.cost > 0;
  };

  /* ---------- Giao diện CSS Drawer Giỏ hàng ---------- */
  document.head.appendChild(
    Object.assign(document.createElement("style"), {
      textContent: `
.pp-ph{width:100%;aspect-ratio:1/1;background:#fff3c9;color:#8f6800;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:700}
.pp-empty{padding:24px;color:#777;font-size:14px;text-align:center}
.pp-stock{font-size:12px;font-weight:700;color:#d32f2f;margin-top:4px}
.pp-stock--low{color:#e67e00}
.pp-add{margin-top:8px;width:100%;border:0;border-radius:8px;background:#ffc83d;color:#29292d;font-weight:700;font-size:13px;padding:9px 10px;cursor:pointer}
.pp-add:hover{filter:brightness(.95)}
.pp-add:disabled{background:#eee;color:#aaa;cursor:not-allowed}
.pp-ov{position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.45);display:flex;justify-content:flex-end}
.pp-ov[hidden]{display:none}
.pp-cart{background:#fff;width:min(420px,100%);height:100%;display:flex;flex-direction:column;box-shadow:-2px 0 10px rgba(0,0,0,0.15)}
.pp-cart-h{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-bottom:1px solid #eee}
.pp-cart-h h3{margin:0;font-size:18px}
.pp-cart-h button{border:0;background:none;font-size:22px;cursor:pointer}
.pp-list{flex:1;overflow-y:auto;padding:8px 18px}
.pp-line{display:flex;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid #f0f0f0}
.pp-line .pp-th{width:56px;height:56px;flex:none;border-radius:8px;object-fit:cover;background:#fff3c9;color:#8f6800;display:flex;align-items:center;justify-content:center;font-weight:700}
.pp-info{flex:1;min-width:0;font-size:13px;line-height:1.4}
.pp-info div{font-weight:600}
.pp-qty{display:flex;align-items:center;gap:6px;margin-top:6px}
.pp-qty button{width:26px;height:26px;border:1px solid #ddd;background:#fff;border-radius:6px;cursor:pointer}
.pp-qty .pp-rm{width:auto;border:0;color:#c62828;font-size:12px;margin-left:6px;background:none}
.pp-foot{border-top:1px solid #eee;padding:14px 18px;display:grid;gap:8px}
.pp-foot input{padding:9px 11px;border:1px solid #ddd;border-radius:6px;font-size:13px;font-family:inherit;width:100%;box-sizing:border-box}
.pp-total{display:flex;justify-content:space-between;font-size:15px}
.pp-total b{font-size:18px;color:#d32f2f}
.pp-msg{color:#c62828;font-size:12px;margin:0}
.pp-msg:empty{display:none}
.pp-order{border:0;border-radius:8px;background:#ffc83d;color:#29292d;font-weight:700;font-size:14px;padding:12px;cursor:pointer}
.pp-toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:9999;background:#323232;color:#fff;padding:10px 18px;border-radius:8px;font-size:14px}
`,
    })
  );

  /* =================================================================
     1. HIỂN THỊ SẢN PHẨM
     ================================================================= */
  const thumb = (p, cls) =>
    p.image
      ? `<img class="${cls}" src="${esc(p.image)}" alt="${esc(p.name)}">`
      : `<div class="${cls}">${esc(initials(p.name))}</div>`;

  function cardHtml(data, p) {
    const { base, sell, disc } = calc(data, p);
    const stock = stockOf(data, p.id);
    const warn =
      stock <= 0
        ? `<div class="pp-stock">Hết hàng</div>`
        : stock <= ((data.settings && data.settings.lowStock) || 10)
        ? `<div class="pp-stock pp-stock--low">Chỉ còn ${stock} sản phẩm</div>`
        : "";

    return `<div class="product-card">
      <div class="product-img-box">${
        p.image
          ? `<img src="${esc(p.image)}" alt="${esc(p.name)}">`
          : `<div class="pp-ph">${esc(initials(p.name))}</div>`
      }</div>
      <div class="product-info">
        <h3 class="product-name" title="${esc(p.desc)}">${esc(p.name)}</h3>
        <div class="product-rating">${'<i class="ri-star-fill"></i>'.repeat(5)}</div>
        <div class="price-box${disc ? "" : " no-discount"}">${
      disc
        ? `<span class="discount-badge">-${disc}%</span><span class="old-price">${money(
            base
          )}</span>`
        : ""
    }</div>
        <div class="current-price">${money(sell)}</div>
        ${warn}
        <button type="button" class="pp-add" data-add="${esc(p.id)}" ${
      stock <= 0 ? "disabled" : ""
    }>🛒 Thêm vào giỏ</button>
      </div></div>`;
  }

  function renderProducts() {
    const data = load();
    if (!data) return;
    const visible = data.products.filter((p) => sellable(data, p));
    const grids = document.querySelectorAll(".product-grid");
    [["dealGrid", "deal", 0], ["comboGrid", "combo", 1]].forEach(([id, group, i]) => {
      const grid = $(id) || grids[i];
      if (!grid) return;
      const list = visible.filter((p) => (p.group || "deal") === group);
      grid.innerHTML = list.length
        ? list.map((p) => cardHtml(data, p)).join("")
        : `<p class="pp-empty">Chưa có sản phẩm.</p>`;
    });
  }

  /* =================================================================
     2. DRAWER GIỎ HÀNG & ĐẶT HÀNG
     ================================================================= */
  const overlay = Object.assign(document.createElement("div"), {
    className: "pp-ov",
    hidden: true,
  });
  overlay.innerHTML = `<div class="pp-cart" role="dialog" aria-label="Giỏ hàng">
    <div class="pp-cart-h"><h3>Giỏ hàng của bạn</h3><button type="button" data-act="close">✕</button></div>
    <div class="pp-list" id="ppList"></div><div class="pp-foot" id="ppFoot"></div></div>`;
  document.body.appendChild(overlay);

  function updateBadge() {
    const el = $("cartCount");
    const sidebarEl = $("sidebarCartCount");
    const n = getCart().reduce((s, l) => s + (Number(l.qty) || 0), 0);

    if (el) {
      el.textContent = n;
      el.hidden = n === 0;
      el.style.display = n > 0 ? "" : "none";
    }
    if (sidebarEl) {
      sidebarEl.textContent = n;
    }
  }

  function setQty(pid, qty) {
    const data = load();
    const stock = data ? stockOf(data, pid) : 0;
    if (qty > stock)
      return stock > 0 ? `Chỉ còn ${stock} sản phẩm trong kho.` : "Sản phẩm đã hết hàng.";
    const cart = getCart();
    const line = cart.find((l) => l.pid === pid);
    if (line) line.qty = qty;
    else cart.push({ pid, qty });
    setCart(cart.filter((l) => l.qty > 0));
    return null;
  }

  const qtyOf = (pid) => (getCart().find((l) => l.pid === pid) || { qty: 0 }).qty;

  function addToCart(pid) {
    if (!user()) {
      if (confirm("Bạn cần đăng nhập để thêm vào giỏ hàng. Đăng nhập ngay?")) {
        location.href = LOGIN_URL;
      }
      return;
    }
    const data = load();
    const p = data && data.products.find((x) => x.id === pid);
    if (!p || !sellable(data, p)) return toast("Sản phẩm hiện không bán.");
    toast(setQty(pid, qtyOf(pid) + 1) || "Đã thêm vào giỏ hàng ✔");
  }

  function renderCart(msg = "") {
    const data = load(),
      u = user();
    const lines = data
      ? getCart()
          .map((l) => ({ ...l, p: data.products.find((x) => x.id === l.pid) }))
          .filter((l) => l.p)
      : [];

    if (!lines.length) {
      $("ppList").innerHTML = `<p class="pp-empty">Giỏ hàng đang trống.</p>`;
      $("ppFoot").innerHTML = "";
      return;
    }

    let total = 0;
    $("ppList").innerHTML = lines
      .map(({ p, qty }) => {
        const { sell } = calc(data, p);
        const subtotal = sell * qty;
        total += subtotal;
        return `<div class="pp-line">${thumb(p, "pp-th")}
          <div class="pp-info">
            <div>${esc(p.name)}</div>
            ${money(sell)}
            <div class="pp-qty">
              <button type="button" data-act="dec" data-id="${esc(p.id)}">−</button>
              <span>${qty}</span>
              <button type="button" data-act="inc" data-id="${esc(p.id)}">+</button>
              <button type="button" class="pp-rm" data-act="del" data-id="${esc(p.id)}">Xóa</button>
            </div>
          </div>
          <b>${money(subtotal)}</b>
        </div>`;
      })
      .join("");

    const known =
      (data.customers || []).find(
        (c) => String(c.username).toLowerCase() === uid(u).toLowerCase()
      ) || {};
    const keep = (id, fallback) => ($(id) ? $(id).value : fallback || "");

    $("ppFoot").innerHTML = `
      <div class="pp-total"><span>Tổng tiền</span><b>${money(total)}</b></div>
      <input id="ppPhone" type="tel" placeholder="Số điện thoại *" value="${esc(
        keep("ppPhone", known.phone || (u && u.phone))
      )}">
      <input id="ppAddr" type="text" placeholder="Địa chỉ giao hàng *" value="${esc(
        keep("ppAddr", known.address || (u && u.address))
      )}">
      <p class="pp-msg">${esc(msg)}</p>
      <button type="button" class="pp-order" data-act="order">Đặt hàng</button>`;
  }

  function placeOrder() {
    const u = user(),
      data = load(),
      cart = getCart();
    const fail = (m) => renderCart(m);
    if (!u || !data || !cart.length) return fail("Giỏ hàng đang trống.");
    const phone = $("ppPhone").value.trim(),
      address = $("ppAddr").value.trim();
    if (!/^0\d{9,10}$/.test(phone)) return fail("Số điện thoại không hợp lệ (VD: 0901234567).");
    if (address.length < 5) return fail("Vui lòng nhập địa chỉ giao hàng.");

    const items = [];
    for (const l of cart) {
      const p = data.products.find((x) => x.id === l.pid);
      if (!p || !sellable(data, p))
        return fail(`"${p ? p.name : l.pid}" hiện không bán, hãy xóa khỏi giỏ.`);
      const stock = stockOf(data, p.id);
      if (l.qty > stock) return fail(`"${p.name}" chỉ còn ${stock} sản phẩm.`);
      items.push({ pid: p.id, qty: l.qty, price: calc(data, p).sell });
    }

    const queue = read(KEY.orders, []);
    queue.push({
      ref: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      date: today(),
      username: uid(u),
      name: u.name || uid(u),
      email: u.email || "",
      phone,
      address,
      items,
    });

    if (!write(KEY.orders, queue)) return fail("Không gửi được đơn hàng, vui lòng thử lại.");
    setCart([]);
    overlay.hidden = true;
    toast("Đặt hàng thành công! Cảm ơn bạn 🐾");
  }

  const openCart = () => {
    if (!user()) {
      if (confirm("Bạn cần đăng nhập để xem giỏ hàng. Đăng nhập ngay?")) {
        location.href = LOGIN_URL;
      }
      return;
    }
    renderCart();
    overlay.hidden = false;
  };

  if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
  }

  overlay.addEventListener("mousedown", (e) => {
    if (e.target === overlay) overlay.hidden = true;
  });

  overlay.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const { act, id } = b.dataset;
    if (act === "close") overlay.hidden = true;
    else if (act === "order") placeOrder();
    else {
      const err = setQty(id, act === "inc" ? qtyOf(id) + 1 : act === "dec" ? qtyOf(id) - 1 : 0);
      renderCart(err || "");
    }
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (b) addToCart(b.dataset.add);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.hidden = true;
  });

  /* =================================================================
     3. ĐĂNG KÝ KHÁCH HÀNG (DÀNH CHO ADMIN QUẢN LÝ)
     ================================================================= */
  window.PETPET = Object.assign(window.PETPET || {}, {
    registerCustomer(u) {
      const username = String((u && u.username) || "").trim();
      if (!username) return { ok: false, message: "Thiếu tên tài khoản." };
      const same = (c) => String(c.username).toLowerCase() === username.toLowerCase();
      const data = load(),
        queue = read(KEY.customers, []);
      if ((data && (data.customers || []).some(same)) || queue.some(same)) {
        return { ok: false, message: "Tên tài khoản đã tồn tại." };
      }
      queue.push({
        name: String(u.name || username).trim(),
        phone: String(u.phone || "").trim(),
        email: String(u.email || "").trim(),
        address: String(u.address || "").trim(),
        username,
        password: String(u.password || ""),
      });
      return write(KEY.customers, queue)
        ? { ok: true }
        : { ok: false, message: "Không lưu được tài khoản." };
    },
  });

  /* ---------- Khởi động ---------- */
  renderProducts();
  updateBadge();
  window.addEventListener("storage", (e) => {
    if (e.key === KEY.data) renderProducts();
    updateBadge();
  });
  window.addEventListener("focus", () => {
    renderProducts();
    updateBadge();
  });
})();