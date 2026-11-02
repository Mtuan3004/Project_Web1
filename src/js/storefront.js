// storefront.js - PETPET Storefront & Cart Core Logic
(function () {
  "use strict";

  const STORAGE_KEY = "petpet_admin_v3";

  // Lấy dữ liệu sản phẩm từ Admin storage
  function getAdminData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Lỗi khi lấy dữ liệu Admin từ localStorage:", e);
    }
    return { products: [], categories: [], orders: [] };
  }

  // Quản lý giỏ hàng trong localStorage
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("petpet_cart")) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("petpet_cart", JSON.stringify(cart));
    updateCartCount();
  }

  // Cập nhật số lượng hiển thị trên icon giỏ hàng
  function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById("cartCount");
    if (badge) badge.textContent = count;
  }

  // Thêm sản phẩm vào giỏ hàng và cập nhật con số trên icon
  window.addToCart = function (pid, qty = 1) {
    const data = getAdminData();
    const product = data.products.find((p) => p.id === pid);
    if (!product) {
      alert("Không tìm thấy sản phẩm!");
      return;
    }
    let cart = getCart();
    const existingIndex = cart.findIndex((item) => item.pid === pid);
    if (existingIndex > -1) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({ pid: pid, qty: qty });
    }
    saveCart(cart);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Khởi chạy cập nhật số lượng khi tải trang
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateCartCount);
  } else {
    updateCartCount();
  }
})();
