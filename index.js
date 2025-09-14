let cart = [];


function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartTitle = document.getElementById("cart-title");
  const emptyCartBlock = document.getElementById("empty-cart");
  const nonEmptyCart = document.getElementById("non-empty-cart");
  cartItems.innerHTML = ""; // Clear previous items
  let total = 0;

  
  cartTitle.textContent = `Your Cart (${cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )})`;

  
  emptyCartBlock.style.display = cart.length === 0 ? "flex" : "none";
  nonEmptyCart.style.display = cart.length === 0 ? "none" : "block";
  cartTotal.textContent = cart.length === 0 ? "$0.00" : "";

 
  cart.forEach((item, index) => {
    const itemTotal = item.quantity * item.price;
    total += itemTotal;

    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center border-b border-Rose-100 py-2";
    li.innerHTML = `
      <div class="flex items-center space-x-3 space-y-2">
        <div class="space-y-4">
          <h4 class="text-4-bold text-Rose-900">${item.name}</h4>
          <p class="text-4 text-Rose-500">
            <span class="text-4-bold text-Red mr-2">${
              item.quantity
            }x</span> @ $${item.price.toFixed(2)} 
            <span class="text-4-bold">$${itemTotal.toFixed(2)}</span>
          </p>
        </div>
      </div>
      <button class="group remove-item text-red-500 text-xs underline cursor-pointer ml-3" data-index="${index}" aria-label="Remove ${
      item.name
    } from cart">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 1.25C5.125 1.25 1.25 5.125 1.25 10C1.25 14.875 5.125 18.75 10 18.75C14.875 18.75 18.75 14.875 18.75 10C18.75 5.125 14.875 1.25 10 1.25ZM10 17.5C5.875 17.5 2.5 14.125 2.5 10C2.5 5.875 5.875 2.5 10 2.5C14.125 2.5 17.5 5.875 17.5 10C17.5 14.125 14.125 17.5 10 17.5Z" class="fill-[#AD8A85] group-hover:fill-Rose-900 transition-colors duration-300"/>
          <path d="M13.375 14.375L10 11L6.625 14.375L5.625 13.375L9 10L5.625 6.625L6.625 5.625L10 9L13.375 5.625L14.375 6.625L11 10L14.375 13.375L13.375 14.375Z" class="fill-[#AD8A85] group-hover:fill-Rose-900 transition-colors duration-300"/>
        </svg>
      </button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
}


function setupCartEventListeners() {
  const cartItems = document.getElementById("cart-items");
  cartItems.addEventListener("click", (e) => {
    const button = e.target.closest(".remove-item");
    if (button) {
      const index = button.dataset.index;
      const itemName = cart[index].name;
      cart.splice(index, 1);
      updateCart();
      updateProductCard(itemName);
    }
  });
}


function updateProductCard(productName) {
  const cards = document.querySelectorAll("#product-container > div");
  cards.forEach((card) => {
    const nameElement = card.querySelector(".text-3.text-Rose-900");
    if (nameElement?.textContent === productName) {
      const quantityContainer = card.querySelector(".quantity-container");
      const addToCartBtn = card.querySelector(".add-to-cart");
      const quantitySpan = card.querySelector(".quantity");
      const image = card.querySelector(".image-border");
      const cartItem = cart.find((item) => item.name === productName);

      if (cartItem) {
        quantitySpan.textContent = cartItem.quantity;
        quantityContainer.classList.remove("hidden");
        addToCartBtn.classList.add("hidden");
        image.classList.add("border-2", "border-Red");
      } else {
        quantitySpan.textContent = "0";
        quantityContainer.classList.add("hidden");
        addToCartBtn.classList.remove("hidden");
        image.classList.remove("border-2", "border-Red");
      }
    }
  });
}


function showOrderConfirmedModal() {
  const modalCartItems = document.getElementById("modal-cart-items");
  const modalCartTotal = document.getElementById("modal-cart-total");
  modalCartItems.innerHTML = ""; 
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.quantity * item.price;
    total += itemTotal;

    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center border-b border-Rose-100 py-2";
    li.innerHTML = `
      <div class="flex items-center space-x-3">
        <img src="${item.image.thumbnail}" alt="${
      item.name
    }" class="w-12 h-12 rounded">
        <div>
          <h4 class="text-4-bold text-Rose-900">${item.name}</h4>
          <p class="text-4 text-Rose-500">
            <span class="text-4-bold text-Red mr-2">${
              item.quantity
            }x</span> @ $${item.price.toFixed(2)}
          </p>
        </div>
      </div>
      <span class="text-4-bold text-Rose-900">$${itemTotal.toFixed(2)}</span>
    `;
    modalCartItems.appendChild(li);
  });

  modalCartTotal.textContent = `$${total.toFixed(2)}`;
  const cartModal = document.getElementById("cart-modal");
  const cartOverlay = document.getElementById("overlay");
  cartModal.classList.remove("hidden");
  cartOverlay.classList.remove("hidden");
  setTimeout(() => cartModal.classList.add("show"), 10); 
}


function loadProducts() {
  fetch("data.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load products");
      return res.json();
    })
    .then((products) => {
      const container = document.getElementById("product-container");

      products.forEach((product) => {
        if (!product.name || !product.price || !product.image) {
          console.warn("Invalid product data:", product);
          return;
        }

        const card = document.createElement("div");
        card.className = "bg-Rose-50 text-center relative mb-8 rounded-[8px]";
        card.innerHTML = `
          <div class="bg-Rose-50 text-center relative mb-8 rounded-[8px]">
            <picture>
              <source media="(min-width: 1024px)" srcset="${
                product.image.desktop
              }" />
              <source media="(min-width: 768px)" srcset="${
                product.image.tablet
              }" />
              <source media="(min-width: 375px)" srcset="${
                product.image.mobile
              }" />
              <img class="image-border w-[327px] rounded-[8px]" src="${
                product.image.thumbnail
              }" alt="${product.name}" />
            </picture>
            <div class="quantity-container hidden absolute bottom-[-20px] left-20 md:left-6 xl:left-12 w-[160px] h-[44px] rounded-full bg-Red flex items-center justify-around gap-x-4">
              <button class="group decrease cursor-pointer" aria-label="Decrease quantity of ${
                product.name
              }">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="rounded-full transition-colors duration-300 group-hover:bg-White">
                  <path d="M10 2.5C14.125 2.5 17.5 5.875 17.5 10C17.5 14.125 14.125 17.5 10 17.5C5.875 17.5 2.5 14.125 2.5 10C2.5 5.875 5.875 2.5 10 2.5ZM10 1.25C5.1875 1.25 1.25 5.1875 1.25 10C1.25 14.8125 5.1875 18.75 10 18.75C14.8125 18.75 18.75 14.8125 18.75 10C18.75 5.1875 14.8125 1.25 10 1.25Z" class="fill-White group-hover:White transition-colors duration-300"/>
                  <path d="M5 9.375H15V10.625H5V9.375Z" class="fill-White group-hover:fill-Red transition-colors duration-300"/>
                </svg>
              </button>
              <span class="quantity text-4-bold w-6 text-White">0</span>
              <button class="group increase cursor-pointer" aria-label="Increase quantity of ${
                product.name
              }">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="rounded-full transition-colors duration-300 group-hover:bg-White">
                  <path d="M10 2.5C14.125 2.5 17.5 5.875 17.5 10C17.5 14.125 14.125 17.5 10 17.5C5.875 17.5 2.5 14.125 2.5 10C2.5 5.875 5.875 2.5 10 2.5ZM10 1.25C5.1875 1.25 1.25 5.1875 1.25 10C1.25 14.8125 5.1875 18.75 10 18.75C14.8125 18.75 18.75 14.8125 18.75 10C18.75 5.1875 14.8125 1.25 10 1.25Z" class="fill-White group-hover:White transition-colors duration-300"/>
                  <path d="M15 9.375H10.625V5H9.375V9.375H5V10.625H9.375V15H10.625V10.625H15V9.375Z" class="fill-White group-hover:fill-Red transition-colors duration-300"/>
                </svg>
              </button>
            </div>
            <button class="add-to-cart absolute cursor-pointer bottom-[-20px] left-20 md:left-6 xl:left-12 flex justify-center gap-x-2 items-center p-3 w-[160px] h-[44px] rounded-full bg-White text-4-bold border border-Rose-400 text-Rose-900 hover:text-Red transition-all duration-300 ease-in-out" aria-label="Add ${
              product.name
            } to cart">
              <img class="w-5 h-5" src="./src/assets/images/icon-add-to-cart.svg" alt="Add to cart icon"/>
              Add to Cart
            </button>
          </div>
          <div class="flex flex-col space-y-1 text-start">
            <p class="text-4 text-Rose-500">${product.category}</p>
            <h3 class="text-3 text-Rose-900">${product.name}</h3>
            <p class="text-Red text-3">$${product.price.toFixed(2)}</p>
          </div>
        `;

        const decreaseBtn = card.querySelector(".decrease");
        const increaseBtn = card.querySelector(".increase");
        const quantitySpan = card.querySelector(".quantity");
        const addToCartBtn = card.querySelector(".add-to-cart");
        const quantityContainer = card.querySelector(".quantity-container");
        const image = card.querySelector(".image-border");

        increaseBtn.addEventListener("click", () => {
          let existingItem = cart.find((item) => item.name === product.name);
          if (!existingItem) {
            cart.push({ ...product, quantity: 0 });
            existingItem = cart.find((item) => item.name === product.name);
          }
          existingItem.quantity++;
          quantitySpan.textContent = existingItem.quantity;
          image.classList.add("border-2", "border-Red");
          updateCart();
        });

        decreaseBtn.addEventListener("click", () => {
          let existingItem = cart.find((item) => item.name === product.name);
          if (existingItem && existingItem.quantity > 0) {
            existingItem.quantity--;
            if (existingItem.quantity === 0) {
              cart = cart.filter((item) => item.name !== product.name);
              quantityContainer.classList.add("hidden");
              addToCartBtn.classList.remove("hidden");
              image.classList.remove("border-2", "border-Red");
            }
            quantitySpan.textContent = existingItem.quantity;
            updateCart();
          }
        });

        addToCartBtn.addEventListener("click", () => {
          let existingItem = cart.find((item) => item.name === product.name);
          if (!existingItem) {
            cart.push({ ...product, quantity: 1 });
            quantitySpan.textContent = "1";
          } else {
            quantitySpan.textContent = existingItem.quantity;
          }
          addToCartBtn.classList.add("hidden");
          quantityContainer.classList.remove("hidden");
          image.classList.add("border-2", "border-Red");
          updateCart();
        });

        container.appendChild(card);
      });

      
      const confirmButton = document.getElementById("confirm-button");
      const startNewButton = document.getElementById("start-new");
      const cartOverlay = document.getElementById("overlay");

      confirmButton.addEventListener("click", () => {
        if (cart.length === 0) {
          alert("Your cart is empty!");
          return;
        }
        showOrderConfirmedModal();
        cart = [];
        updateCart();
        document
          .querySelectorAll("#product-container > div")
          .forEach((card) => {
            const nameElement = card.querySelector(".text-3.text-Rose-900");
            if (nameElement) updateProductCard(nameElement.textContent);
          });
      });

      startNewButton.addEventListener("click", () => {
        const cartModal = document.getElementById("cart-modal");
        cartModal.classList.remove("show");
        setTimeout(() => {
          cartModal.classList.add("hidden");
          cartOverlay.classList.add("hidden");
        }, 300);
      });

      cartOverlay.addEventListener("click", (e) => {
        if (e.target === cartOverlay) {
          const cartModal = document.getElementById("cart-modal");
          cartModal.classList.remove("show");
          setTimeout(() => {
            cartModal.classList.add("hidden");
            cartOverlay.classList.add("hidden");
          }, 300);
        }
      });
    })
    .catch((err) => {
      console.error("Error loading products:", err);
      alert("Failed to load products. Please try again later.");
    });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupCartEventListeners();
});
