let heartsIcon =document.querySelector(".ri-poker-hearts-line");

heartsIcon.addEventListener("click", () =>{
    heartsIcon.addEventListener("click", () => {
        if (heartsIcon.classList.contains("ri-poker-hearts-line")) {
            heartsIcon.classList.replace("ri-poker-hearts-line", "ri-poker-hearts-fill");
            heartsIcon.style.color = "#ff4757"; 
        } else {
            heartsIcon.classList.replace("ri-poker-hearts-fill", "ri-poker-hearts-line");
            heartsIcon.style.color = "#555"; 
        }
    });
})

function changeQuantity(amount) {
    const quantityElem = document.getElementById('quantity');
    if (!quantityElem) return;

    let currentQty = parseInt(quantityElem.textContent) || 1;
    
    let newQty = currentQty + amount;

    if (newQty < 1) {
        newQty = 1;
    }

    quantityElem.textContent = newQty;
}