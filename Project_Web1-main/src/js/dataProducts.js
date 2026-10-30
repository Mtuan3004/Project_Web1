
// Danh sách sản phẩm nổi bật
const featuredProducts = [
    {
        name: "Bánh thưởng Pedigree Dentastix Cho Cún",
        image: "img-products/pedigree.jpg",
        price: 59000,
        oldPrice: 69000,
        discount: 14
    },
    {
        name: "Combo 10 Pate Silver Spoon Cho Mèo Gói 60g",
        image: "img-products/silver-spoon.jpg",
        price: 180500,
        oldPrice: 190000,
        discount: 5
    },
    {
        name: "Cát Đất Sét Moon Cat Cho Mèo Bịch 9L",
        image: "img-products/moon-cat.jpg",
        price: 65000
    },
    {
        name: "Súp Thưởng PetQ Cho Mèo Vị Sữa Dê Cỏ Mèo",
        image: "img-products/petq.jpg",
        price: 7000
    },
    {
        name: "Hạt S2PET Cho Mèo Premium Bịch 1kg",
        image: "img-products/s2pet.jpg",
        price: 132050,
        oldPrice: 139000,
        discount: 5
    }
];

// Danh sách combo tiết kiệm
const comboProducts = [
    {
        name: "Combo Pate Cho Mèo",
        image: "img-products/combo-pate.jpg",
        price: 120000,
        oldPrice: 150000,
        discount: 20
    },
    {
        name: "Combo Thức Ăn Cho Chó",
        image: "img-products/combo-dog.jpg",
        price: 199000,
        oldPrice: 220000,
        discount: 10
    }
];

// Định dạng giá tiền Việt Nam
function formatPrice(price) {
    return price.toLocaleString("vi-VN") + " đ";
}

// Tạo một khung sản phẩm
function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageBox = document.createElement("div");
    imageBox.className = "product-image";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.loading = "lazy";

    // Nếu ảnh không tồn tại, thông báo trong console
    img.onerror = function () {
        console.error("Không tìm thấy ảnh:", product.image);
    };

    imageBox.appendChild(img);

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name;

    const rating = document.createElement("div");
    rating.className = "product-rating";
    rating.textContent = "★★★★★";
    rating.setAttribute("aria-label", "Đánh giá 5 sao");

    const priceBox = document.createElement("div");
    priceBox.className = "product-price";

    if (product.oldPrice && product.discount) {
        const discount = document.createElement("span");
        discount.className = "discount";
        discount.textContent = "-" + product.discount + "%";

        const oldPrice = document.createElement("span");
        oldPrice.className = "old-price";
        oldPrice.textContent = formatPrice(product.oldPrice);

        priceBox.append(discount, oldPrice);
    }

    const currentPrice = document.createElement("div");
    currentPrice.className = "current-price";
    currentPrice.textContent = formatPrice(product.price);

    card.append(imageBox, name, rating, priceBox, currentPrice);

    return card;
}

// Hiển thị danh sách sản phẩm
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error("Không tìm thấy khu vực:", containerId);
        return;
    }

    container.replaceChildren();

    products.forEach(function (product) {
        container.appendChild(createProductCard(product));
    });
}

// Hiển thị sản phẩm lên trang
document.addEventListener("DOMContentLoaded", function () {
    renderProducts(featuredProducts, "featuredProducts");
    renderProducts(comboProducts, "comboProducts");
});
