// Logic xử lý Đăng ký & Đăng nhập Khách hàng
function renderLoginModalContent() {
  const div = document.createElement("div");
  div.className = "space-y-4";
  div.innerHTML = `
    <div class="text-center space-y-1">
        <h3 class="text-xl font-bold text-slate-800">Đăng Nhập Khách Hàng</h3>
        <p class="text-xs text-slate-500">Đăng nhập tài khoản để mua dược phẩm thú y</p>
    </div>
    <form id="client-login-form" class="space-y-3">
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Tài khoản (Mẫu: user)</label>
            <input type="text" id="m-user" required class="w-full p-2 border rounded-lg text-sm">
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Mật khẩu (Mẫu: 123)</label>
            <input type="password" id="m-pass" required class="w-full p-2 border rounded-lg text-sm">
        </div>
        <button type="submit" class="w-full py-2.5 bg-vet-600 hover:bg-vet-700 text-white font-bold rounded-lg text-sm shadow">Đăng Nhập</button>
    </form>
    <div class="text-center pt-2 text-xs">
        <span class="text-slate-500">Chưa có tài khoản? </span>
        <button onclick="openModal('register')" class="text-vet-600 font-bold underline">Đăng ký mới</button>
    </div>
  `;

  setTimeout(() => {
    const form = div.querySelector("#client-login-form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const u = div.querySelector("#m-user").value.trim();
        const p = div.querySelector("#m-pass").value.trim();

        const users = DB.getUsers();
        const found = users.find((x) => x.username === u && x.password === p);

        if (found) {
          if (found.locked) {
            showNotification(
              "Tài khoản của bạn đã bị khóa bởi Quản trị viên!",
              "error",
            );
            return;
          }
          setCurrentUser(found);
          showNotification(`Xin chào ${found.fullname}!`, "success");
          closeModal();
        } else {
          showNotification(
            "Tên đăng nhập hoặc mật khẩu không chính xác!",
            "error",
          );
        }
      };
    }
  }, 0);

  return div;
}

function renderRegisterModalContent() {
  const div = document.createElement("div");
  div.className = "space-y-4";
  div.innerHTML = `
    <div class="text-center space-y-1">
        <h3 class="text-xl font-bold text-slate-800">Đăng Ký Tài Khoản Khách Hàng</h3>
        <p class="text-xs text-slate-500">Tạo tài khoản mua sắm tiện lợi tại VetCare</p>
    </div>
    <form id="client-register-form" class="space-y-3">
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Tên đăng nhập</label>
            <input type="text" id="r-user" required class="w-full p-2 border rounded-lg text-sm">
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Mật khẩu</label>
            <input type="password" id="r-pass" required class="w-full p-2 border rounded-lg text-sm">
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Họ và tên</label>
            <input type="text" id="r-name" required class="w-full p-2 border rounded-lg text-sm">
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại</label>
            <input type="text" id="r-phone" required class="w-full p-2 border rounded-lg text-sm">
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Địa chỉ nhận hàng</label>
            <textarea id="r-address" required class="w-full p-2 border rounded-lg text-sm" rows="2"></textarea>
        </div>
        <button type="submit" class="w-full py-2.5 bg-vet-600 hover:bg-vet-700 text-white font-bold rounded-lg text-sm shadow">Đăng Ký Tài Khoản</button>
    </form>
  `;

  setTimeout(() => {
    const form = div.querySelector("#client-register-form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const username = div.querySelector("#r-user").value.trim();
        const password = div.querySelector("#r-pass").value.trim();
        const fullname = div.querySelector("#r-name").value.trim();
        const phone = div.querySelector("#r-phone").value.trim();
        const address = div.querySelector("#r-address").value.trim();

        const users = DB.getUsers();
        if (users.some((x) => x.username === username)) {
          showNotification("Tên đăng nhập đã tồn tại!", "error");
          return;
        }

        const newUser = {
          id: "U" + Math.floor(100 + Math.random() * 900),
          username,
          password,
          fullname,
          phone,
          address,
          locked: false,
        };
        users.push(newUser);
        DB.saveUsers(users);

        setCurrentUser(newUser);
        showNotification("Đăng ký tài khoản thành công!", "success");
        closeModal();
      };
    }
  }, 0);

  return div;
}
