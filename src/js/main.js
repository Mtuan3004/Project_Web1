const navLinks = document.querySelectorAll(".nav-item");

const icon = document.querySelectorAll("#iconBranch");
const btnMain = document.querySelector(".icon-set");
const btnIcon = document.querySelectorAll("#switchBtn");
const leftSearchIcon = document.querySelector(".left-search-icon");
const rightSearchIcon = document.querySelector(".right-search-icon");

console.table(icon);

//gạch chân của các vả ở leftNav
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

// Chỉnh icon
btnMain.addEventListener("click", () => {
  btnMain.classList.toggle("active");
});
btnIcon.forEach((iconSet) => {
  iconSet.addEventListener("click", () => {
    btnIcon.forEach((item) => item.classList.remove("active"));
    iconSet.classList.add("active");

    let headerIconSrc = "";
    let leftSearchSrc = "";
    let rightSearchSrc = "";
    let rightDisplay = "";

    switch (iconSet.dataset.pet) {
      case "dog":
        headerIconSrc = "./src/img/icon/sprite-pet-dog-icon.svg";
        leftSearchSrc = "./src/img/icon/sprite-pet-dog-sticker.svg";
        rightSearchSrc = "./src/img/icon/sprite-pet-cat-sticker.svg";
        rightDisplay = "none";
        break;
      case "cat":
        headerIconSrc = "./src/img/icon/sprite-pet-cat-icon.svg";
        leftSearchSrc = "./src/img/icon/sprite-pet-cat-sticker.svg";
        rightSearchSrc = "./src/img/icon/sprite-pet-cat-sticker.svg";
        rightDisplay = "none";
        break;
      case "both":
        headerIconSrc = "./src/img/icon/sprite-pet-both-icon.svg";
        leftSearchSrc = "./src/img/icon/sprite-pet-dog-sticker.svg";
        rightSearchSrc = "./src/img/icon/sprite-pet-cat-sticker.svg";
        rightDisplay = "block";
        break;
      default:
        console.log("Lỗi path");
        return;
    }

    icon.forEach((img) => (img.src = headerIconSrc));
    leftSearchIcon.querySelector("img").src = leftSearchSrc;
    rightSearchIcon.querySelector("img").src = rightSearchSrc;
    rightSearchIcon.style.display = rightDisplay;
  });
});
