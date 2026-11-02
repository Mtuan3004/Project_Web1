(function () {
  "use strict";
  const STORAGE_KEY = "petpet_admin_v3";

  function getAdminData() {
    try {
      return (
        JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
          products: [],
          categories: [],
          orders: [],
          customers: [],
        }
      );
    } catch (e) {
      return { products: [], categories: [], orders: [], customers: [] };
    }
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("petpet_cart")) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("petpet_cart", JSON.stringify(cart));
    renderPage();
  }

  function formatVND(n) {
    return Math.round(Number(n || 0)).toLocaleString("vi-VN") + " đ";
  }

  // Cập nhật con số trên icon giỏ hàng
  function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById("cartCount");
    if (badge) {
      badge.textContent = count;
    }
  }

  window.updateCartQty = function (index, delta) {
    let cart = getCart();
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart(cart);
  };

  window.removeCartItem = function (index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
  };

  window.toggleCheckoutAddress = function (val) {
    const box = document.getElementById("checkout-custom-addr-box");
    if (box) box.style.display = val === "custom" ? "flex" : "none";
  };

  function renderPage() {
    renderCartSection();
    renderMyOrdersSection();
    updateCartBadge();
  }

  function renderCartSection() {
    const container = document.getElementById("cartAndCheckoutContainer");
    const cart = getCart();
    const adminData = getAdminData();
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
      name: "Khách vãng lai",
      phone: "",
      address: "",
    };

    if (cart.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:#777; padding:20px;">Giỏ hàng của bạn đang trống.</p>`;
      return;
    }

    let totalAmount = 0;
    let itemsHtml = "";

    cart.forEach((item, index) => {
      const p = adminData.products.find((prod) => prod.id === item.pid);
      if (!p) return;
      const unitPrice = p.cost
        ? Math.round(
            p.cost *
              (1 + (p.margin || 20) / 100) *
              (1 - (p.discount || 0) / 100),
          )
        : 50000;
      const subtotal = unitPrice * item.qty;
      totalAmount += subtotal;

      itemsHtml += `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid #f1f5f9;">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${p.image || "https://placehold.co/80x80"}" style="width:50px; height:50px; object-fit:cover; border-radius:8px; background:#eee;" onerror="this.src='https://placehold.co/80x80'">
            <div>
              <h4 style="font-size:14px; font-weight:bold; margin:0 0 4px 0; color:#1e293b;">${p.name}</h4>
              <span style="font-size:12px; color:#10b981; font-weight:600;">${formatVND(unitPrice)}</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="display:flex; align-items:center; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden;">
              <button type="button" onclick="window.updateCartQty(${index}, -1)" style="padding:4px 10px; background:#f8fafc; border:none; cursor:pointer;">-</button>
              <span style="padding:4px 12px; font-size:13px; font-weight:600;">${item.qty}</span>
              <button type="button" onclick="window.updateCartQty(${index}, 1)" style="padding:4px 10px; background:#f8fafc; border:none; cursor:pointer;">+</button>
            </div>
            <span style="font-weight:bold; font-size:14px; width:90px; text-align:right;">${formatVND(subtotal)}</span>
            <button type="button" onclick="window.removeCartItem(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:18px;"><i class="ri-delete-bin-line"></i></button>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="cart-grid" style="display:grid; grid-template-columns: 1fr 380px; gap:24px; align-items:start;">
        <div>${itemsHtml}</div>
        <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #e2e8f0;">
          <h3 style="font-size:15px; font-weight:bold; margin-bottom:12px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">Thông Tin Giao Hàng</h3>
          <div style="margin-bottom:12px;">
            <label style="display:block; font-size:11px; font-weight:bold; margin-bottom:4px;">Địa chỉ nhận hàng</label>
            <select id="checkout-address-type" onchange="window.toggleCheckoutAddress(this.value)" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:8px; font-size:12px;">
              <option value="profile">Sử dụng địa chỉ từ tài khoản (${currentUser.name || currentUser.fullname || "Cá nhân"})</option>
              <option value="custom">Nhập địa chỉ nhận hàng mới</option>
            </select>
          </div>
          <div id="checkout-custom-addr-box" style="display:none; margin-bottom:12px; flex-direction:column; gap:8px;">
            <input type="text" id="checkout-name" placeholder="Tên người nhận" value="${currentUser.name || ""}" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:8px; font-size:12px;">
            <input type="text" id="checkout-phone" placeholder="Số điện thoại" value="${currentUser.phone || ""}" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:8px; font-size:12px;">
            <textarea id="checkout-address" placeholder="Địa chỉ chi tiết..." style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:8px; font-size:12px;" rows="2">${currentUser.address || ""}</textarea>
          </div>
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:11px; font-weight:bold; margin-bottom:6px;">Phương thức thanh toán</label>
            <div style="display:flex; flex-direction:column; gap:6px; font-size:11px;">
              <label style="display:flex; align-items:center; gap:8px; padding:6px; background:#fff; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer;"><input type="radio" name="paymentMethod" value="COD" checked> Thanh toán tiền mặt khi nhận hàng (COD)</label>
              <label style="display:flex; align-items:center; gap:8px; padding:6px; background:#fff; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer;"><input type="radio" name="paymentMethod" value="BANK"> Chuyển khoản Ngân hàng (QR Code)</label>
              <label style="display:flex; align-items:center; gap:8px; padding:6px; background:#fff; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer;"><input type="radio" name="paymentMethod" value="ONLINE"> Thanh toán trực tuyến MoMo / VNPAY</label>
            </div>
          </div>
          <div style="border-top:1px solid #e2e8f0; padding-top:12px; display:flex; flex-direction:column; gap:6px;">
            <div style="display:flex; justify-content:space-between; font-size:13px;"><span>Tạm tính</span><span>${formatVND(totalAmount)}</span></div>
            <div style="display:flex; justify-content:space-between; font-size:13px;"><span>Phí vận chuyển</span><span style="color:#10b981; font-weight:600;">Miễn phí</span></div>
            <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:bold; padding-top:4px;"><span>Tổng thanh toán</span><span style="color:#10b981; font-size:18px;">${formatVND(totalAmount)}</span></div>
            <button type="button" onclick="window.processCheckoutPage()" class="btn-primary-custom" style="margin-top:10px;">Xác Nhận Đặt Hàng</button>
          </div>
        </div>
      </div>
    `;
  }

  window.processCheckoutPage = function () {
    const cart = getCart();
    if (cart.length === 0) return alert("Giỏ hàng trống!");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      window.location.href = "./src/html/signUp.html";
      return;
    }

    const adminData = getAdminData();
    const addressType = document.getElementById("checkout-address-type").value;
    let rName = currentUser.name || "Khách hàng";
    let rPhone = currentUser.phone || "0900000000";
    let rAddr = currentUser.address || "TP.HCM";

    if (addressType === "custom") {
      rName = document.getElementById("checkout-name").value || rName;
      rPhone = document.getElementById("checkout-phone").value || rPhone;
      rAddr = document.getElementById("checkout-address").value || rAddr;
    }

    const paymentMethod = document.querySelector(
      'input[name="paymentMethod"]:checked',
    ).value;
    let totalAmount = 0;
    const orderItems = cart.map((item) => {
      const p = adminData.products.find((prod) => prod.id === item.pid);
      const price =
        p && p.cost
          ? Math.round(
              p.cost *
                (1 + (p.margin || 20) / 100) *
                (1 - (p.discount || 0) / 100),
            )
          : 50000;
      totalAmount += price * item.qty;
      return {
        pid: item.pid,
        productName: p ? p.name : "Sản phẩm",
        qty: item.qty,
        price: price,
      };
    });

    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: orderId,
      ref: "WEB_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      username: currentUser.email || currentUser.name,
      name: rName,
      phone: rPhone,
      address: rAddr,
      paymentMethod: paymentMethod,
      status: "Mới đặt",
      deducted: false,
      items: orderItems,
      totalAmount: totalAmount,
    };

    // Lưu đơn hàng vào kho admin
    adminData.orders.push(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData));

    // Xóa giỏ hàng và cập nhật ngay lập tức badge giỏ hàng về 0
    localStorage.removeItem("petpet_cart");
    updateCartBadge();

    // Hiển thị modal thông báo đặt hàng thành công
    showSuccessOrderModal(newOrder);
    renderPage();
  };

  // Giao diện Modal Popup Đặt Hàng Thành Công
  function showSuccessOrderModal(order) {
    let successModal = document.getElementById("petpetSuccessOrderModal");
    if (!successModal) {
      successModal = document.createElement("div");
      successModal.id = "petpetSuccessOrderModal";
      successModal.style.cssText =
        "display:flex; position:fixed; inset:0; z-index:99999; background:rgba(0,0,0,0.6); align-items:center; justify-content:center;";
      document.body.appendChild(successModal);
    }

    const itemsSummaryHtml = order.items
      .map(
        (i) => `
      <div style="display:flex; justify-content:space-between; font-size:12px; color:#334155; margin-bottom:4px;">
          <span>${i.productName} x ${i.qty}</span>
          <span style="font-weight:600;">${formatVND(i.price * i.qty)}</span>
      </div>
    `,
      )
      .join("");

    successModal.innerHTML = `
      <div style="background:#fff; width:min(500px, 95%); border-radius:14px; padding:20px; position:relative; box-shadow:0 15px 35px rgba(0,0,0,0.2); text-align:center;">
          <button type="button" onclick="document.getElementById('petpetSuccessOrderModal').style.display='none'; location.reload();" style="position:absolute; top:14px; right:14px; background:none; border:none; font-size:18px; cursor:pointer; color:#94a3b8;">✕</button>
          
          <div style="width:56px; height:56px; background:#d1fae5; color:#059669; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 10px auto; font-size:28px;">
              <i class="ri-check-line"></i>
          </div>

          <h3 style="font-size:18px; font-weight:bold; color:#1e293b; margin-bottom:4px;">Đặt Hàng Thành Công!</h3>
          <p style="font-size:12px; color:#64748b; margin-bottom:14px;">Mã hóa đơn đơn hàng của bạn là <b style="color:#0f172a;">#${order.id}</b></p>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px; text-align:left; margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:bold; color:#1e293b; border-bottom:1px solid #e2e8f0; padding-bottom:6px; margin-bottom:6px;">
                  <span>Người nhận: ${order.name}</span>
                  <span>SĐT: ${order.phone}</span>
              </div>
              <p style="font-size:11px; color:#475569; margin-bottom:4px;"><b>Địa chỉ giao:</b> ${order.address}</p>
              <p style="font-size:11px; color:#475569; margin-bottom:8px;"><b>Phương thức:</b> <span style="font-weight:600; color:#1e293b;">${order.paymentMethod}</span></p>
              
              <div style="border-top:1px dashed #cbd5e1; padding-top:6px; margin-bottom:6px;">
                  ${itemsSummaryHtml}
              </div>

              <div style="border-top:1px solid #e2e8f0; padding-top:6px; display:flex; justify-content:space-between; font-weight:bold; font-size:13px; color:#0f172a;">
                  <span>Tổng hóa đơn:</span>
                  <span style="color:#059669;">${formatVND(order.totalAmount)}</span>
              </div>
          </div>

          <button type="button" onclick="document.getElementById('petpetSuccessOrderModal').style.display='none'; location.reload();" style="width:100%; padding:12px; background:#ffc83d; color:#000; font-weight:bold; border:none; border-radius:8px; cursor:pointer; font-size:13px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
              Xem Đơn Hàng Của Tôi
          </button>
      </div>
    `;
    successModal.style.display = "flex";
  }

  function renderMyOrdersSection() {
    const container = document.getElementById("myOrdersPageContainer");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      container.innerHTML = `<p style="text-align:center; color:#777; padding:20px;">Vui lòng đăng nhập để xem đơn hàng của bạn.</p>`;
      return;
    }

    const adminData = getAdminData();
    const uKey = currentUser.email || currentUser.name;
    const myOrders = adminData.orders.filter(
      (o) => o.username === uKey || o.name === currentUser.name,
    );

    if (myOrders.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:#777; padding:20px;">Bạn chưa có đơn hàng nào.</p>`;
      return;
    }

    let html = `<table><thead><tr><th>Mã đơn</th><th>Ngày đặt</th><th>Địa chỉ nhận</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead><tbody>`;
    myOrders.forEach((o) => {
      const total =
        o.totalAmount || o.items.reduce((s, i) => s + i.qty * i.price, 0);
      html += `<tr>
        <td style="font-weight:bold;">${o.id}</td>
        <td>${o.date}</td>
        <td>${o.address}</td>
        <td style="font-weight:bold; color:#10b981;">${formatVND(total)}</td>
        <td><span style="padding:4px 8px; border-radius:6px; background:#fff3c4; color:#8a6400; font-weight:bold; font-size:11px;">${o.status}</span></td>
      </tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
  }

  document.addEventListener("DOMContentLoaded", renderPage);
})();
