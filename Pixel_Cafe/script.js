
let menu = [
    { name: "Widow Burger", price: 189, type: "food", emoji: "🍔", desc: "A big burger with a little attitude." },
    { name: "Deadly Pizza", price: 249, type: "food", emoji: "🍕", desc: "Cheese, sauce and a crispy base." },
    { name: "Cursed Fries", price: 89, type: "food", emoji: "🍟", desc: "Fries with spicy seasoning." },
    { name: "Ghost Sandwich", price: 129, type: "food", emoji: "🥪", desc: "A simple sandwich from the shadows." },
    { name: "Monster Hotdog", price: 149, type: "food", emoji: "🌭", desc: "Loaded with sauce and onions." },
    { name: "Midnight Noodles", price: 139, type: "food", emoji: "🍜", desc: "Hot noodles for late nights." },
    { name: "Skull Tacos", price: 169, type: "food", emoji: "🌮", desc: "Crunchy and full of flavour." },
    { name: "Zombie Nuggets", price: 119, type: "food", emoji: "🍗", desc: "Crispy chicken bites." },

    { name: "Witch Espresso", price: 99, type: "drinks", emoji: "☕", desc: "Small cup. Big energy." },
    { name: "Blood Moon Shake", price: 149, type: "drinks", emoji: "🥤", desc: "Strawberry and vanilla shake." },
    { name: "Blue Ghost Soda", price: 79, type: "drinks", emoji: "🧋", desc: "A strange blue fizzy drink." },
    { name: "Green Monster", price: 119, type: "drinks", emoji: "🍵", desc: "Minty cold drink." },
    { name: "Black Magic Coffee", price: 129, type: "drinks", emoji: "🧋", desc: "Cold coffee with chocolate." },
    { name: "Pumpkin Latte", price: 139, type: "drinks", emoji: "🎃", desc: "Sweet pumpkin coffee." },

    { name: "Bloody Donut", price: 89, type: "sweet", emoji: "🍩", desc: "A donut with red icing." },
    { name: "Spider Cake", price: 159, type: "sweet", emoji: "🍰", desc: "Chocolate cake with cream." },
    { name: "Skull Cookies", price: 69, type: "sweet", emoji: "🍪", desc: "Crunchy little cookies." },
    { name: "Ghost Pancakes", price: 139, type: "sweet", emoji: "🥞", desc: "Fluffy pancakes with syrup." },
    { name: "Witch Cupcake", price: 99, type: "sweet", emoji: "🧁", desc: "Chocolate cupcake with frosting." },
    { name: "Monster Ice Cream", price: 109, type: "sweet", emoji: "🍦", desc: "Cold, creamy and colourful." }
];

let cart = [];

function showMenu(items) {
    let grid = document.getElementById("menu-grid");
    grid.innerHTML = "";

    items.forEach(function(item) {
        let realIndex = menu.indexOf(item);

        grid.innerHTML += `
            <div class="food-card">
                <div class="food-picture">${item.emoji}</div>
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="food-bottom">
                    <span class="food-price">₹${item.price}</span>
                    <button class="add-button" onclick="addToCart(${realIndex})">+ ADD</button>
                </div>
            </div>
        `;
    });
}

function filterMenu(type, button) {
    document.querySelectorAll(".category").forEach(function(btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    if (type === "all") {
        showMenu(menu);
    } else {
        let filtered = menu.filter(function(item) {
            return item.type === type;
        });

        showMenu(filtered);
    }
}

function addToCart(index) {
    let item = menu[index];
    let found = cart.find(function(food) {
        return food.name === item.name;
    });

    if (found) {
        found.qty++;
    } else {
        cart.push({
            name: item.name,
            price: item.price,
            qty: 1
        });
    }

    updateCart();
}

function changeQty(index, amount) {
    cart[index].qty += amount;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}

function updateCart() {
    let cartBox = document.getElementById("cart-items");
    let subtotal = 0;

    if (cart.length === 0) {
        cartBox.innerHTML = '<p class="empty-cart">Nothing here yet. Go eat something.</p>';
    } else {
        cartBox.innerHTML = "";

        cart.forEach(function(item, index) {
            subtotal += item.price * item.qty;

            cartBox.innerHTML += `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        ₹${item.price} × ${item.qty}
                    </div>
                    <div>
                        <button onclick="changeQty(${index}, -1)">−</button>
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </div>
            `;
        });
    }

    let tax = Math.round(subtotal * 0.08);
    let total = subtotal + tax;

    document.getElementById("subtotal-price").innerText = "₹" + subtotal;
    document.getElementById("tax-price").innerText = "₹" + tax;
    document.getElementById("total-price").innerText = "₹" + total;
}

document.getElementById("order-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("customer-name").value.trim();
    let email = document.getElementById("customer-email").value.trim();
    let location = document.getElementById("table-select").value;
    let error = document.getElementById("form-error");

    if (cart.length === 0) {
        error.innerText = "Your cart is empty. Add something first!";
        return;
    }

    if (!name || !email) {
        error.innerText = "Please fill in your details.";
        return;
    }

    error.innerText = "";

    let subtotal = 0;
    let itemList = "";

    cart.forEach(function(item) {
        subtotal += item.price * item.qty;
        itemList += `<p>${item.name} × ${item.qty}</p>`;
    });

    let total = subtotal + Math.round(subtotal * 0.08);
    let orderNumber = Math.floor(Math.random() * 9000) + 1000;

    document.getElementById("modal-order-id").innerText = "Order #" + orderNumber;
    document.getElementById("modal-name").innerText = "For: " + name;
    document.getElementById("modal-location").innerText = "Location: " + location;
    document.getElementById("modal-items-list").innerHTML = itemList;
    document.getElementById("modal-total").innerText = "Total: ₹" + total;

    document.getElementById("confirmation-modal").style.display = "flex";

    cart = [];
    updateCart();
    document.getElementById("order-form").reset();
});

function closeModal() {
    document.getElementById("confirmation-modal").style.display = "none";
}

showMenu(menu);
updateCart();

