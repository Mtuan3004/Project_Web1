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
}

btnMain.addEventListener('click', () => {
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
