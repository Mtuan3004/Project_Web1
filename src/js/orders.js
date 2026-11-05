(function () {
  "use strict";
  const STORAGE_KEY = "petpet_admin_v3";

  // Khóa localStorage lưu lịch sử giỏ hàng & thông tin khách hàng
  const CART_HISTORY_KEY = "petpet_cart_history";

  function getCartHistory() {
    try {
      return JSON.parse(localStorage.getItem(CART_HISTORY_KEY)) || [];
    } catch (e) {
      console.error("Lỗi đọc lịch sử giỏ hàng:", e);
      return [];
    }
  }

  // Hàm lưu lịch sử giỏ hàng nâng cao (chứa đầy đủ thông tin khách hàng & sản phẩm)
  function saveCartToHistory(cartItems, customerInfo = null) {
    try {
      if (!cartItems || cartItems.length === 0) return;

      const adminData = getAdminData();
      const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

      // Chuẩn hóa danh sách sản phẩm kèm thông tin chi tiết
      const detailedItems = cartItems.map((item) => {
        const p = adminData.products.find((prod) => prod.id === item.pid);
        const price = getProductPrice(p);
        return {
          pid: item.pid,
          productName: p ? p.name : "Sản phẩm",
          qty: item.qty,
          price: price,
          subtotal: price * item.qty,
        };
      });

      const totalAmount = detailedItems.reduce((sum, i) => sum + i.subtotal, 0);

      // Tạo đối tượng bản ghi lịch sử đầy đủ thuộc tính
      const historyRecord = {
        historyId: "HIS-" + Date.now(),
        timestamp: new Date().toISOString(),
        dateFormatted: new Date().toLocaleString("vi-VN"),
        customer: {
          id: getUserKey(currentUser) || "GUEST",
          name:
            customerInfo?.name ||
            currentUser.name ||
            currentUser.fullname ||
            "Khách vãng lai",
          phone: customerInfo?.phone || currentUser.phone || "Chưa có SĐT",
          address:
            customerInfo?.address || currentUser.address || "Chưa có địa chỉ",
        },
        paymentMethod: customerInfo?.paymentMethod || "Chưa chọn",
        totalAmount: totalAmount,
        items: detailedItems,
      };

      let history = getCartHistory();
      history.push(historyRecord);

      localStorage.setItem(CART_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Lỗi lưu lịch sử giỏ hàng:", e);
    }
  }

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

  function getProductPrice(p) {
    if (!p) return 50000;
    if (typeof p.price === "number" && !isNaN(p.price)) {
      return p.price;
    }
    if (p.cost) {
      return Math.round(
        p.cost * (1 + (p.margin || 20) / 100) * (1 - (p.discount || 0) / 100),
      );
    }
    return 50000;
  }

  function getUserKey(currentUser) {
    if (!currentUser) return "";
    return currentUser.email || currentUser.username || currentUser.name || "";
  }

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
      container.innerHTML = `
      <div style="font-family: 'Be Vietnam Pro', sans-serif; text-align:center; padding:60px 20px; background:#fff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.04);">
          <i class="ri-shopping-cart-2-line" style="font-size:64px; color:#cbd5e1; display:block; margin-bottom:16px;"></i>
          <p style="font-size:18px; color:#64748b; font-weight:600; margin:0;">Giỏ hàng của bạn đang trống.</p>
        </div>
        `;
      return;
    }

    let totalAmount = 0;
    let itemsHtml = "";

    cart.forEach((item, index) => {
      const p = adminData.products.find((prod) => prod.id === item.pid);
      if (!p) return;
      const unitPrice = getProductPrice(p);
      const subtotal = unitPrice * item.qty;
      totalAmount += subtotal;

      itemsHtml += `
        <div style="font-family: 'Be Vietnam Pro', sans-serif; display:flex; align-items:center; justify-content:space-between; padding:20px; background:#fff; border:1px solid #e2e8f0; border-radius:14px; margin-bottom:16px; box-shadow:0 2px 6px rgba(0,0,0,0.03); gap:20px;">
          <div style="display:flex; align-items:center; gap:20px; flex:1;">
            <img src="${p.image || "https://placehold.co/90x90"}" style="width:80px; height:80px; object-fit:cover; border-radius:12px; background:#f8fafc; border:1px solid #f1f5f9;" onerror="this.src='https://placehold.co/90x90'">
            <div>
              <h4 style="font-family: 'Be Vietnam Pro', sans-serif; font-size:18px; font-weight:700; margin:0 0 8px 0; color:#0f172a; line-height:1.4;">${p.name}</h4>
              <span style="font-family: 'Be Vietnam Pro', sans-serif; font-size:16px; color:#059669; font-weight:700;">${formatVND(unitPrice)}</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:24px;">
            <div style="display:flex; align-items:center; border:2px solid #cbd5e1; border-radius:10px; overflow:hidden; background:#f8fafc;">
              <button type="button" onclick="window.updateCartQty(${index}, -1)" style="font-family: 'Be Vietnam Pro', sans-serif; padding:10px 18px; background:#f1f5f9; border:none; cursor:pointer; font-size:18px; font-weight:bold; color:#334155;">-</button>
              <span style="font-family: 'Be Vietnam Pro', sans-serif; padding:10px 18px; font-size:18px; font-weight:800; min-width:44px; text-align:center; color:#0f172a;">${item.qty}</span>
              <button type="button" onclick="window.updateCartQty(${index}, 1)" style="font-family: 'Be Vietnam Pro', sans-serif; padding:10px 18px; background:#f1f5f9; border:none; cursor:pointer; font-size:18px; font-weight:bold; color:#334155;">+</button>
            </div>
            <span style="font-family: 'Be Vietnam Pro', sans-serif; font-weight:800; font-size:18px; min-width:130px; text-align:right; color:#0f172a;">${formatVND(subtotal)}</span>
            <button type="button" onclick="window.removeCartItem(${index})" style="background:#fee2e2; border:none; color:#ef4444; cursor:pointer; font-size:22px; width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center;"><i class="ri-delete-bin-line"></i></button>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="cart-grid" style="font-family: 'Be Vietnam Pro', sans-serif; display:grid; grid-template-columns: 1fr 460px; gap:30px; align-items:start;">
        <div>${itemsHtml}</div>
        <div style="font-family: 'Be Vietnam Pro', sans-serif; background:#fff; padding:28px; border-radius:18px; border:1px solid #e2e8f0; box-shadow:0 6px 20px rgba(0,0,0,0.06);">
          <h3 style="font-family: 'Be Vietnam Pro', sans-serif; font-size:22px; font-weight:800; margin-bottom:20px; border-bottom:2px solid #f1f5f9; padding-bottom:12px; color:#0f172a;">Thông Tin Giao Hàng</h3>
          
          <div style="margin-bottom:20px;">
            <label style="font-family: 'Be Vietnam Pro', sans-serif; display:block; font-size:15px; font-weight:700; margin-bottom:8px; color:#334155;">Địa chỉ nhận hàng</label>
            <select id="checkout-address-type" onchange="window.toggleCheckoutAddress(this.value)" style="font-family: 'Be Vietnam Pro', sans-serif; width:100%; padding:12px 14px; border:2px solid #cbd5e1; border-radius:12px; font-size:15px; color:#0f172a; outline:none; background:#fff; font-weight:500;">
              <option value="profile">Sử dụng địa chỉ từ tài khoản (${currentUser.name || currentUser.fullname || "Cá nhân"})</option>
              <option value="custom">Nhập địa chỉ nhận hàng mới</option>
            </select>
          </div>

          <div id="checkout-custom-addr-box" style="display:none; margin-bottom:20px; flex-direction:column; gap:12px;">
            <input type="text" id="checkout-name" placeholder="Tên người nhận" value="${currentUser.name || currentUser.fullname || ""}" style="font-family: 'Be Vietnam Pro', sans-serif; width:100%; padding:12px 14px; border:2px solid #cbd5e1; border-radius:12px; font-size:15px;">
            <input type="text" id="checkout-phone" placeholder="Số điện thoại" value="${currentUser.phone || ""}" style="font-family: 'Be Vietnam Pro', sans-serif; width:100%; padding:12px 14px; border:2px solid #cbd5e1; border-radius:12px; font-size:15px;">
            <textarea id="checkout-address" placeholder="Địa chỉ chi tiết..." style="font-family: 'Be Vietnam Pro', sans-serif; width:100%; padding:12px 14px; border:2px solid #cbd5e1; border-radius:12px; font-size:15px;" rows="3">${currentUser.address || ""}</textarea>
          </div>

          <div style="margin-bottom:24px;">
            <label style="font-family: 'Be Vietnam Pro', sans-serif; display:block; font-size:15px; font-weight:700; margin-bottom:10px; color:#334155;">Phương thức thanh toán</label>
            <div style="display:flex; flex-direction:column; gap:10px; font-size:15px;">
              <label style="font-family: 'Be Vietnam Pro', sans-serif; display:flex; align-items:center; gap:12px; padding:12px 14px; background:#f8fafc; border:2px solid #e2e8f0; border-radius:10px; cursor:pointer; font-weight:600;"><input type="radio" name="paymentMethod" value="COD" checked style="width:18px; height:18px;"> Thanh toán tiền mặt khi nhận hàng (COD)</label>
              <label style="font-family: 'Be Vietnam Pro', sans-serif; display:flex; align-items:center; gap:12px; padding:12px 14px; background:#f8fafc; border:2px solid #e2e8f0; border-radius:10px; cursor:pointer; font-weight:600;"><input type="radio" name="paymentMethod" value="BANK" style="width:18px; height:18px;"> Chuyển khoản Ngân hàng (QR Code)</label>
              <label style="font-family: 'Be Vietnam Pro', sans-serif; display:flex; align-items:center; gap:12px; padding:12px 14px; background:#f8fafc; border:2px solid #e2e8f0; border-radius:10px; cursor:pointer; font-weight:600;"><input type="radio" name="paymentMethod" value="ONLINE" style="width:18px; height:18px;"> Thanh toán trực tuyến MoMo / VNPAY</label>
            </div>
          </div>

          <div style="border-top:2px solid #f1f5f9; padding-top:20px; display:flex; flex-direction:column; gap:12px;">
            <div style="font-family: 'Be Vietnam Pro', sans-serif; display:flex; justify-content:space-between; font-size:16px; color:#475569; font-weight:500;"><span>Tạm tính:</span><span style="font-weight:700; color:#0f172a;">${formatVND(totalAmount)}</span></div>
            <div style="font-family: 'Be Vietnam Pro', sans-serif; display:flex; justify-content:space-between; font-size:16px; color:#475569; font-weight:500;"><span>Phí vận chuyển:</span><span style="color:#059669; font-weight:800;">Miễn phí</span></div>
            <div style="font-family: 'Be Vietnam Pro', sans-serif; display:flex; justify-content:space-between; font-size:18px; font-weight:800; padding-top:8px; color:#0f172a;"><span>Tổng thanh toán:</span><span style="color:#059669; font-size:24px;">${formatVND(totalAmount)}</span></div>
            <button type="button" onclick="window.processCheckoutPage()" class="btn-primary-custom" style="font-family: 'Be Vietnam Pro', sans-serif; margin-top:16px; width:100%; padding:16px; font-size:18px; font-weight:bold; background:#ffc83d; color:#000; border:none; border-radius:12px; cursor:pointer; box-shadow:0 4px 14px rgba(255,200,61,0.4);">Xác Nhận Đặt Hàng</button>
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
    let rName = currentUser.name || currentUser.fullname || "Khách hàng";
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
      const price = getProductPrice(p);
      totalAmount += price * item.qty;
      return {
        pid: item.pid,
        productName: p ? p.name : "Sản phẩm",
        qty: item.qty,
        price: price,
      };
    });

    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const userKey = getUserKey(currentUser);
    const newOrder = {
      id: orderId,
      ref: "WEB_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      username: userKey,
      name: rName,
      phone: rPhone,
      address: rAddr,
      paymentMethod: paymentMethod,
      status: "Mới đặt",
      deducted: false,
      items: orderItems,
      totalAmount: totalAmount,
    };

    adminData.orders.push(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData));

    // LƯU LỊCH SỬ ĐẦY ĐỦ THÔNG TIN KHÁCH HÀNG SAU KHI ĐẶT HÀNG THÀNH CÔNG
    saveCartToHistory(cart, {
      name: rName,
      phone: rPhone,
      address: rAddr,
      paymentMethod: paymentMethod,
    });

    localStorage.removeItem("petpet_cart");
    updateCartBadge();

    showSuccessOrderModal(newOrder);
    renderPage();
  };

  function showSuccessOrderModal(order) {
    let successModal = document.getElementById("petpetSuccessOrderModal");
    if (!successModal) {
      successModal = document.createElement("div");
      successModal.id = "petpetSuccessOrderModal";
      successModal.style.cssText =
        "display:flex; position:fixed; inset:0; z-index:99999; background:rgba(15,23,42,0.65); backdrop-filter:blur(4px); align-items:center; justify-content:center;";
      document.body.appendChild(successModal);
    }

    const itemsSummaryHtml = order.items
      .map(
        (i) => `
      <div style="font-family: 'Be Vietnam Pro', sans-serif; display:flex; justify-content:space-between; font-size:15px; color:#334155; margin-bottom:8px;">
          <span>${i.productName} <b style="color:#0f172a;">x${i.qty}</b></span>
          <span style="font-weight:700; color:#0f172a;">${formatVND(i.price * i.qty)}</span>
      </div>
    `,
      )
      .join("");

    successModal.innerHTML = `
      <div style="font-family: 'Be Vietnam Pro', sans-serif; background:#fff; width:min(580px, 92%); border-radius:24px; padding:32px; position:relative; box-shadow:0 25px 50px rgba(0,0,0,0.25); text-align:center;">
          <button type="button" onclick="document.getElementById('petpetSuccessOrderModal').style.display='none'; location.reload();" style="position:absolute; top:20px; right:20px; background:none; border:none; font-size:24px; cursor:pointer; color:#94a3b8;">✕</button>
          
          <div style="width:72px; height:72px; background:#d1fae5; color:#059669; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto; font-size:36px;">
              <i class="ri-check-line"></i>
          </div>

          <h3 style="font-family: 'Be Vietnam Pro', sans-serif; font-size:26px; font-weight:800; color:#0f172a; margin-bottom:8px;">Đặt Hàng Thành Công!</h3>
          <p style="font-family: 'Be Vietnam Pro', sans-serif; font-size:16px; color:#64748b; margin-bottom:20px;">Mã hóa đơn của bạn là <b style="color:#059669; font-size:18px;">#${order.id}</b></p>

          <div style="font-family: 'Be Vietnam Pro', sans-serif; background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:20px; text-align:left; margin-bottom:24px;">
              <div style="font-family: 'Be Vietnam Pro', sans-serif; display:flex; justify-content:space-between; font-size:15px; font-weight:700; color:#0f172a; border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:12px;">
                  <span>Người nhận: ${order.name}</span>
                  <span>SĐT: ${order.phone}</span>
              </div>
              <p style="font-family: 'Be Vietnam Pro', sans-serif; font-size:14px; color:#475569; margin-bottom:8px;"><b>Địa chỉ giao:</b> ${order.address}</p>
              <p style="font-family: 'Be Vietnam Pro', sans-serif; font-size:14px; color:#475569; margin-bottom:14px;"><b>Phương thức:</b> <span style="font-weight:700; color:#0f172a;">${order.paymentMethod}</span></p>
              
              <div style="border-top:1px dashed #cbd5e1; padding-top:12px; margin-bottom:12px;">
                  ${itemsSummaryHtml}
              </div>

              <div style="font-family: 'Be Vietnam Pro', sans-serif; border-top:1px solid #e2e8f0; padding-top:12px; display:flex; justify-content:space-between; font-weight:800; font-size:16px; color:#0f172a;">
                  <span>Tổng hóa đơn:</span>
                  <span style="color:#059669; font-size:20px;">${formatVND(order.totalAmount)}</span>
              </div>
          </div>

          <button type="button" onclick="document.getElementById('petpetSuccessOrderModal').style.display='none'; location.reload();" style="font-family: 'Be Vietnam Pro', sans-serif; width:100%; padding:16px; background:#ffc83d; color:#000; font-weight:bold; border:none; border-radius:12px; cursor:pointer; font-size:17px; box-shadow:0 4px 14px rgba(255,200,61,0.4);">
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
      container.innerHTML = `
        <div style="font-family: 'Be Vietnam Pro', sans-serif; text-align:center; padding:40px; background:#fff; border-radius:16px; border:1px solid #e2e8f0;">
          <p style="font-size:16px; color:#64748b; margin:0; font-weight:500;">Vui lòng đăng nhập để xem đơn hàng của bạn.</p>
        </div>`;
      return;
    }

    const adminData = getAdminData();
    const userKey = getUserKey(currentUser);
    const myOrders = adminData.orders.filter(
      (o) =>
        o.username === userKey ||
        o.name === currentUser.name ||
        (currentUser.email && o.username === currentUser.email),
    );

    if (myOrders.length === 0) {
      container.innerHTML = `
        <div style="font-family: 'Be Vietnam Pro', sans-serif; text-align:center; padding:40px; background:#fff; border-radius:16px; border:1px solid #e2e8f0;">
          <p style="font-size:16px; color:#64748b; margin:0; font-weight:500;">Bạn chưa có đơn hàng nào.</p>
        </div>`;
      return;
    }

    let html = `<div style="display:flex; flex-direction:column; gap:24px;">`;
    myOrders.forEach((o) => {
      const total =
        o.totalAmount || o.items.reduce((s, i) => s + i.qty * i.price, 0);
      const itemsHtml = o.items
        .map(
          (i) => `
        <div style="font-family: 'Be Vietnam Pro', sans-serif; display:flex; justify-content:space-between; align-items:center; font-size:15px; padding:10px 0; border-bottom:1px dashed #e2e8f0;">
          <span style="color:#334155;">${i.productName} <b style="color:#0f172a;">(x${i.qty})</b></span>
          <span style="font-weight:700; color:#059669;">${formatVND(i.price * i.qty)}</span>
        </div>
      `,
        )
        .join("");

      html += `
        <div style="font-family: 'Be Vietnam Pro', sans-serif; background:#fff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; box-shadow:0 6px 16px rgba(0,0,0,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #f1f5f9; padding-bottom:14px; margin-bottom:14px;">
            <div>
              <span style="font-weight:800; font-size:18px; color:#0f172a;">Mã đơn: #${o.id}</span>
              <span style="font-size:14px; color:#64748b; margin-left:16px; font-weight:600;">Ngày đặt: ${o.date}</span>
            </div>
            <span style="padding:8px 16px; border-radius:20px; background:#fef3c7; color:#92400e; font-weight:800; font-size:14px;">${o.status}</span>
          </div>
          <div style="margin-bottom:14px; font-size:15px; color:#475569; line-height:1.6;">
            <p style="margin:4px 0;"><b>Người nhận:</b> ${o.name} - <span style="color:#0f172a; font-weight:700;">${o.phone}</span></p>
            <p style="margin:4px 0;"><b>Địa chỉ:</b> ${o.address}</p>
            <p style="margin:4px 0;"><b>Thanh toán:</b> ${o.paymentMethod}</p>
          </div>
          <div style="background:#f8fafc; padding:12px 18px; border-radius:14px; margin-bottom:14px; border:1px solid #f1f5f9;">
            ${itemsHtml}
          </div>
          <div style="display:flex; justify-content:flex-end; align-items:center; gap:12px; font-size:16px; font-weight:600; color:#0f172a;">
            <span>Tổng thanh toán:</span>
            <span style="font-weight:800; color:#059669; font-size:20px;">${formatVND(total)}</span>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
  }

})();