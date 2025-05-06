
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        function saveToStorage() {
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }

        function addToCart(productName, price, image) {
            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name: productName, price: price, image: image, quantity: 1 });
            }
            updateCart();
            saveToStorage();
        }

        function addToWishlist(productName, price) {
            if (!wishlist.find(item => item.name === productName)) {
                wishlist.push({ name: productName, price: price });
                updateWishlist();
                saveToStorage();
            }
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCart();
            saveToStorage();
        }

        function removeFromWishlist(index) {
            wishlist.splice(index, 1);
            updateWishlist();
            saveToStorage();
        }

        function updateCartQuantity(index, newQuantity) {
            if (newQuantity < 1) {
                removeFromCart(index);
            } else {
                cart[index].quantity = newQuantity;
                updateCart();
                saveToStorage();
            }
        }

        function updateCart() {
            const cartCount = document.getElementById('cart-count');
            const cartItems = document.getElementById('cart-items');
            const cartTotal = document.getElementById('cart-total');

            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartItems.innerHTML = '';
            let total = 0;

            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <span>${item.name}</span>
                        <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="updateCartQuantity(${index}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity(${index}, ${item.quantity + 1})">+</button>
                        <button onclick="removeFromCart(${index})">Remover</button>
                    </div>
                `;
                cartItems.appendChild(itemElement);
            });

            cartTotal.textContent = total.toFixed(2);
        }

        function updateWishlist() {
            const wishlistCount = document.getElementById('wishlist-count');
            const wishlistItems = document.getElementById('wishlist-items');

            wishlistCount.textContent = wishlist.length;
            wishlistItems.innerHTML = '';

            wishlist.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item-details">
                        <span>${item.name}</span>
                        <p>R$ ${item.price.toFixed(2)}</p>
                    </div>
                    <button onclick="removeFromWishlist(${index})">Remover</button>
                `;
                wishlistItems.appendChild(itemElement);
            });
        }

        function openCart() {
            document.getElementById('cart-modal').style.display = 'flex';
        }

        function closeCart() {
            document.getElementById('cart-modal').style.display = 'none';
        }

        function openWishlist() {
            document.getElementById('wishlist-modal').style.display = 'flex';
        }

        function closeWishlist() {
            document.getElementById('wishlist-modal').style.display = 'none';
        }

        function checkout() {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            alert('Compra finalizada! Total: R$ ' + document.getElementById('cart-total').textContent);
            cart = [];
            updateCart();
            closeCart();
            saveToStorage();
        }

        function scrollToProducts() {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }

        function searchProducts() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                product.style.display = productName.includes(searchTerm) ? 'block' : 'none';
            });
        }

        function filterProducts() {
            const category = document.getElementById('category-filter').value;
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                const productCategory = product.dataset.category;
                product.style.display = (category === 'all' || productCategory === category) ? 'block' : 'none';
            });
        }

        function sortProducts() {
            const sortValue = document.getElementById('sort-filter').value;
            const productsContainer = document.getElementById('products');
            const products = Array.from(document.querySelectorAll('.product-card'));

            products.sort((a, b) => {
                if (sortValue === 'price-asc') {
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                } else if (sortValue === 'price-desc') {
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                } else if (sortValue === 'name') {
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                }
                return 0;
            });

            productsContainer.innerHTML = '';
            products.forEach(product => productsContainer.appendChild(product));
        }

        window.onclick = function(event) {
            const cartModal = document.getElementById('cart-modal');
            const wishlistModal = document.getElementById('wishlist-modal');
            if (event.target === cartModal) {
                closeCart();
            }
            if (event.target === wishlistModal) {
                closeWishlist();
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            updateCart();
            updateWishlist();
        });
    