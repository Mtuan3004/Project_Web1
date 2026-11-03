const petToggle = document.querySelectorAll(".pet-dropdown-toggle");
const petModal = document.querySelector("#petModal");
const petOverlay = document.querySelector(".pet-modal__overlay");
const petOptions = document.querySelectorAll(".pet-option");
const mainLebel = document.querySelectorAll(".main-label");

const headerMobileBar = document.querySelector(".header-mobile-bar");

const bottomNavItems = document.querySelectorAll(".bottom-nav__item");

function openPetModal() {
  petModal.classList.add("show");
}

function closePetModal() {
  petModal.classList.remove("show");
}

// Xử lý mở/đóng modal
petToggle.forEach((toggle) => {
  toggle.addEventListener("click", openPetModal);
});
petOverlay.addEventListener("click", closePetModal);

petOptions.forEach((option) => {
  option.addEventListener("click", () => {
    petOptions.forEach((item) => item.classList.remove("active"));

    option.classList.add("active");

    let headerIconSrc = "";
    let leftSearchSrc = "";
    let rightSearchSrc = "";
    let rightDisplay = "";
    let selectedText = "";
    let selectedImgSrc = "";

    switch (option.dataset.pet) {
      case "dog":
        selectedImgSrc = "./src/img/icon/sprite-pet-switch-dog.svg";
        headerIconSrc = "./src/img/icon/sprite-pet-dog-icon.svg";
        leftSearchSrc = "./src/img/icon/sprite-pet-dog-sticker.svg";
        rightSearchSrc = "./src/img/icon/sprite-pet-cat-sticker.svg";
        rightDisplay = "none";
        selectedText = "Cún Cưng";
        break;
      case "cat":
        selectedImgSrc = "./src/img/icon/sprite-pet-switch-cat.svg";
        headerIconSrc = "./src/img/icon/sprite-pet-cat-icon.svg";
        leftSearchSrc = "./src/img/icon/sprite-pet-cat-sticker.svg";
        rightSearchSrc = "./src/img/icon/sprite-pet-cat-sticker.svg";
        rightDisplay = "none";
        selectedText = "Mèo Cưng";
        break;
      case "both":
        selectedImgSrc = "./src/img/icon/sprite-pet-switch-both.svg";
        headerIconSrc = "./src/img/icon/sprite-pet-both-icon.svg";
        leftSearchSrc = "./src/img/icon/sprite-pet-dog-sticker.svg";
        rightSearchSrc = "./src/img/icon/sprite-pet-cat-sticker.svg";
        rightDisplay = "block";
        selectedText = "Pet Cưng";
        break;
      default:
        console.log("Lỗi path");
        return;
    }

    switchIcon.src = selectedImgSrc;
    petText.innerHTML = selectedText;

    mainLebel.forEach((label) => (label.innerHTML = selectedText));

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

    closePetModal();
  });
});
console.log(leftSearchIcons, rightSearchIcons);

function handleStickyHeader() {
  if (window.scrollY > 0) {
    headerMobileBar.classList.add("show");
  } else {
    headerMobileBar.classList.remove("show");
  }
}
window.addEventListener("scroll", handleStickyHeader);
handleStickyHeader();

// Quản lý bottom navigation

bottomNavItems.forEach((nav) => mobileBottom(nav));

function mobileBottom(nav) {
  nav.addEventListener("click", () => {
    bottomNavItems.forEach((item) => {
      item.classList.remove("active");
      const imgChild = item.querySelector("img");
      if (imgChild && imgChild.dataset.originalSrc) {
        imgChild.src = imgChild.dataset.originalSrc;
      }
    });

    nav.classList.add("active");

    const activeImg = nav.querySelector("img");
    if (activeImg) {
      // Lưu lại src gốc nếu chưa lưu
      if (!activeImg.dataset.originalSrc) {
        activeImg.dataset.originalSrc = activeImg.getAttribute("src");
      }
      // Chèn chữ "-active" vào trước đuôi .svg của riêng ảnh con đó
      const originalSrc = activeImg.dataset.originalSrc;
      activeImg.src = originalSrc.replace(".svg", "-active.svg");
    }
  });
}
bottomNavItems[0].click(); // Mặc định click vào nav đầu tiên khi load trang

const menuBtn = document.querySelector(".nav-mobile:first-child"); // Hoặc class nút Menu của bạn
const menuModal = document.getElementById("mobileMenuModal");
const modalOverlay = document.querySelector(".menu-modal-overlay");

// Bấm vào nút Menu để mở
if (menuBtn && menuModal) {
  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    menuModal.classList.add("active");
  });
}

// Bấm ra ngoài nền mờ để đóng
if (modalOverlay && menuModal) {
  modalOverlay.addEventListener("click", () => {
    menuModal.classList.remove("active");
  });
}
