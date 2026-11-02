const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const message = document.getElementById('message');
const cancel = document.getElementById('cancel-button');

// Hàm chuyển sang form Đăng ký
function openRegisterForm() {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  title.textContent = '🐾 Đăng ký';
  subtitle.textContent = 'Tạo tài khoản Pet Shop của bạn';
  message.textContent = '';
}

// Hàm chuyển sang form Đăng nhập
function openLoginForm() {
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  title.textContent = '🐾 Đăng nhập';
  subtitle.textContent = 'Chào mừng bạn quay trở lại!';
  message.textContent = '';
}

document.getElementById('showRegister').addEventListener('click', function (e) {
  e.preventDefault();
  openRegisterForm();
});

document.getElementById('showLogin').addEventListener('click', function (e) {
  e.preventDefault();
  openLoginForm();
});

// Tự động kiểm tra khi từ trang chủ index.html bay sang
window.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode'); // Đọc chữ 'mode' trên URL

  if (mode === 'register') {
    openRegisterForm();
  }
});

// Kiểm tra đăng ký
registerForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    message.style.color = 'red';
    message.textContent = 'Mật khẩu xác nhận không khớp!';
  } else {
    message.style.color = 'green';
    message.textContent = 'Thông tin hợp lệ! Đây là bản demo.';
  }
});

console.log(cancel);
cancel.addEventListener('click', (e) => {
  window.location.href = '../../index.html';
});

registerForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  let role = 'customer';

  const newUser = {
    name: name,
    email: email,
    password: password,
    role: role,
  };

  // Lấy danh sách tài khoản cũ đã lưu trước đó (nếu có), nếu chưa có thì tạo mảng trống []
  let userList = JSON.parse(localStorage.getItem('users')) || [];

  const existingUser = userList.find((user) => user.email === email);
  if (existingUser) {
    message.style.color = 'red';
    message.textContent = 'Email này đã được đăng ký trước đó!';
    return;
  }

  // Thêm tài khoản mới vào danh sách và lưu ngược lại vào localStorage
  userList.push(newUser);
  localStorage.setItem('users', JSON.stringify(userList));

  message.style.color = 'green';
  message.textContent = 'Đăng ký thành công! Bạn có thể chuyển sang đăng nhập.';
  openLoginForm();
});

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const emailInput = document.getElementById('loginEmail').value;
  const passwordInput = document.getElementById('loginPassword').value;

  // 1. Lấy danh sách toàn bộ người dùng đã lưu trong localStorage
  let userList = JSON.parse(localStorage.getItem('users')) || [];

  // 2. Dò tìm xem có tài khoản nào khớp email và password không
  const foundUser = userList.find(
    (user) => user.email === emailInput && user.password === passwordInput
  );

  if (foundUser) {
    message.style.color = 'green';
    message.textContent = `Đăng nhập thành công! Chào mừng ${foundUser.name}`;

    localStorage.setItem('currentUser', JSON.stringify(foundUser));

    window.location.href = '../../index.html';
  } else {
    message.style.color = 'red';
    message.textContent = 'Email hoặc mật khẩu không chính xác!';
  }
});
