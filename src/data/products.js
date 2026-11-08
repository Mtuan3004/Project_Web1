const products = JSON.parse(localStorage.getItem("products")) || [];

products.reverse();
