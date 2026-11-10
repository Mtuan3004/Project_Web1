// Section tài khoản (#view-account): hiển thị, kiểm tra dữ liệu, lưu localStorage
(function () {
  var STORAGE_KEY = "petpet_account";
  // [SỬA] Thêm 2 key dùng chung với phần đăng nhập / đăng ký của web
  var CURRENT_USER_KEY = "currentUser"; // người đang đăng nhập (object)
  var USERS_KEY = "users"; // danh sách tất cả tài khoản (array)

  var root = document.getElementById("view-account");
  if (!root) return; // không có section thì không làm gì

  var form = document.getElementById("acs-form");
  var $ = function (id) {
    return document.getElementById("acs-" + id);
  };

  // Dữ liệu địa chỉ mẫu, thêm tỉnh / quận / phường tại đây
  var ADDRESS = {
    "TP. Hồ Chí Minh": {
      "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Đa Kao"],
      "Quận 3": ["Phường Võ Thị Sáu", "Phường 1", "Phường 2"],
      "Quận Bình Thạnh": ["Phường 1", "Phường 2", "Phường 3"],
    },
    "Hà Nội": {
      "Quận Ba Đình": ["Phường Điện Biên", "Phường Kim Mã"],
      "Quận Cầu Giấy": ["Phường Dịch Vọng", "Phường Nghĩa Tân"],
    },
    "Đà Nẵng": {
      "Quận Hải Châu": ["Phường Hải Châu 1", "Phường Thạch Thang"],
      "Quận Sơn Trà": ["Phường An Hải Bắc", "Phường Mân Thái"],
    },
  };

  // Dữ liệu mặc định khi chưa đăng nhập và chưa lưu lần nào (chỉ để demo)
  var DEFAULT_DATA = {
    fullName: "Tuấn Nguyễn",
    phone: "0901 234 567",
    email: "tuannguyen@gmail.com",
    dob: "1998-06-12",
    gender: "Nam",
    city: "TP. Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    street: "25 Nguyễn Huệ",
  };

  var FIELDS = [
    "fullName",
    "phone",
    "email",
    "dob",
    "gender",
    "city",
    "district",
    "ward",
    "street",
  ];

  /* ---------- localStorage (có bắt lỗi) ---------- */
  // [SỬA] Hàm đọc / ghi JSON dùng chung cho các key mới
  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var obj = JSON.parse(raw);
      return obj === null || obj === undefined ? fallback : obj;
    } catch (e) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  // [SỬA] Đọc dữ liệu hiển thị. Ưu tiên: currentUser (các trường chưa có thì để trống)
  // > petpet_account (cũ) > DEFAULT_DATA (khi chưa đăng nhập, chỉ để demo)
  function readData() {
    var cur = readJSON(CURRENT_USER_KEY, null);
    var saved = readJSON(STORAGE_KEY, null);

    if (cur && typeof cur === "object" && !Array.isArray(cur)) {
      // Dữ liệu phụ (sdt, ngày sinh...) lấy từ currentUser; nếu chưa có thì thử bản lưu cũ
      var old =
        saved && typeof saved === "object" && saved.email === cur.email
          ? saved
          : {};
      return {
        fullName: cur.name || old.fullName || "",
        phone: cur.phone || old.phone || "",
        email: cur.email || "",
        dob: cur.dob || old.dob || "",
        gender: cur.gender || old.gender || "",
        city: cur.city || old.city || "",
        district: cur.district || old.district || "",
        ward: cur.ward || old.ward || "",
        street: cur.street || old.street || "",
      };
    }

    if (saved && typeof saved === "object") return saved;
    return DEFAULT_DATA;
  }

  function writeData(data) {
    // Giữ lại bản lưu cũ để không ảnh hưởng chỗ khác đang đọc 'petpet_account'
    return writeJSON(STORAGE_KEY, data);
  }

  // [SỬA] Đồng bộ thông tin vừa sửa vào currentUser và users
  // - Giữ nguyên password, role và mọi trường khác của tài khoản
  // - Tìm tài khoản trong users theo email CŨ (phòng trường hợp người dùng đổi email)
  function syncUser(data) {
    var cur = readJSON(CURRENT_USER_KEY, null);
    if (!cur || typeof cur !== "object" || Array.isArray(cur)) return true; // chưa đăng nhập: bỏ qua

    var oldEmail = cur.email;
    var extra = {
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      gender: data.gender,
      city: data.city,
      district: data.district,
      ward: data.ward,
      street: data.street,
    };

    var newCur = Object.assign({}, cur, extra);
    var ok = writeJSON(CURRENT_USER_KEY, newCur);

    var users = readJSON(USERS_KEY, []);
    if (!Array.isArray(users)) users = [];
    var found = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i] && users[i].email === oldEmail) {
        users[i] = Object.assign({}, users[i], extra); // giữ password, role cũ
        found = true;
        break;
      }
    }
    if (!found) users.push(newCur);
    ok = writeJSON(USERS_KEY, users) && ok;
    return ok;
  }

  // [SỬA] Kiểm tra email đã bị tài khoản khác dùng chưa
  function emailTakenByOther(email) {
    var cur = readJSON(CURRENT_USER_KEY, null);
    var users = readJSON(USERS_KEY, []);
    if (!Array.isArray(users)) return false;
    var myEmail = cur && cur.email ? String(cur.email).toLowerCase() : "";
    var target = String(email).trim().toLowerCase();
    if (target === myEmail) return false;
    for (var i = 0; i < users.length; i++) {
      if (users[i] && String(users[i].email).toLowerCase() === target)
        return true;
    }
    return false;
  }

  /* ---------- Select địa chỉ phụ thuộc nhau ---------- */
  function fillSelect(sel, items, placeholder, selected) {
    sel.innerHTML = "";
    var first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    sel.appendChild(first);
    items.forEach(function (name) {
      var o = document.createElement("option");
      o.value = name;
      o.textContent = name;
      sel.appendChild(o);
    });
    sel.value = items.indexOf(selected) > -1 ? selected : "";
  }
  function loadCities(selected) {
    fillSelect(
      $("city"),
      Object.keys(ADDRESS),
      "Chọn Tỉnh / Thành phố",
      selected,
    );
  }
  function loadDistricts(city, selected) {
    fillSelect(
      $("district"),
      ADDRESS[city] ? Object.keys(ADDRESS[city]) : [],
      "Chọn Quận / Huyện",
      selected,
    );
    $("district").disabled = !city;
  }
  function loadWards(city, district, selected) {
    var list = (ADDRESS[city] && ADDRESS[city][district]) || [];
    fillSelect($("ward"), list, "Chọn Phường / Xã", selected);
    $("ward").disabled = !district;
  }

  $("city").addEventListener("change", function () {
    loadDistricts(this.value, "");
    loadWards(this.value, "", "");
  });
  $("district").addEventListener("change", function () {
    loadWards($("city").value, this.value, "");
  });

  /* ---------- Hiển thị dữ liệu ---------- */
  function updateSidebar() {
    var name = $("fullName").value.trim().replace(/\s+/g, " ") || "Thành viên";
    $("side-name").textContent = name;
    var parts = name.split(" ");
    $("avatar").textContent = parts[parts.length - 1].charAt(0).toUpperCase();
  }

  function todayString() {
    var d = new Date();
    var m = ("0" + (d.getMonth() + 1)).slice(-2);
    var day = ("0" + d.getDate()).slice(-2);
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function applyData(d) {
    loadCities(d.city);
    loadDistricts($("city").value, d.district);
    loadWards($("city").value, $("district").value, d.ward);
    ["fullName", "phone", "email", "dob", "gender", "street"].forEach(
      function (k) {
        $(k).value = d[k] || "";
      },
    );
    $("dob").max = todayString(); // chặn chọn ngày tương lai ngay trên lịch
    updateSidebar();
  }

  /* ---------- Kiểm tra dữ liệu ---------- */
  function setError(id, message) {
    var input = $(id),
      err = $("err-" + id);
    if (message) {
      input.classList.add("acs-invalid");
      err.textContent = message;
      err.classList.add("show");
    } else {
      input.classList.remove("acs-invalid");
      err.textContent = "";
      err.classList.remove("show");
    }
    return !message;
  }

  var validators = {
    fullName: function (v) {
      v = v.trim().replace(/\s+/g, " ");
      if (!v) return "Vui lòng nhập họ và tên.";
      if (v.length < 2) return "Họ và tên phải có ít nhất 2 ký tự.";
      if (/[0-9]/.test(v)) return "Họ và tên không được chứa chữ số.";
      if (/[^\p{L}\s'.-]/u.test(v))
        return "Họ và tên không được chứa ký tự đặc biệt.";
      return "";
    },
    phone: function (v) {
      var digits = v.replace(/[\s.-]/g, "");
      if (!digits) return "Vui lòng nhập số điện thoại.";
      if (!/^\+?\d+$/.test(digits))
        return "Số điện thoại chỉ được chứa chữ số.";
      if (!/^(0|\+84)(3|5|7|8|9)\d{8}$/.test(digits))
        return "Số điện thoại không hợp lệ (ví dụ: 0901 234 567).";
      return "";
    },
    email: function (v) {
      v = v.trim();
      if (!v) return "Vui lòng nhập email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
        return "Email không hợp lệ (ví dụ: ten@gmail.com).";
      // [SỬA] Không cho trùng email với tài khoản khác trong 'users'
      if (emailTakenByOther(v)) return "Email này đã được sử dụng.";
      return "";
    },
    dob: function (v) {
      if (!v) return ""; // không bắt buộc
      var d = new Date(v);
      if (isNaN(d.getTime())) return "Ngày sinh không hợp lệ.";
      var today = new Date();
      if (d > today) return "Ngày sinh không được ở tương lai.";
      var age = today.getFullYear() - d.getFullYear();
      var m = today.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
      if (age < 13) return "Bạn cần từ 13 tuổi trở lên.";
      if (age > 120) return "Ngày sinh không hợp lệ.";
      return "";
    },
  };

  function validateField(id) {
    return setError(id, validators[id]($(id).value));
  }

  // Địa chỉ không bắt buộc, nhưng đã điền một phần thì phải điền đủ
  function validateAddress() {
    var city = $("city").value,
      dist = $("district").value,
      ward = $("ward").value;
    var street = $("street").value.trim();
    var any = city || dist || ward || street;
    var ok = true;
    ok =
      setError("city", any && !city ? "Vui lòng chọn Tỉnh / Thành phố." : "") &&
      ok;
    ok =
      setError(
        "district",
        city && any && !dist ? "Vui lòng chọn Quận / Huyện." : "",
      ) && ok;
    ok =
      setError(
        "ward",
        dist && any && !ward ? "Vui lòng chọn Phường / Xã." : "",
      ) && ok;
    var streetMsg = "";
    if (any && !street) streetMsg = "Vui lòng nhập địa chỉ cụ thể.";
    else if (street && street.length < 5)
      streetMsg = "Địa chỉ cụ thể quá ngắn (tối thiểu 5 ký tự).";
    ok = setError("street", streetMsg) && ok;
    return ok;
  }

  ["fullName", "phone", "email", "dob"].forEach(function (id) {
    $(id).addEventListener("blur", function () {
      validateField(id);
    });
    $(id).addEventListener("input", function () {
      if ($(id).classList.contains("acs-invalid")) validateField(id);
      if (id === "fullName") updateSidebar();
    });
  });
  $("dob").addEventListener("change", function () {
    validateField("dob");
  });
  ["city", "district", "ward"].forEach(function (id) {
    $(id).addEventListener("change", validateAddress);
  });
  $("street").addEventListener("blur", validateAddress);

  // Số điện thoại chỉ cho gõ ký tự hợp lệ
  $("phone").addEventListener("input", function () {
    this.value = this.value.replace(/[^\d\s+.-]/g, "");
  });

  /* ---------- Thông báo + gửi form ---------- */
  var msgTimers = {};
  function showMessage(text, ok, id) {
    id = id || "msg";
    var el = $(id);
    el.textContent = text;
    el.className = "acs-msg show " + (ok ? "ok" : "fail");
    clearTimeout(msgTimers[id]);
    msgTimers[id] = setTimeout(function () {
      el.classList.remove("show");
    }, 3000);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var results = [
      validateField("fullName"),
      validateField("phone"),
      validateField("email"),
      validateField("dob"),
      validateAddress(),
    ];

    if (results.indexOf(false) > -1) {
      var firstBad = form.querySelector(".acs-invalid");
      if (firstBad) firstBad.focus();
      showMessage("Vui lòng kiểm tra lại các trường báo lỗi.", false);
      return;
    }

    var data = {};
    FIELDS.forEach(function (k) {
      data[k] = $(k).value.trim();
    });
    data.fullName = data.fullName.replace(/\s+/g, " ");

    // [SỬA] Lưu bản 'petpet_account' như cũ + đồng bộ sang currentUser / users
    var saved = writeData(data);
    var synced = syncUser(data);

    if (saved && synced) {
      $("fullName").value = data.fullName;
      updateSidebar();
      showMessage("Đã lưu thay đổi!", true);
      // Phần khác của web (header, giỏ hàng...) có thể lắng nghe sự kiện này để cập nhật tên
      window.dispatchEvent(
        new CustomEvent("account:updated", { detail: data }),
      );
    } else {
      showMessage("Không thể lưu, trình duyệt đang chặn lưu dữ liệu.", false);
    }
  });

  /* ---------- Chuyển tab (Thông tin / Đổi mật khẩu) ---------- */
  var menuItems = root.querySelectorAll(".acs-menu-item");
  var panels = root.querySelectorAll(".acs-panel");

  function showTab(name) {
    menuItems.forEach(function (item) {
      item.classList.toggle("active", item.getAttribute("data-tab") === name);
    });
    panels.forEach(function (panel) {
      panel.classList.toggle("active", panel.id === "acs-panel-" + name);
    });
  }
  menuItems.forEach(function (item) {
    item.addEventListener("click", function () {
      showTab(item.getAttribute("data-tab"));
    });
  });

  /* ---------- Đổi mật khẩu ---------- */
  var PASS_KEY = "petpet_password";
  var DEFAULT_PASSWORD = "123456"; // mật khẩu mặc định khi chưa đổi lần nào (chỉ để demo)
  var passForm = document.getElementById("acs-pass-form");

  // [SỬA] Mật khẩu hiện tại lấy từ currentUser trước, không có mới dùng key cũ / mặc định
  function readPassword() {
    var cur = readJSON(CURRENT_USER_KEY, null);
    if (cur && typeof cur === "object" && cur.password) return cur.password;
    try {
      return localStorage.getItem(PASS_KEY) || DEFAULT_PASSWORD;
    } catch (e) {
      return DEFAULT_PASSWORD;
    }
  }
  // [SỬA] Ghi mật khẩu mới vào key cũ + currentUser + users (giữ nguyên các trường khác)
  function writePassword(value) {
    var ok = true;
    try {
      localStorage.setItem(PASS_KEY, value);
    } catch (e) {
      ok = false;
    }

    var cur = readJSON(CURRENT_USER_KEY, null);
    if (cur && typeof cur === "object" && !Array.isArray(cur)) {
      var email = cur.email;
      cur.password = value;
      ok = writeJSON(CURRENT_USER_KEY, cur) && ok;

      var users = readJSON(USERS_KEY, []);
      if (Array.isArray(users)) {
        for (var i = 0; i < users.length; i++) {
          if (users[i] && users[i].email === email) {
            users[i].password = value;
            break;
          }
        }
        ok = writeJSON(USERS_KEY, users) && ok;
      }
    }
    return ok;
  }

  // Nút con mắt: hiện / ẩn mật khẩu
  root.querySelectorAll(".acs-eye").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = document.getElementById(btn.getAttribute("data-target"));
      var icon = btn.querySelector("i");
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      icon.className = show ? "ri-eye-off-line" : "ri-eye-line";
    });
  });

  function checkCurPass() {
    var v = $("curPass").value;
    if (!v) return setError("curPass", "Vui lòng nhập mật khẩu hiện tại.");
    if (v !== readPassword())
      return setError("curPass", "Mật khẩu hiện tại không đúng.");
    return setError("curPass", "");
  }
  function checkNewPass() {
    var v = $("newPass").value;
    var msg = "";
    if (!v) msg = "Vui lòng nhập mật khẩu mới.";
    else if (/\s/.test(v)) msg = "Mật khẩu không được chứa khoảng trắng.";
    else if (v.length < 6) msg = "Mật khẩu phải có ít nhất 6 ký tự.";
    else if (!/[A-Za-z]/.test(v) || !/[0-9]/.test(v))
      msg = "Mật khẩu phải gồm cả chữ và số.";
    else if (v === $("curPass").value)
      msg = "Mật khẩu mới phải khác mật khẩu hiện tại.";
    return setError("newPass", msg);
  }
  function checkConfirmPass() {
    var v = $("confirmPass").value;
    var msg = "";
    if (!v) msg = "Vui lòng nhập lại mật khẩu mới.";
    else if (v !== $("newPass").value) msg = "Mật khẩu nhập lại không khớp.";
    return setError("confirmPass", msg);
  }

  $("curPass").addEventListener("blur", checkCurPass);
  $("newPass").addEventListener("blur", checkNewPass);
  $("confirmPass").addEventListener("blur", checkConfirmPass);
  ["curPass", "newPass", "confirmPass"].forEach(function (id) {
    $(id).addEventListener("input", function () {
      if (!$(id).classList.contains("acs-invalid")) return;
      if (id === "curPass") checkCurPass();
      if (id === "newPass") checkNewPass();
      if (id === "confirmPass") checkConfirmPass();
    });
  });

  passForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok1 = checkCurPass();
    var ok2 = checkNewPass();
    var ok3 = checkConfirmPass();

    if (!(ok1 && ok2 && ok3)) {
      var bad = passForm.querySelector(".acs-invalid");
      if (bad) bad.focus();
      showMessage(
        "Vui lòng kiểm tra lại các trường báo lỗi.",
        false,
        "pass-msg",
      );
      return;
    }

    if (writePassword($("newPass").value)) {
      passForm.reset();
      showMessage("Đổi mật khẩu thành công!", true, "pass-msg");
    } else {
      showMessage(
        "Không thể lưu, trình duyệt đang chặn lưu dữ liệu.",
        false,
        "pass-msg",
      );
    }
  });

  applyData(readData());
})();
