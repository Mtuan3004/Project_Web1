function getCart() {
  let cartData = localStorage.getItem("cart");
  return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

window.removeFromCart = function (productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  renderCart();
};

window.increaseQuantity = function (productId) {
  let cart = getCart();
  let item = cart.find((i) => i.id === productId);
  if (item) {
    item.quantity += 1;
    saveCart(cart);
    renderCart();
  }
};

window.decreaseQuantity = function (productId) {
  let cart = getCart();
  let item = cart.find((i) => i.id === productId);
  if (item) {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart(cart);
      renderCart();
    }
  }
};

function renderCart() {
  let cart = getCart();
  let cartContainerDOM = document.getElementById("cartContainer");
  let cartSummaryDOM = document.getElementById("cart-summary");

  if (!cartContainerDOM) return;

  if (cart.length === 0) {
    cartContainerDOM.innerHTML = `
        <div style="text-align: center; margin-top: 70px; margin-bottom: 400px;">
          <div class="cart-img"><img src="./src/img/img-orders/Gemini_Generated_Image_yl5i30yl5i30yl5i.png" alt="Giỏ hàng trống"></div>
            <p style="font-weight: bold; color: grey; font-size: 13px"> Giỏ hàng của bạn đang trống.</p>
            <div style="margin-top: 25px;">
                <a href="#" onclick="showView('view-home'); return false;" style="color: white; text-decoration: none; border: 1px solid #ffc83d; background: #ffc83d; padding: 10px 40px; ">MUA NGAY</a>
            </div>
        </div>     
    `;
    if (cartSummaryDOM) cartSummaryDOM.style.display = "none";
    return;
  }

  if (cartSummaryDOM) cartSummaryDOM.style.display = "block";
  let htmlProductList = '<div class="cart-items-list">';
  htmlProductList += `
     <div class="cartTable cartHeader" id="cartTitle">
            <span></span>
            <span class="col-product" style="color: #333;">Sản phẩm</span>
            <span class="col-price">Đơn giá</span>
            <span class="col-quantity">Số lượng</span>
            <span class="col-subtotal">Thành tiền</span>
            <span class="col-action">Thao tác</span>
    </div>
    `;
  cart.forEach((item) => {
    let itemSubtotal = item.price * item.quantity;
    htmlProductList += `
    <div class="cartTable cart-Main">
        <input class="product-checkbox" type="checkbox" data-id="${item.id}" />
            <div class="col-product">
                <img src="${item.image}" alt="${item.name}"/>
                <span>${item.name}</span>
            </div>
            <span class="col-price">${formatCurrency(item.price)}</span>
            <div class="col-quantity">
                <button class="qty-btn" onclick="decreaseQuantity('${item.id}')"> - </button>
                <input type="text" value="${item.quantity}" readonly />
                <button class="qty-btn" onclick="increaseQuantity('${item.id}')"> + </button>
            </div>
            <span class="col-subtotal">${formatCurrency(itemSubtotal)}</span>
            <div class="col-action"><button class="delete-btn" onclick="removeFromCart('${item.id}')"> X </button></div>
    </div>
    `;
  });
  htmlProductList += "</div>";
  cartContainerDOM.innerHTML = htmlProductList;

  const productCheckboxes = document.querySelectorAll(".product-checkbox");
  productCheckboxes.forEach((chk) => {
    chk.addEventListener("change", () => {
      updateCartSummaryValues();
      checkSelectAllState();
    });
  });

  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", (e) => {
      let isChecked = e.target.checked;
      productCheckboxes.forEach((chk) => {
        chk.checked = isChecked;
      });
      updateCartSummaryValues();
    });
  }

  updateCartSummaryValues();
}

function renderPaymentView() {
  let selectedData = localStorage.getItem("selectedCart");
  let selectedItems = selectedData ? JSON.parse(selectedData) : [];

  let payProductContainer = document.getElementById("payProductContainer");
  if (!payProductContainer) return;

  let htmlRows = "";
  let totalProductsCount = 0;
  let totalMerchandisePrice = 0;

  selectedItems.forEach((item) => {
    let itemSubtotal = item.price * item.quantity;
    totalProductsCount += item.quantity;
    totalMerchandisePrice += itemSubtotal;

    htmlRows += `
      <div class="pay-product-row">
        <div class="col-product">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='./src/img/Avatar-icon.png'"/>
          <span>${item.name}</span>
        </div>
        <div class="col-price">${formatCurrency(item.price)}</div>
        <div class="col-quantity">${item.quantity}</div>
        <div class="col-subtotal">${formatCurrency(itemSubtotal)}</div>
      </div>
    `;
  });
  payProductContainer.innerHTML = htmlRows;
  let discountAmount = 0;
  let finalPayment = totalMerchandisePrice - discountAmount;

  const summaryDiscountDOM = document.getElementById("summary-discount");
  if (summaryDiscountDOM)
    summaryDiscountDOM.innerText = "-" + formatCurrency(discountAmount);

  const payTotalCountDOM = document.getElementById("pay-total-count");
  const payTotalAmountDOM = document.getElementById("pay-total-amount");
  const summarySubtotalDOM = document.getElementById("summary-subtotal");
  const summaryFinalDOM = document.getElementById("summary-final");

  if (payTotalCountDOM) payTotalCountDOM.innerText = totalProductsCount;
  if (payTotalAmountDOM)
    payTotalAmountDOM.innerText = formatCurrency(totalMerchandisePrice);
  if (summarySubtotalDOM)
    summarySubtotalDOM.innerText = formatCurrency(totalMerchandisePrice);
  if (summaryFinalDOM) summaryFinalDOM.innerText = formatCurrency(finalPayment);

  sessionStorage.removeItem("selectedCheckoutAddressId");
  renderActiveAddressToCheckout();
}

function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString("vi-VN") + " đ";
}

function updateCartSummaryValues() {
  let cart = getCart();
  let checkboxes = document.querySelectorAll(".product-checkbox");
  let totalSelectedCount = 0;
  let totalProductCount = 0;
  let subtotal = 0;

  checkboxes.forEach((chk) => {
    if (chk.checked) {
      let productId = chk.getAttribute("data-id");
      let item = cart.find((i) => String(i.id) === String(productId));
      if (item) {
        totalSelectedCount += 1;
        totalProductCount += item.quantity;
        subtotal += item.price * item.quantity;
      }
    }
  });

  let selectedCountDOM = document.getElementById("total-selected-count");
  let productCountDOM = document.getElementById("total-product-count");
  let subtotalDOM = document.getElementById("sub-total");

  if (selectedCountDOM) selectedCountDOM.innerText = totalSelectedCount;
  if (productCountDOM) productCountDOM.innerText = totalProductCount;
  if (subtotalDOM) subtotalDOM.innerText = formatCurrency(subtotal);
}

function checkSelectAllState() {
  const productCheckboxes = document.querySelectorAll(".product-checkbox");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  if (!selectAllCheckbox || productCheckboxes.length === 0) return;

  let allChecked = Array.from(productCheckboxes).every((chk) => chk.checked);
  selectAllCheckbox.checked = allChecked;
}

async function addToCartFromDetail() {
  const btn = document.querySelector("#view-detail .app-btn button");
  if (!btn) return;

  const productId = btn.getAttribute("data-id");
  if (!productId) {
    alert("Không tìm thấy mã sản phẩm!");
    return;
  }

  const quantityElement = document.getElementById("quantity");
  const quantityToAdd = quantityElement
    ? parseInt(quantityElement.innerText) || 1
    : 1;

  let cart = getCart();
  let productInStore = null;
  if (typeof products !== "undefined" && Array.isArray(products)) {
    productInStore = products.find((p) => String(p.id) === String(productId));
  }

  if (!productInStore) {
    alert("Không tìm thấy sản phẩm trong cơ sở dữ liệu kho!");
    return;
  }

  let existingItem = cart.find((item) => String(item.id) === String(productId));
  if (existingItem) {
    existingItem.quantity += quantityToAdd;
  } else {
    cart.push({ ...productInStore, quantity: quantityToAdd });
  }

  saveCart(cart);
  alert("🎉 Thêm vào giỏ hàng thành công!");

  if (typeof renderCart === "function") {
    renderCart();
  }
}
window.addToCartFromDetail = addToCartFromDetail;

// === BẤM MUA HÀNG ===
const mypay = document.getElementById("myPayment");
if (mypay) {
  mypay.addEventListener("click", (e) => {
    e.preventDefault();

    let cart = getCart();
    let checkboxes = document.querySelectorAll(".product-checkbox");
    let selectedItems = [];

    checkboxes.forEach((chk) => {
      if (chk.checked) {
        let productId = chk.getAttribute("data-id");
        let item = cart.find((i) => String(i.id) === String(productId));
        if (item) {
          selectedItems.push(item);
        }
      }
    });

    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }

    let defaultAddr = getDefaultAddress();
    if (!defaultAddr || !defaultAddr.phone || !defaultAddr.street) {
      alert(
        "Tài khoản của bạn chưa có số điện thoại và địa chỉ nhận hàng. Vui lòng cập nhật thông tin tài khoản để tiếp tục!",
      );
      showView("view-account");
      return;
    }

    sessionStorage.removeItem("selectedCheckoutAddressId");
    localStorage.setItem("selectedCart", JSON.stringify(selectedItems));
    if (typeof renderPaymentView === "function") {
      renderPaymentView();
    }
    showView("view-payment");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  const placeOrderBtn = document.querySelector(".place-order-btn");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
      let selectedData = localStorage.getItem("selectedCart");
      let selectedItems = selectedData ? JSON.parse(selectedData) : [];

      if (selectedItems.length === 0) {
        alert("Không có sản phẩm nào để đặt hàng!");
        return;
      }

      let activeAddr = getActiveAddress();
      let shippingInfo = activeAddr
        ? {
            name: activeAddr.name,
            phone: activeAddr.phone,
            address: `${activeAddr.street}${activeAddr.city ? ", " + activeAddr.city : ""}`,
          }
        : {
            name: "Khách hàng",
            phone: "0900000000",
            address: "TP. Hồ Chí Minh",
          };

      let paymentMethod = getActivePaymentMethod();
      let totalAmount = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      let newOrder = {
        orderId: "DH" + Date.now(),
        date: new Date().toLocaleString("vi-VN"),
        items: selectedItems,
        shipping: shippingInfo,
        paymentMethod: paymentMethod,
        total: totalAmount,
        status: "Chờ giao hàng",
      };

      let ordersList = JSON.parse(localStorage.getItem("myOrders")) || [];
      ordersList.unshift(newOrder);

      localStorage.setItem("myOrders", JSON.stringify(ordersList));

      let cart = getCart();
      let selectedIds = selectedItems.map((i) => String(i.id));
      cart = cart.filter((item) => !selectedIds.includes(String(item.id)));
      saveCart(cart);

      localStorage.removeItem("selectedCart");

      alert("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua hàng tại PetPet.");

      if (typeof renderCart === "function") renderCart();
      renderMyOrders();

      showView("view-cart");
    });
  }

  function renderMyOrders() {
    let container = document.getElementById("myOrdersContainer");
    if (!container) return;

    let ordersList = JSON.parse(localStorage.getItem("myOrders")) || [];

    if (ordersList.length === 0) {
      container.innerHTML = `<p style="text-align: center; color: #777; padding: 20px;">Bạn chưa có đơn hàng nào.</p>`;
      return;
    }

    let html = "";
    ordersList.forEach((order) => {
      let itemsHtml = "";
      order.items.forEach((item) => {
        itemsHtml += `
          <div class="order-item-row">
            <div class="order-item-left">
              <img src="${item.image}" alt="${item.name}" onerror="this.src='./src/img/Avatar-icon.png'"/>
              <div>
                <div style="font-weight: 500; font-size: 14px; color: #333;">${item.name}</div>
                <div style="font-size: 13px; color: #777;">x${item.quantity}</div>
              </div>
            </div>
            <div style="font-weight: 600; color: #333;">${formatCurrency(item.price * item.quantity)}</div>
          </div>
        `;
      });

      html += `
        <div class="order-card">
          <div class="order-header-info">
            <span>Mã đơn: <strong>#${order.orderId}</strong> (${order.date})</span>
            <span class="order-status">${order.status}</span>
          </div>
          <div class="order-items-list">${itemsHtml}</div>
          <div style="font-size: 13px; color: #555; margin-top: 10px; border-top: 1px dashed #eee; padding-top: 8px;">
            <p><strong>Người nhận:</strong> ${order.shipping.name} - ${order.shipping.phone}</p>
            <p><strong>Địa chỉ:</strong> ${order.shipping.address}</p>
            <p><strong>Hình thức thanh toán:</strong> ${order.paymentMethod}</p>
          </div>
          <div class="order-footer-info">
            <span>Thành tiền:</span>
            <span class="order-total-price">${formatCurrency(order.total)}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderMyOrders();
});

// ================= QUẢN LÝ ĐỊA CHỈ =================
function getAddressList() {
  let data = localStorage.getItem("userAddressList");
  if (!data) {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.phone && currentUser.street) {
      let initialAddr = [
        {
          id: "addr_default_user",
          name: currentUser.name || currentUser.fullName || "Khách hàng",
          phone: currentUser.phone,
          street: currentUser.street,
          city: [currentUser.ward, currentUser.district, currentUser.city]
            .filter(Boolean)
            .join(", "),
          isDefault: true,
        },
      ];
      localStorage.setItem("userAddressList", JSON.stringify(initialAddr));
      return initialAddr;
    }
    return [];
  }
  return JSON.parse(data);
}

function saveAddressList(list) {
  localStorage.setItem("userAddressList", JSON.stringify(list));
}

function getDefaultAddress() {
  let list = getAddressList();
  if (list.length === 0) return null;
  let def = list.find((a) => a.isDefault);
  return def || list[0];
}

function getActiveAddress() {
  let list = getAddressList();
  if (list.length === 0) return null;

  let activeId = sessionStorage.getItem("selectedCheckoutAddressId");
  if (activeId) {
    let active = list.find((a) => a.id === activeId);
    if (active) return active;
  }

  return getDefaultAddress();
}

window.selectActiveAddress = function (id) {
  sessionStorage.setItem("selectedCheckoutAddressId", id);
  renderActiveAddressToCheckout();
  closeAddressListModal();
};

function renderActiveAddressToCheckout() {
  const infoContainer = document.querySelector(".info-customer");
  if (!infoContainer) return;

  let active = getActiveAddress();

  if (!active) {
    infoContainer.innerHTML = `
      <div style="color: #e74c3c; font-weight: 500; font-size: 15px;">
        Chưa có địa chỉ nhận hàng!
      </div>
      <div style="color: #2980b9; margin-left: 20px; cursor: pointer; text-decoration: underline;" onclick="showView('view-account')">
        Cập nhật ngay tại Cài đặt tài khoản
      </div>
    `;
    return;
  }

  let fullAddress = `${active.street}${active.city ? ", " + active.city : ""}`;
  let isDefaultBadge = active.isDefault
    ? '<div style="color: red; border: 1px solid red; padding: 2px; margin-left: 10px; font-size: 10px;">Mặc định</div>'
    : "";

  infoContainer.innerHTML = `
    <div class="Name" style="font-weight: bold; font-size: 15px">${active.name}</div>
    <div class="phoneNumber" style="margin-left: 5px; font-weight: bold; font-size: 15px">${active.phone}</div>
    <div class="address" style="margin-left: 10px; font-size: 15px">${fullAddress}</div>
    ${isDefaultBadge}
    <div style="color: blue; margin-left: 50px; cursor: pointer; text-decoration: underline;" onclick="openAddressListModal()">Thay đổi</div>
  `;
}

window.addEventListener("account:updated", () => {
  renderActiveAddressToCheckout();
});

function renderAddressListModal() {
  const container = document.getElementById("addressItemsContainer");
  if (!container) return;

  let list = getAddressList();
  let active = getActiveAddress();
  let html = "";

  if (list.length === 0) {
    container.innerHTML = `<p style="text-align: center; padding: 20px; color: #777;">Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới!</p>`;
    return;
  }

  list.forEach((item) => {
    let isChecked = active && active.id === item.id ? "checked" : "";
    html += `
      <div class="address-item-card">
        <div class="address-item-left">
          <input type="radio" name="selectedAddr" value="${item.id}" ${isChecked} onchange="selectActiveAddress('${item.id}')"/>
          <div>
            <div class="address-user-info">
              <span class="user-name">${item.name}</span>
              <span class="user-phone">${item.phone}</span>
            </div>
            <div class="address-detail-text">${item.street}</div>
            <div class="address-detail-text">${item.city}</div>
            ${item.isDefault ? '<span class="badge-default">Mặc định</span>' : ""}
          </div>
        </div>
        <div>
          <button type="button" class="btn-update-link" onclick="openEditAddressForm('${item.id}')">Cập nhật</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

window.openAddressListModal = function () {
  renderAddressListModal();
  let modal = document.getElementById("addressListModal");
  if (modal) modal.style.display = "flex";
};

window.closeAddressListModal = function () {
  let modal = document.getElementById("addressListModal");
  if (modal) modal.style.display = "none";
};

window.openAddAddressForm = function () {
  document.getElementById("addressFormTitle").innerText = "Địa chỉ mới";
  document.getElementById("editAddressId").value = "";
  document.getElementById("inputName").value = "";
  document.getElementById("inputPhone").value = "";
  document.getElementById("inputCity").value = "";
  document.getElementById("inputStreet").value = "";
  document.getElementById("inputIsDefault").checked = false;
  let modal = document.getElementById("addressFormModal");
  if (modal) modal.style.display = "flex";
};

window.openEditAddressForm = function (id) {
  let list = getAddressList();
  let item = list.find((a) => a.id === id);
  if (!item) return;

  document.getElementById("addressFormTitle").innerText = "Cập nhật địa chỉ";
  document.getElementById("editAddressId").value = item.id;
  document.getElementById("inputName").value = item.name;
  document.getElementById("inputPhone").value = item.phone;
  document.getElementById("inputCity").value = item.city;
  document.getElementById("inputStreet").value = item.street;
  document.getElementById("inputIsDefault").checked = item.isDefault;
  let modal = document.getElementById("addressFormModal");
  if (modal) modal.style.display = "flex";
};

window.closeAddressFormModal = function () {
  let modal = document.getElementById("addressFormModal");
  if (modal) modal.style.display = "none";
};

document.addEventListener("DOMContentLoaded", () => {
  const addressDetailForm = document.getElementById("addressDetailForm");
  if (addressDetailForm) {
    addressDetailForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let editId = document.getElementById("editAddressId").value;
      let name = document.getElementById("inputName").value.trim();
      let phone = document.getElementById("inputPhone").value.trim();
      let city = document.getElementById("inputCity").value.trim();
      let street = document.getElementById("inputStreet").value.trim();
      let isDefault = document.getElementById("inputIsDefault").checked;

      let activeTypeBtn = document.querySelector(".btn-type-option.active");
      let type = activeTypeBtn
        ? activeTypeBtn.getAttribute("data-type")
        : "Nhà Riêng";

      let list = getAddressList();

      if (isDefault || list.length === 0) {
        list.forEach((a) => (a.isDefault = false));
        isDefault = true;
      }

      let savedItem = null;

      if (editId) {
        savedItem = list.find((a) => a.id === editId);
        if (savedItem) {
          savedItem.name = name;
          savedItem.phone = phone;
          savedItem.city = city;
          savedItem.street = street;
          savedItem.type = type;
          savedItem.isDefault = isDefault;
        }
      } else {
        savedItem = {
          id: "addr_" + Date.now(),
          name: name,
          phone: phone,
          city: city,
          street: street,
          type: type,
          isDefault: isDefault,
        };
        list.push(savedItem);
        editId = savedItem.id;
      }

      sessionStorage.setItem("selectedCheckoutAddressId", editId);
      saveAddressList(list);

      if (isDefault) {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
          currentUser.phone = phone;
          currentUser.name = name;
          currentUser.fullName = name;
          currentUser.street = street;
          currentUser.city = city;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));

          let users = JSON.parse(localStorage.getItem("users")) || [];
          users = users.map((u) => {
            if (u.email === currentUser.email) {
              return {
                ...u,
                name: name,
                fullName: name,
                phone: phone,
                street: street,
                city: city,
              };
            }
            return u;
          });
          localStorage.setItem("users", JSON.stringify(users));
        }

        let petpetAccount =
          JSON.parse(localStorage.getItem("petpet_account")) || {};
        petpetAccount.fullName = name;
        petpetAccount.phone = phone;
        petpetAccount.street = street;
        petpetAccount.city = city;
        localStorage.setItem("petpet_account", JSON.stringify(petpetAccount));

        window.dispatchEvent(
          new CustomEvent("account:updated", {
            detail: {
              fullName: name,
              phone: phone,
              street: street,
              city: city,
            },
          }),
        );
      }

      renderAddressListModal();
      renderActiveAddressToCheckout();
      closeAddressFormModal();
    });
  }
});

// ================= THANH TOÁN =================
const DEFAULT_PAYMENT = "Thanh toán khi nhận hàng";

function getActivePaymentMethod() {
  let selected = sessionStorage.getItem("selectedPaymentMethod");
  return selected ? selected : DEFAULT_PAYMENT;
}

function renderPaymentMethodToCheckout() {
  const paymentMethodTextDOM = document.getElementById("selectedPaymentMethod");
  let currentMethod = getActivePaymentMethod();
  if (paymentMethodTextDOM) {
    paymentMethodTextDOM.innerText = currentMethod;
  }
}

window.openPaymentModal = function () {
  const paymentModal = document.getElementById("paymentModal");
  if (paymentModal) {
    let currentMethod = getActivePaymentMethod();
    const radios = document.querySelectorAll('input[name="paymentMethod"]');
    radios.forEach((radio) => {
      radio.checked = radio.value === currentMethod;
    });
    paymentModal.style.display = "flex";
  }
};

window.closePaymentModal = function () {
  const paymentModal = document.getElementById("paymentModal");
  if (paymentModal) paymentModal.style.display = "none";
};

document.addEventListener("DOMContentLoaded", () => {
  sessionStorage.removeItem("selectedPaymentMethod");
  renderPaymentMethodToCheckout();

  const changePaymentBtn = document.getElementById("change-payment");
  if (changePaymentBtn) {
    changePaymentBtn.addEventListener("click", window.openPaymentModal);
  }

  const closePaymentBtnElem = document.querySelector(".close-payment-btn");
  const btnCancelPayment = document.getElementById("btnCancelPayment");
  const paymentModalOverlay = document.getElementById("paymentModalOverlay");

  if (closePaymentBtnElem)
    closePaymentBtnElem.addEventListener("click", window.closePaymentModal);
  if (btnCancelPayment)
    btnCancelPayment.addEventListener("click", window.closePaymentModal);
  if (paymentModalOverlay)
    paymentModalOverlay.addEventListener("click", window.closePaymentModal);

  const paymentForm = document.getElementById("paymentForm");
  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const selectedRadio = document.querySelector(
        'input[name="paymentMethod"]:checked',
      );
      if (selectedRadio) {
        const newMethod = selectedRadio.value;
        sessionStorage.setItem("selectedPaymentMethod", newMethod);
        renderPaymentMethodToCheckout();
      }
      window.closePaymentModal();
    });
  }
});
