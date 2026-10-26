const navLinks = document.querySelectorAll('.nav-item');

const icon = document.querySelectorAll('#iconBranch');
const btnMain = document.querySelector('.icon-set');
const switchIcon = document.querySelector('#switchIcon');
const petText = document.querySelector('#btnText');
const btnIcon = document.querySelectorAll('#switchBtn');
const leftSearchIcon = document.querySelector('.left-search-icon');
const rightSearchIcon = document.querySelector('.right-search-icon');
const account = document.querySelector('.account');
const accountMenu = document.querySelector('.account-menu');

const selects = document.querySelectorAll('.selects');

const sigUp = document.getElementById('signUp');
const register = document.getElementById('signIn');
const logOut = document.getElementById('logOut');

const linkAdmin = document.querySelector('.link_Admin');
//gạch chân của các vả ở leftNav
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

// Chỉnh icon

function closeAllMenus() {
  btnMain.classList.remove('active');
  accountMenu.classList.remove('active');
  selects.forEach((item) => item.classList.remove('active'));
}

btnMain.addEventListener('click', (e) => {
  e.stopPropagation();
  let isOpen = btnMain.classList.contains('active');
  closeAllMenus();

  if (!isOpen) btnMain.classList.add('active');
});
btnIcon.forEach((iconSet) => {
  iconSet.addEventListener('click', () => {
    btnIcon.forEach((item) => item.classList.remove('active'));
    iconSet.classList.add('active');

    let headerIconSrc = '';
    let leftSearchSrc = '';
    let rightSearchSrc = '';
    let rightDisplay = '';
    let selectedText = '';
    let selectedImgSrc = '';

    switch (iconSet.dataset.pet) {
      case 'dog':
        selectedImgSrc = './src/img/icon/sprite-pet-switch-dog.svg';
        headerIconSrc = './src/img/icon/sprite-pet-dog-icon.svg';
        leftSearchSrc = './src/img/icon/sprite-pet-dog-sticker.svg';
        rightSearchSrc = './src/img/icon/sprite-pet-cat-sticker.svg';
        rightDisplay = 'none';
        selectedText = iconSet.querySelector('span').innerHTML;
        break;
      case 'cat':
        selectedImgSrc = './src/img/icon/sprite-pet-switch-cat.svg';
        headerIconSrc = './src/img/icon/sprite-pet-cat-icon.svg';
        leftSearchSrc = './src/img/icon/sprite-pet-cat-sticker.svg';
        rightSearchSrc = './src/img/icon/sprite-pet-cat-sticker.svg';
        rightDisplay = 'none';
        selectedText = iconSet.querySelector('span').innerHTML;
        break;
      case 'both':
        selectedImgSrc = './src/img/icon/sprite-pet-switch-both.svg';
        headerIconSrc = './src/img/icon/sprite-pet-both-icon.svg';
        leftSearchSrc = './src/img/icon/sprite-pet-dog-sticker.svg';
        rightSearchSrc = './src/img/icon/sprite-pet-cat-sticker.svg';
        rightDisplay = 'block';
        selectedText = iconSet.querySelector('span').innerHTML;
        break;
      default:
        console.log('Lỗi path');
        return;
    }
    switchIcon.src = selectedImgSrc;
    petText.innerHTML = selectedText;

    icon.forEach((img) => (img.src = headerIconSrc));
    leftSearchIcon.querySelector('img').src = leftSearchSrc;
    rightSearchIcon.querySelector('img').src = rightSearchSrc;
    rightSearchIcon.style.display = rightDisplay;
  });
});
// slider
const slider = document.querySelector('#slider');
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

// Account
account.addEventListener('click', (e) => {
  e.stopPropagation();
  let isOpen = accountMenu.classList.contains('active');
  closeAllMenus();

  if (!isOpen) {
    accountMenu.classList.add('active');
  }
});

document.addEventListener('click', function (event) {
  let clickInside =
    account.contains(event.target) || btnMain.contains(event.target);
  if (!clickInside) closeAllMenus();
});
// Selects-Main
selects.forEach((selectBox) => {
  selectBox.addEventListener('click', (e) => {
    e.stopPropagation(); // Không cho lan truyền sự kiện ra ngoài document ngay lập tức

    // Nếu bấm vào bên trong menu con (checkbox, thanh kéo range), KHÔNG đóng menu
    if (e.target.closest('.dropdown-menu')) {
      return;
    }

    let isOpen = selectBox.classList.contains('active');
    closeAllMenus(); // Đóng tất cả các menu khác trước

    if (!isOpen) {
      selectBox.classList.add('active'); // Mở menu hiện tại nếu chưa mở
    }
  });
});
sigUp.addEventListener('click', (e) => {
  window.location.href = './src/html/signUp.html';
});
console.log(register);
console.log(sigUp);
register.addEventListener('click', (e) => {
  window.location.href = './src/html/signUp.html?mode=register';
});

document.addEventListener('DOMContentLoaded', function () {
  // Lấy thông tin user đang đăng nhập từ localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const h2Text = document.querySelector('.h2-text');
  const role = document.querySelector('.role');
  const authBox = document.querySelector('.account-top .account-menu__auth');

  if (currentUser) {
    if (h2Text) {
      h2Text.textContent = currentUser.name;
    }

    // Đổi dòng mô tả thành chức vụ (Thành viên hoặc Admin)
    if (role) {
      if (currentUser.role === 'admin') {
        role.textContent = 'Admin';
        role.classList.add('admin');
        role.style.color = '#d63031';
        linkAdmin.style.display = 'flex';
      } else {
        role.textContent = 'Thành viên';
        role.classList.add('customers');
      }
    }

    if (authBox) {
      authBox.style.display = 'none';
    }
  }
});

logOut.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.reload();
});

linkAdmin.addEventListener('click', (e) => {
  window.location.href = './src/html/admin.html';
});
