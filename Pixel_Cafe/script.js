

const menu = [
  {
    id: "burger",
    name: "Classic Burger",
    price: 8.00,
    image: "images/burger.webp",
    tag: "Food",
    desc: "Juicy burger with cheese."
  },
  {
    id: "croissant",
    name: "Butter Croissant",
    price: 3.50,
    image: "images/croissant.jpg",
    tag: "Bakery",
    desc: "Fresh and buttery croissant."
  },
  {
    id: "espresso",
    name: "Espresso",
    price: 3.00,
    image: "images/espresso.webp",
    tag: "Coffee",
    desc: "Strong and freshly brewed."
  },
  {
    id: "greentea",
    name: "Green Tea",
    price: 3.00,
    image: "images/greentea.webp",
    tag: "Drinks",
    desc: "Light and refreshing green tea."
  },
  {
    id: "water",
    name: "Sparkling Water",
    price: 2.00,
    image: "images/sparkingwater.webp",
    tag: "Drinks",
    desc: "Chilled sparkling water."
  },
  {
    id: "chocdonut",
    name: "Chocolate Donut",
    price: 2.50,
    image: "images/chocodonut.jpg",
    tag: "Donuts",
    desc: "Donut topped with chocolate."
  },
  {
    id: "strawberrydonut",
    name: "Strawberry Donut",
    price: 2.50,
    image: "images/strawdonut.jpg",
    tag: "Donuts",
    desc: "Sweet strawberry glazed donut."
  },
  {
    id: "pancakes",
    name: "PanCakes",
    price: 2.00,
    image: "images/pancakes.webp",
    tag: "Donuts",
    desc: "Classic donut with sweet glaze."
  }
];


const saveKey = "pixl_cafe_orders";

let orderLocation = "Counter Pickup";
let cart = {};
let orders = [];

// Load saved orders

try {
  const savedOrders = JSON.parse(localStorage.getItem(saveKey) || "[]");

  if (Array.isArray(savedOrders)) {
    orders = savedOrders;
  }
} catch (error) {
  orders = [];
}

// Get HTML elements

const btnCustomer = document.getElementById("btn-customer-view");
const btnKitchen = document.getElementById("btn-kitchen-view");
const kitchenBadge = document.getElementById("kitchen-badge");

const customerPage = document.getElementById("customer-view");
const kitchenPage = document.getElementById("kitchen-view");

const counterBtn = document.getElementById("loc-counter");
const tableSelect = document.getElementById("table-select");

const locationText = document.getElementById("selected-location-display");
const ticketLocation = document.getElementById("ticket-location");

const menuGrid = document.getElementById("menu-grid");
const cartItems = document.getElementById("cart-items");

const subtotalText = document.getElementById("subtotal-price");
const taxText = document.getElementById("tax-price");
const totalText = document.getElementById("total-price");

const clearCartBtn = document.getElementById("clear-cart-btn");

const orderForm = document.getElementById("order-form");
const nameInput = document.getElementById("customer-name");
const emailInput = document.getElementById("customer-email");
const autofillBtn = document.getElementById("autofill-btn");
const errorMsg = document.getElementById("form-error");

const kitchenTickets = document.getElementById("kitchen-tickets");
const clearReadyBtn = document.getElementById("clear-completed-btn");

const orderPopup = document.getElementById("confirmation-modal");
const popupId = document.getElementById("modal-order-id");
const popupName = document.getElementById("modal-name");
const popupLocation = document.getElementById("modal-location");
const popupItems = document.getElementById("modal-items-list");
const popupTotal = document.getElementById("modal-total");

const popupKitchenBtn = document.getElementById("modal-kitchen-btn");
const popupNewBtn = document.getElementById("modal-new-order-btn");




function saveOrders() {
  localStorage.setItem(saveKey, JSON.stringify(orders));
}




function safeText(text) {
  return String(text).replace(/[&<>"']/g, function (char) {
    const chars = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return chars[char];
  });
}




function setLocation(newLocation, isCounter) {
  orderLocation = newLocation;

  locationText.textContent = orderLocation;
  ticketLocation.textContent = orderLocation;

  counterBtn.classList.toggle("active", isCounter);
  tableSelect.classList.toggle("active", !isCounter);
}



function changeView(view) {
  const isKitchen = view === "kitchen";

  btnCustomer.classList.toggle("active", !isKitchen);
  btnKitchen.classList.toggle("active", isKitchen);

  customerPage.classList.toggle("hidden", isKitchen);
  kitchenPage.classList.toggle("hidden", !isKitchen);

  if (isKitchen) {
    showKitchen();
  }
}




function showMenu() {
  menuGrid.innerHTML = menu.map(function (item) {
    const qty = cart[item.id] || 0;

    return `
      <div class="menu-item">

        <div class="item-top">
          <span class="item-tag">${safeText(item.tag)}</span>
          <img class="item-img"
               src="${item.image}"
               alt="${safeText(item.name)}">
        </div>

        <h3 class="item-name">${safeText(item.name)}</h3>
        <p class="item-desc">${safeText(item.desc)}</p>

        <div class="item-footer">

          <span class="item-price">$${item.price.toFixed(2)}</span>

          <div class="qty-controls">

            <button class="qty-btn"
                    type="button"
                    onclick="changeQty('${item.id}', -1)">-</button>

            <span>${qty}</span>

            <button class="qty-btn plus"
                    type="button"
                    onclick="changeQty('${item.id}', 1)">+</button>

          </div>
        </div>

      </div>
    `;
  }).join("");
}




window.changeQty = function (id, amount) {
  const qty = (cart[id] || 0) + amount;

  if (qty <= 0) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }

  errorMsg.textContent = "";

  showMenu();
  showCart();
};




function showCart() {
  let subtotal = 0;
  let rows = [];

  menu.forEach(function (item) {
    const qty = cart[item.id] || 0;

    if (qty > 0) {
      const price = item.price * qty;

      subtotal += price;

      rows.push(`
        <div class="cart-row">
          <span>${qty}x ${safeText(item.name)}</span>
          <strong>$${price.toFixed(2)}</strong>
        </div>
      `);
    }
  });

  if (rows.length > 0) {
    cartItems.innerHTML = rows.join("");
  } else {
    cartItems.innerHTML = '<p class="empty-msg">Your order is empty.</p>';
  }

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  subtotalText.textContent = "$" + subtotal.toFixed(2);
  taxText.textContent = "$" + tax.toFixed(2);
  totalText.textContent = "$" + total.toFixed(2);
}



function showKitchen() {
  const waiting = orders.filter(function (order) {
    return order.status !== "Ready";
  }).length;

  kitchenBadge.textContent = waiting;

  if (orders.length === 0) {
    kitchenTickets.innerHTML = `
      <div class="card">
        <p class="empty-msg">No orders yet.</p>
      </div>
    `;
    return;
  }

  kitchenTickets.innerHTML = orders.map(function (order) {
    const ready = order.status === "Ready";

    return `
      <div class="kds-ticket ${ready ? "ready" : ""}">

        <div class="kds-top">
          <strong>${safeText(order.id)}</strong>

          <span class="kds-status">
            ${ready ? "READY" : "BEING MADE"}
          </span>
        </div>

        <p class="kds-meta">
          <strong>${safeText(order.location)}</strong>
          • ${safeText(order.customerName)}
        </p>

        <ul class="kds-items">
          ${order.items.map(function (item) {
            return `
              <li>${item.qty}x ${safeText(item.name)}</li>
            `;
          }).join("")}
        </ul>

        <button class="ready-btn ${ready ? "completed" : ""}"
                type="button"
                onclick="markReady('${order.id}')">
          ${ready ? "Not Ready" : "Mark Ready"}
        </button>

      </div>
    `;
  }).join("");
}




window.markReady = function (id) {
  orders = orders.map(function (order) {
    if (order.id === id) {
      return {
        ...order,
        status: order.status === "Ready" ? "Preparing" : "Ready"
      };
    }

    return order;
  });

  saveOrders();
  showKitchen();
};




btnCustomer.addEventListener("click", function () {
  changeView("customer");
});

btnKitchen.addEventListener("click", function () {
  changeView("kitchen");
});



counterBtn.addEventListener("click", function () {
  tableSelect.value = "";
  setLocation("Counter Pickup", true);
});



tableSelect.addEventListener("change", function () {
  if (tableSelect.value) {
    setLocation(tableSelect.value, false);
  } else {
    setLocation("Counter Pickup", true);
  }
});



clearCartBtn.addEventListener("click", function () {
  cart = {};
  errorMsg.textContent = "";

  showMenu();
  showCart();
});




autofillBtn.addEventListener("click", function () {
  nameInput.value = "Player One";
  emailInput.value = "player1@pixlcafe.dev";

  errorMsg.textContent = "";

  if (Object.keys(cart).length === 0) {
    cart.espresso = 2;
    cart.croissant = 1;
  }

  showMenu();
  showCart();
});



orderForm.addEventListener("submit", function (event) {
  event.preventDefault();

  errorMsg.textContent = "";

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  const chosen = menu.filter(function (item) {
    return cart[item.id] > 0;
  }).map(function (item) {
    const qty = cart[item.id];

    return {
      name: item.name,
      qty: qty,
      lineTotal: item.price * qty
    };
  });

  if (chosen.length === 0) {
    errorMsg.textContent = "Add something to your order first.";
    return;
  }

  if (!name || !email) {
    errorMsg.textContent = "Please fill in your details.";
    return;
  }

  const subtotal = chosen.reduce(function (sum, item) {
    return sum + item.lineTotal;
  }, 0);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const id = "#PX-" + Date.now().toString().slice(-6);

  const itemsText = chosen.map(function (item) {
    return `${item.qty}x ${item.name} - $${item.lineTotal.toFixed(2)}`;
  }).join("\n");

  const newOrder = {
    id: id,
    customerName: name,
    customerEmail: email,
    location: orderLocation,
    items: chosen,
    subtotal: subtotal,
    tax: tax,
    total: total,
    status: "Preparing"
  };

  orders.unshift(newOrder);

  saveOrders();
  showKitchen();



  popupId.textContent = id;
  popupName.textContent = name;
  popupLocation.textContent = orderLocation;
  popupItems.textContent = itemsText;
  popupTotal.textContent = "$" + total.toFixed(2);

  orderPopup.classList.remove("hidden");



  cart = {};

  showMenu();
  showCart();
});




clearReadyBtn.addEventListener("click", function () {
  orders = orders.filter(function (order) {
    return order.status !== "Ready";
  });

  saveOrders();
  showKitchen();
});




popupKitchenBtn.addEventListener("click", function () {
  orderPopup.classList.add("hidden");
  changeView("kitchen");
});




popupNewBtn.addEventListener("click", function () {
  orderPopup.classList.add("hidden");
});




showMenu();
showCart();
showKitchen();
