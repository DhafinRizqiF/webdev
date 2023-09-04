// Mendefinisikan variable global
const cart = [];
let cartTotal = 0;

// Fungsi untuk mengambil data dari JSON
async function fetchProductData() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return [];
    }
}

// Fungsi untuk increment kuantitas pada produk
function incrementQuantity(quantityInput) {
    const currentValue = parseInt(quantityInput.value);
    quantityInput.value = isNaN(currentValue) ? 1 : currentValue + 1;
}

// Fungsi untuk decrement kuantitas pada produk
function decrementQuantity(quantityInput) {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 0) {
        quantityInput.value = currentValue - 1;
    }
}

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(productName, price, quantityInput, productImage) {
    const quantityValue = parseInt(quantityInput.value);
    if (quantityValue > 0) {
        for (let i = 0; i < quantityValue; i++) {
            cart.push({ productName, price, productImage });
        }
        cartTotal += price * quantityValue;
        updateCartUI();
        quantityInput.value = 0;
    }
}

// Fungsi untuk memperbarui isi keranjang
function updateCartUI() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';

    const cartItemCounts = {};

    for (const item of cart) {
        const productName = item.productName;
        const productImage = item.productImage;

        if (!cartItemCounts[productName]) {
            cartItemCounts[productName] = {
                quantity: 0,
                price: item.price,
                productImage: productImage,
            };
        }
        cartItemCounts[productName].quantity++;
    }

    let cartSubtotal = 0;

    for (const productName in cartItemCounts) {
        const cartItem = cartItemCounts[productName];
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        cartItemDiv.innerHTML = `
            <img src="${cartItem.productImage}" alt="${productName}" class="cart-item-image" style="width: 200px;">
            <div class="cart-item-details">
                ${productName}<br>
                Kuantitas: ${cartItem.quantity}<br>
                <span>Harga: Rp.${(cartItem.price * cartItem.quantity)}</span>
            </div>
        `;
        cartItemsDiv.appendChild(cartItemDiv);

        // Menghitung subtotal
        cartSubtotal += cartItem.price * cartItem.quantity;
    }

    // Menghitung pajak
    const taxRate = 0.11;
    const taxAmount = cartSubtotal * taxRate;

    // Menghitung total beserta pajak
    const cartTotal = cartSubtotal + taxAmount;

    const cartTotalSpan = document.getElementById('cart-total');
    cartTotalSpan.innerHTML = `
        Subtotal: Rp.${cartSubtotal} <br>
        Pajak (11%): Rp.${taxAmount} <br>
        Total: Rp.${cartTotal}
    `;
}

// Fungsi untuk mengambil harga dari nama produk
function getItemPrice(productName) {
    const productData = productsData.find(product => product.name === productName);
    return productData ? productData.price : 0;
}

// Memanggil fungsi untuk men generate produk saat halaman reload
window.onload = async () => {
    productsData = await fetchProductData();
    generateProductCards();
};

let productsData = [];

// Fungsi untuk men generate etalase produk
function generateProductCards() {
    const productsContainer = document.getElementById('products');

    productsData.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        productDiv.innerHTML = `
            <h2>${product.name}</h2>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <p>Harga: Rp.${product.price}</p>
            <div class="quantity-input">
                <button class="quantity-button" onclick="decrementQuantity(this.nextElementSibling)">-</button>
                <input type="number" value="0" class="quantity-value">
                <button class="quantity-button" onclick="incrementQuantity(this.previousElementSibling)">+</button>
            </div>
            <button class="add-to-cart-button" onclick="addToCart('${product.name}', ${product.price}, this.parentElement.querySelector('.quantity-value'), '${product.image}')">Add to Cart</button>
        `;

        productsContainer.appendChild(productDiv);
    });
}
