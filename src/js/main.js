const navLinks = document.querySelectorAll('.nav-item');

const icon = document.querySelectorAll('#iconBranch');
const btnMain = document.querySelector('.icon-set');
const btnIcon = document.querySelectorAll('#switchBtn');
const leftSearchIcon = document.querySelector('.left-search-icon');
const rightSearchIcon = document.querySelector('.right-search-icon');

console.table(icon);

//gạch chân của các vả ở leftNav
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

// Chỉnh icon
btnMain.addEventListener('click', () => {
  btnMain.classList.toggle('active');
});
btnIcon.forEach((iconSet) => {
  iconSet.addEventListener('click', () => {
    btnIcon.forEach((item) => item.classList.remove('active'));
    iconSet.classList.add('active');

    let headerIconSrc = '';
    let leftSearchSrc = '';
    let rightSearchSrc = '';
    let rightDisplay = '';

    switch (iconSet.dataset.pet) {
      case 'dog':
        headerIconSrc = './src/img/icon/sprite-pet-dog-icon.svg';
        leftSearchSrc = './src/img/icon/sprite-pet-dog-sticker.svg';
        rightSearchSrc = './src/img/icon/sprite-pet-cat-sticker.svg';
        rightDisplay = 'none';
        break;
      case 'cat':
        headerIconSrc = './src/img/icon/sprite-pet-cat-icon.svg';
        leftSearchSrc = './src/img/icon/sprite-pet-cat-sticker.svg';
        rightSearchSrc = './src/img/icon/sprite-pet-cat-sticker.svg';
        rightDisplay = 'none';
        break;
      case 'both':
        headerIconSrc = './src/img/icon/sprite-pet-both-icon.svg';
        leftSearchSrc = './src/img/icon/sprite-pet-dog-sticker.svg';
        rightSearchSrc = './src/img/icon/sprite-pet-cat-sticker.svg';
        rightDisplay = 'block';
        break;
      default:
        console.log('Lỗi path');
        return;
    }

    icon.forEach((img) => (img.src = headerIconSrc));
    leftSearchIcon.querySelector('img').src = leftSearchSrc;
    rightSearchIcon.querySelector('img').src = rightSearchSrc;
    rightSearchIcon.style.display = rightDisplay;
  });
});
// slider

var slider_img = document.querySelector('#pic');
const images = [
  'src/img/slider img/BANNER FREESHIP_thumb.webp',
  'src/img/slider img/Horizontal Banner_thumb.webp',
  'src/img/slider img/banner-pate-cun-desktop-v2_thumb.webp',
  'src/img/slider img/HERO BANNER THỨ 4 MỞ APP_thumb.webp',
];
var i = 0; //Img Position

function prev() {
  if (i <= 0) i = images.length;
  i--;
  return setImg();
}
function next() {
  if (i >= images.length - 1) i = -1;
  i++;
  return setImg();
}
function setImg() {
  return slider_img.setAttribute('src', images[i]);
}
