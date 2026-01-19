const WHATS_NUMBER = "5545999299360";

/* ======================
   CARRINHO
====================== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function addToCart(name, price, size, color) {
  cart.push({ name, price, size, color });
  saveCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function updateCartUI() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price;
    container.innerHTML += `
      <div class="cart-item">
        <p>
          <strong>${item.name}</strong><br>
          Tamanho: ${item.size} | Cor: ${item.color}<br>
          R$ ${item.price}
        </p>
        <button onclick="removeFromCart(${i})">❌</button>
      </div>
    `;
  });

  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.innerText = "R$ " + total;
}

function openCart() {
  document.getElementById("cart")?.classList.toggle("open");
}

/* ======================
   WHATSAPP
====================== */
function buyWhats() {
  if (cart.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  let msg = "Oi! Tenho interesse em:\n\n";
  cart.forEach(item => {
    msg += `• ${item.name} - ${item.size} - ${item.color} (R$ ${item.price})\n`;
  });

  window.open(
    `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

/* ======================
   MODAL TAMANHO / COR
====================== */
let selectedProduct = {};

function openOptions(btn) {
  selectedProduct = {
    name: btn.dataset.name,
    price: Number(btn.dataset.price),
    size: null,
    color: null
  };
  document.getElementById("options-modal")?.classList.add("open");
}

function selectOption(type, value) {
  selectedProduct[type] = value;
}

function confirmAdd() {
  if (!selectedProduct.size || !selectedProduct.color) {
    alert("Escolha tamanho e cor");
    return;
  }

  addToCart(
    selectedProduct.name,
    selectedProduct.price,
    selectedProduct.size,
    selectedProduct.color
  );

  document.getElementById("options-modal")?.classList.remove("open");
}

/* ======================
   EMPRÉSTIMO
====================== */
function updateLoan() {
  const value = Number(document.getElementById("loan-value")?.value);
  const out = document.getElementById("loan-double");
  if (out) out.innerText = value ? `Você devolve R$ ${value * 2}` : "";
}

function loanWhats() {
  const value = document.getElementById("loan-value")?.value;
  if (!value) return alert("Digite um valor");

  window.open(
    `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(
      `Oi, queria pegar R$ ${value} emprestado.`
    )}`,
    "_blank"
  );
}

updateCartUI();
