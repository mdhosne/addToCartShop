document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

let cart = [];
let discount = 0;

function fetchProducts() {
    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(data => {
            displayProducts(data);
        });
}

function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        const productHTML = `
            <div class="col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">$${product.price}</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.title}', ${product.price})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productHTML;
    });
}

function addToCart(id, title, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, title, price, quantity: 1 });
    }

    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const discountedTotal = document.getElementById("discounted-total");

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${item.title} - $${(item.price * item.quantity).toFixed(2)}</span>
                <div>
                    <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${item.id}, -1)">➖</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-primary" onclick="changeQuantity(${item.id}, 1)">➕</button>
                    <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${item.id})">❌</button>
                </div>
            </li>
        `;
    });

    const discountedPrice = total - (total * discount);

    cartTotal.textContent = total.toFixed(2);
    discountedTotal.textContent = discountedPrice.toFixed(2);
    cartCount.textContent = cart.length;
}

function changeQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            cart = cart.filter(item => item.id !== id);
        }
    }
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
}

function applyPromoCode() {
    const promoInput = document.getElementById("promo-code").value.trim().toLowerCase();
    const discountMessage = document.getElementById("discount-message");

    if (promoInput === "ostad10") {
        discount = 0.10;
        discountMessage.textContent = "Promo code applied! 10% discount applied.";
    } else if (promoInput === "ostad5") {
        discount = 0.05;
        discountMessage.textContent = "Promo code applied! 5% discount applied.";
    } else {
        discount = 0;
        discountMessage.textContent = "Invalid promo code.";
    }
    updateCart();
}
