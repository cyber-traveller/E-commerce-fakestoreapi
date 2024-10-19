const productListElement = document.getElementById("product-list");
const productModalElement = document.getElementById("product-modal");
const modalTitleElement = document.getElementById("modal-title");
const modalDescriptionElement = document.getElementById("modal-description");
const modalImageElement = document.getElementById("modal-image");
const modalPriceElement = document.getElementById("modal-price");
const modalQuantityElement = document.getElementById("modal-quantity");
const addToCartModalButton = document.getElementById("add-to-cart-modal");
const cartModalElement = document.getElementById("cart-modal");
const cartItemsElement = document.getElementById("cart-items");
const closeCartButtonElement = document.getElementById("close-cart");
const cartButtonElement = document.getElementById("cart-btn");
const searchElement = document.getElementById("search");

let cart = [];
let allProducts = []; // Array to store all fetched products

// Function to fetch products
async function fetchProducts() {
    const response = await fetch("https://fakestoreapi.com/products");
    allProducts = await response.json(); // Store fetched products in the array
    displayProducts(allProducts); // Display all products on initial load
}

// Function to display products in cards
function displayProducts(products) {
    productListElement.innerHTML = "";
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "bg-white rounded-lg shadow-md p-4 cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100"; // Enhanced hover effect
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="h-40 mx-auto mb-4 rounded-md">
            <h2 class="text-lg font-semibold">${product.title}</h2>
            <p class="text-gray-600">$${product.price}</p>
        `;
        
        // Add click event to open the modal
        productCard.addEventListener("click", () => {
            showProductDetails(product);
        });

        productListElement.appendChild(productCard);
    });
}

// Function to show product details in the modal
function showProductDetails(product) {
    modalTitleElement.textContent = product.title;
    modalDescriptionElement.textContent = product.description;
    modalImageElement.src = product.image;
    modalPriceElement.textContent = `$${product.price}`;
    modalQuantityElement.value = 1; // Reset quantity to 1
    productModalElement.classList.remove("hidden");
}

// Close product modal
document.getElementById("close-modal").addEventListener("click", () => {
    productModalElement.classList.add("hidden");
});

// Add to cart functionality
addToCartModalButton.addEventListener("click", () => {
    const product = {
        id: Date.now(), // Unique id for the demo purpose
        title: modalTitleElement.textContent,
        price: parseFloat(modalPriceElement.textContent.replace('$', '')),
        quantity: parseInt(modalQuantityElement.value),
        image: modalImageElement.src
    };
    
    addToCart(product);
    productModalElement.classList.add("hidden"); // Close modal after adding to cart
});

// Function to add product to the cart
function addToCart(product) {
    const existingProduct = cart.find(item => item.title === product.title);
    if (existingProduct) {
        existingProduct.quantity += product.quantity; // Update quantity if already in cart
    } else {
        cart.push(product); // Add new product to cart
    }
    updateCartCount();
}

// Function to update the cart count
function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Function to open the cart modal
function openCartModal() {
    cartItemsElement.innerHTML = ""; // Clear previous cart items
    let totalAmount = 0; // Initialize total amount

    cart.forEach(item => {
        const itemTotalPrice = item.price * item.quantity; // Calculate total price for the item
        totalAmount += itemTotalPrice; // Add to total amount

        const cartItemElement = document.createElement("div");
        cartItemElement.className = "flex justify-between items-center mb-4";
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="h-16 mr-4">
            <div class="flex-1">
                <h3 class="text-lg font-semibold">${item.title}</h3>
                <p class="text-gray-600">$${item.price} x <span class="item-quantity">${item.quantity}</span> = $${itemTotalPrice.toFixed(2)}</p>
            </div>
            <div class="flex items-center">
                <button class="increase-quantity bg-green-500 text-white px-2 rounded" data-id="${item.id}">+</button>
                <button class="decrease-quantity bg-yellow-500 text-white px-2 rounded mx-2" data-id="${item.id}">-</button>
                <button class="remove-from-cart bg-red-500 text-white px-2 rounded" data-id="${item.id}">Remove</button>
            </div>
        `;
        
        // Add event listeners for quantity and remove functionality
        const increaseButton = cartItemElement.querySelector(".increase-quantity");
        const decreaseButton = cartItemElement.querySelector(".decrease-quantity");
        const removeFromCartButton = cartItemElement.querySelector(".remove-from-cart");

        increaseButton.addEventListener("click", () => {
            updateQuantity(item.id, 1); // Increase quantity
        });

        decreaseButton.addEventListener("click", () => {
            updateQuantity(item.id, -1); // Decrease quantity
        });

        removeFromCartButton.addEventListener("click", () => {
            removeFromCart(item.id);
        });

        cartItemsElement.appendChild(cartItemElement);
    });

    // Show total amount at the bottom of the cart
    const totalElement = document.createElement("div");
    totalElement.className = "font-bold text-lg";
    totalElement.textContent = `Total Amount: $${totalAmount.toFixed(2)}`; // Display total amount
    cartItemsElement.appendChild(totalElement);

    cartModalElement.classList.remove("hidden");
}

// Attach event listener to the cart button to open the cart modal
cartButtonElement.addEventListener("click", openCartModal);

// Function to update the quantity of a cart item
function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta; // Update the quantity

        if (item.quantity <= 0) {
            removeFromCart(productId); // Remove item if quantity is 0 or less
        }
    }
    updateCartCount(); // Update cart count
    openCartModal(); // Re-render the modal
}

// Function to remove an item from the cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);  // Remove the item from the cart
    updateCartCount();
    openCartModal();  // Re-render the modal after updating
}

// Attach event listener to close the cart modal
closeCartButtonElement.addEventListener("click", () => {
    cartModalElement.classList.add("hidden");  // Hide the cart modal
});

// Attach event listener for the search bar
searchElement.addEventListener("input", (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchText)
    );
    displayProducts(filteredProducts); // Display filtered products
});

// Fetch products on page load
fetchProducts();
Products();
