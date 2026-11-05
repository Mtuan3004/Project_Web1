const navLinks = document.querySelectorAll('.nav-item');

const icon = document.querySelectorAll('#iconBranch');
const btnMain = document.querySelector('.icon-set');
const switchIcon = document.querySelector('#switchIcon');
const petText = document.querySelector('#btnText');
const btnIcon = document.querySelectorAll('#switchBtn');
const leftSearchIcons = document.querySelectorAll('.left-search-icon');
const rightSearchIcons = document.querySelectorAll('.right-search-icon');
const account = document.querySelector('.account');
const accountMenu = document.querySelector('.account-menu');

const selects = document.querySelectorAll('.selects');

const sigUp = document.getElementById('signUp');
const register = document.getElementById('signIn');
const logOut = document.getElementById('logOut');

const linkAdmin = document.querySelector('.link_Admin');

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('left-bar');
// Gạch chân + chuyển màn hình khi bấm nút trên navbar
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // không cho link nhảy theo #Trangchủ...
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    showView(link.dataset.view);
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
    leftSearchIcons.forEach((wrap) => {
      const img = wrap.querySelector('img');
      if (img) img.src = leftSearchSrc;
    });
    rightSearchIcons.forEach((wrap) => {
      const img = wrap.querySelector('img');
      if (img) img.src = rightSearchSrc;
      wrap.style.display = rightDisplay;
    });
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
// Auto Slider
setInterval(() => {
  i++;
  if (i >= totalSlides) i = 0;
  updateSlider();
}, 3000);

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

    if (e.target.closest('.dropdown-menu')) {
      return;
    }

    let isOpen = selectBox.classList.contains('active');
    closeAllMenus();

    if (!isOpen) {
      selectBox.classList.add('active');
    }
  });
});
sigUp.addEventListener('click', (e) => {
  window.location.href = './src/html/signUp.html';
});

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

//open footer menu
function toggleMenu(e) {
  const subMenu = e.querySelector('.subMenu-footer');
  const arrowMenu = e.querySelector('.ri-arrow-down-s-fill');
  subMenu.classList.toggle('open');
  arrowMenu.classList.toggle('open');
}

// ===== Bấm vào sản phẩm -> mở màn chi tiết =====

// Ẩn tất cả màn hình, chỉ hiện màn có id được truyền vào
function showView(id) {
  document
    .querySelectorAll('.app-view')
    .forEach((view) => view.classList.add('d-none'));
  document.getElementById(id).classList.remove('d-none');
  window.scrollTo(0, 0);
}

function formatPrice(n) {
  return Number(n).toLocaleString('vi-VN') + ' đ';
}

async function xemChiTietSanPham(id) {
  const { getProducts } = await import('./ProductService.js');
  const products = await getProducts();

  const p = products.find((item) => String(item.id) === String(id));
  if (!p) return;

  const hasDiscount = p.oldPrice > p.price;

  document.getElementById('detailImg').src = p.image;
  document.getElementById('detailMiniImg').src = p.image;
  document.getElementById('detailTitle').textContent = p.name;
  document.getElementById('detailSubTitle').textContent = p.name;

  document.getElementById('detailSalesPrice').textContent = formatPrice(
    p.price
  );
  document.getElementById('detailOldPrice').textContent = formatPrice(
    p.oldPrice
  );
  document.getElementById('detailDiscount').textContent = p.discount;
  document.getElementById('detailOldPrice').style.display = hasDiscount
    ? ''
    : 'none';
  document.getElementById('detailDiscount').style.display = hasDiscount
    ? ''
    : 'none';

  document.getElementById('detailStock').textContent = p.stock;
  document.getElementById('detailSoldText').textContent =
    `| Đã bán Online: ${p.sold ?? 0}`;
  document.getElementById('detailBrand').textContent = p.brand;
  document.getElementById('detailCategory').textContent = p.category;
  document.getElementById('detailWeight').textContent = p.weight || '—';
  document.getElementById('detailOrigin').textContent =
    p.origin || 'Đang cập nhật';

  document.getElementById('detailFullContent').innerHTML = `
    <p><strong>${p.name}</strong> ${p.description}</p>
    <p><strong>Đặc điểm nổi bật (Highlight):</strong></p>
    <ul>${p.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
  `;

  document.getElementById('quantity').textContent = 1;
  showView('view-detail');
}

// Nút xem thêm
function bindGoTo(selector, viewId) {
  document.querySelectorAll(selector).forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector(`.nav-item[data-view="${viewId}"]`).click();
    });
  });
}

bindGoTo('.view-more', 'view-products');
bindGoTo('.brand-view-more', 'view-brand');


// hahah

const myOrder = document.querySelector('.personal-menu');

myOrder.addEventListener('click', (e) => {
  e.preventDefault(); // nếu .personal-menu là thẻ <a>, chặn nó nhảy trang/cuộn lên đầu
  showView('view-cart');
});