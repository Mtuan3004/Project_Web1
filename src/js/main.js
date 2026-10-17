// Lấy tất cả các thẻ có class là .nav-link
const navLinks = document.querySelectorAll(".nav-item");

navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    navLinks.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
  });
});
