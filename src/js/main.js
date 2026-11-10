const navLinks = document.querySelectorAll(".nav-item");
const navMobileLinks = document.querySelectorAll(".bottom-nav__item");
const navHamburgerLinks = document.querySelectorAll(
  ".menu-modal-list a[data-view]",
);

const icon = document.querySelectorAll("#iconBranch");
const btnMain = document.querySelector(".icon-set");
const switchIcon = document.querySelector("#switchIcon");
const petText = document.querySelector("#btnText");
const btnIcon = document.querySelectorAll("#switchBtn");
const leftSearchIcons = document.querySelectorAll(".left-search-icon");
const rightSearchIcons = document.querySelectorAll(".right-search-icon");
const account = document.querySelector(".account");
const accountMenu = document.querySelector(".account-menu");

const selects = document.querySelectorAll(".selects");

const sigUp = document.getElementById("signUp");
const register = document.getElementById("signIn");
const logOut = document.getElementById("logOut");

const linkAdmin = document.querySelector(".link_Admin");

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("left-bar");

const viewGiaTot = document.querySelector(".gia-tot");
const viewCombo = document.querySelector(".combo");
// Chỉnh icon

function closeAllMenus() {
  btnMain.classList.remove("active");
  accountMenu.classList.remove("active");
  selects.forEach((item) => item.classList.remove("active"));
}

btnMain.addEventListener("click", (e) => {
  e.stopPropagation();
  let isOpen = btnMain.classList.contains("active");
  closeAllMenus();

  if (!isOpen) btnMain.classList.add("active");
});
btnIcon.forEach((iconSet) => {
  iconSet.addEventListener("click", () => {
    btnIcon.forEach((item) => item.classList.remove("active"));
    iconSet.classList.add("active");

    let headerIconSrc = "";
    let leftSearchSrc = "";
    let rightSearchSrc = "";
    let rightDisplay = "";
    let selectedText = "";
    let selectedImgSrc = "";

    switch (iconSet.dataset.pet) {
      case "dog":
        selectedImgSrc = "./src/img/icon/sprite-pet-switch-dog.svg";
        headerIconSrc = "./src/img/icon/sprite-pet-dog-icon.svg";
        leftSearchSrc = "./src/img/icon/sprite-pet-dog-sticker.svg";
        rightSearchSrc = "./src/img/icon/sprite-pet-cat-sticker.svg";
        rightDisplay = "none";
        selectedText = iconSet.querySelector("span").innerHTML;
        break;
      case "cat":
        selectedImgSrc = "./src/img/icon/sprite-pet-switch-cat.svg";
        headerIconSrc = "./src/img/icon/sprite-pet-cat-icon.svg";
        leftSearchSrc = "./src/img/icon/sprite-pet-cat-sticker.svg";
        rightSearchSrc = "./src/img/icon/sprite-pet-cat-sticker.svg";
        rightDisplay = "none";
        selectedText = iconSet.querySelector("span").innerHTML;
        break;
      case "both":
        selectedImgSrc = "./src/img/icon/sprite-pet-switch-both.svg";
        headerIconSrc = "./src/img/icon/sprite-pet-both-icon.svg";
        leftSearchSrc = "./src/img/icon/sprite-pet-dog-sticker.svg";
        rightSearchSrc = "./src/img/icon/sprite-pet-cat-sticker.svg";
        rightDisplay = "block";
        selectedText = iconSet.querySelector("span").innerHTML;
        break;
      default:
        console.log("Lỗi path");
        return;
    }
    switchIcon.src = selectedImgSrc;
    petText.innerHTML = selectedText;

    icon.forEach((img) => (img.src = headerIconSrc));
    leftSearchIcons.forEach((wrap) => {
      const img = wrap.querySelector("img");
      if (img) img.src = leftSearchSrc;
    });
    rightSearchIcons.forEach((wrap) => {
      const img = wrap.querySelector("img");
      if (img) img.src = rightSearchSrc;
      wrap.style.display = rightDisplay;
    });
  });
});
// slider
const slider = document.querySelector("#slider");
const totalSlides = slider.children.length;
let i = 0;

function updateSlider() {
  slider.style.transform = `translateX(-${i * 100}%)`;
}

function next() {
  i = (i + 1) % totalSlides;
  updateSlider();
}

function prev() {
  i = (i - 1 + totalSlides) % totalSlides;
  updateSlider();
}
// Auto Slider
setInterval(() => {
  i++;
  if (i >= totalSlides) i = 0;
  updateSlider();
}, 3000);

// Account
account.addEventListener("click", (e) => {
  e.stopPropagation();
  let isOpen = accountMenu.classList.contains("active");
  closeAllMenus();

  if (!isOpen) {
    accountMenu.classList.add("active");
  }
});

document.addEventListener("click", function (event) {
  let clickInside =
    account.contains(event.target) || btnMain.contains(event.target);
  if (!clickInside) closeAllMenus();
});
// Selects-Main
selects.forEach((selectBox) => {
  selectBox.addEventListener("click", (e) => {
    e.stopPropagation(); // Không cho lan truyền sự kiện ra ngoài document ngay lập tức

    if (e.target.closest(".dropdown-menu")) {
      return;
    }

    let isOpen = selectBox.classList.contains("active");
    closeAllMenus();

    if (!isOpen) {
      selectBox.classList.add("active");
    }
  });
});
sigUp.addEventListener("click", (e) => {
  window.location.href = "./src/html/signUp.html";
});

register.addEventListener("click", (e) => {
  window.location.href = "./src/html/signUp.html?mode=register";
});

document.addEventListener("DOMContentLoaded", function () {
  // Lấy thông tin user đang đăng nhập từ localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const h2Text = document.querySelector(".h2-text");
  const role = document.querySelector(".role");
  const authBox = document.querySelector(".account-top .account-menu__auth");

  if (currentUser) {
    if (h2Text) {
      h2Text.textContent = currentUser.name;
    }

    // Đổi dòng mô tả thành chức vụ (Thành viên hoặc Admin)
    if (role) {
      if (currentUser.role === "admin") {
        role.textContent = "Admin";
        role.classList.add("admin");
        role.style.color = "#d63031";
        linkAdmin.style.display = "flex";
      } else {
        role.textContent = "Khánh hàng";
        role.classList.add("customers");
      }
    }

    if (authBox) {
      authBox.style.display = "none";
    }
  }
});

logOut.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.reload();
});

linkAdmin.addEventListener("click", (e) => {
  window.location.href = "./src/html/admin.html";
});

//open footer menu
function toggleMenu(e) {
  const subMenu = e.querySelector(".subMenu-footer");
  const arrowMenu = e.querySelector(".ri-arrow-down-s-fill");
  subMenu.classList.toggle("open");
  arrowMenu.classList.toggle("open");
}

// ===== Bấm vào sản phẩm -> mở màn chi tiết =====

// Ẩn tất cả màn hình, chỉ hiện màn có id được truyền vào
function showView(id) {
  document
    .querySelectorAll(".app-view")
    .forEach((view) => view.classList.add("d-none"));
  document.getElementById(id).classList.remove("d-none");
  window.scrollTo(0, 0);
}

// Gạch chân + chuyển màn hình khi bấm nút trên navbar
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // không cho link nhảy theo #Trangchủ...
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    showView(link.dataset.view);
  });
});

navMobileLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    showView(link.dataset.view);
  });
});
navHamburgerLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    showView(link.dataset.view);
    document.getElementById("mobileMenuModal").classList.remove("active");
  });
});
console.log(navMobileLinks);
console.log(navMobileLinks.length);

console.log(navHamburgerLinks);
console.log(navHamburgerLinks.length);

// Nút xem thêm
function bindGoTo(selector, viewId) {
  document.querySelectorAll(selector).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(`.nav-item[data-view="${viewId}"]`).click();
    });
  });
}

bindGoTo(".brand-view-more", "view-brand");

const bannerConfigs = {
  red: {
    type: "red",
    imgSrc: "./src/img/banner/Combo.svg",
    alt: "Combo quà tặng",
    title: "Combo tiết kiệm",
    subtitle: "Nhận quà cực ngầu - Mua ngay!",
  },

  yellow: {
    type: "yellow",
    imgSrc: "./src/img/banner/Giatot.svg",
    alt: "Giá tốt hôm nay",
    title: "Giá tốt hôm nay",
    subtitle: "Càng mua - Càng hời - Càng tiết kiệm!",
  },
};

// Hàm render banner
function renderDealBanner(selector, configType) {
  // Tìm banner trong HTML
  const banner = document.querySelector(selector);

  if (!banner) {
    console.warn("Không tìm thấy banner:", selector);
    return;
  }
  // Lấy cấu hình theo loại banner
  const data = bannerConfigs[configType];
  if (!data) {
    console.warn("Không tồn tại loại banner:", configType);
    return;
  }
  banner.dataset.bannerType = data.type;
  const img = banner.querySelector(".banner-img-relative img");
  if (img) {
    img.src = data.imgSrc;
    img.alt = data.alt;
  }
  const title = banner.querySelector(".banner-title");
  if (title) {
    title.textContent = data.title;
  }
  const subtitle = banner.querySelector(".banner-subtitle");
  if (subtitle) {
    subtitle.textContent = data.subtitle;
  }
  banner.style.display = "flex";
}

// Hàm chuyển đến màn hình sản phẩm kèm loại banner
function openProductsWithBanner(event, bannerType) {
  // Ngăn hành vi mặc định của thẻ a
  event.preventDefault();
  // Render banner trước khi chuyển màn hình
  renderDealBanner(".deal-banner", bannerType);
  // Tận dụng hệ thống điều hướng hiện tại
  const productNav = document.querySelector(
    '.nav-item[data-view="view-products"]',
  );

  if (productNav) {
    productNav.click();
  } else {
    console.warn("Không tìm thấy nút điều hướng sản phẩm!");
  }
}

// Nút xem thêm Giá tốt hôm nay
document.querySelectorAll(".gia-tot").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    openProductsWithBanner(event, "yellow");
  });
});

// Nút xem thêm Combo tiết kiệm
document.querySelectorAll(".combo").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    openProductsWithBanner(event, "red");
  });
});
function btnDealBanner() {
  document.querySelector(".deal-banner").style.display = "flex";
}

// hahah

const myOrder = document.querySelector("#my-order");
const myAccount = document.querySelector("#my-settings");

myOrder.addEventListener("click", (e) => {
  e.preventDefault();
  showView("view-cart");
});
myAccount.addEventListener("click", (e) => {
  e.preventDefault();
  showView("view-account");
});
