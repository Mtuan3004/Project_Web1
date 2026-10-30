document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("admin-login-form");
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const u = document.getElementById("admin-user").value.trim();
      const p = document.getElementById("admin-pass").value.trim();

      if (u === DEFAULT_ADMIN.username && p === DEFAULT_ADMIN.password) {
        localStorage.setItem("vet_admin_logged", "true");
        window.location.href = "admin.html";
      } else {
        alert("Sai tài khoản hoặc mật khẩu Quản trị!");
      }
    };
  }
});

function logoutAdmin() {
  localStorage.removeItem("vet_admin_logged");
  window.location.href = "../../index.html";
}
