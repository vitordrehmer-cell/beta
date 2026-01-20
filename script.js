
document.addEventListener("DOMContentLoaded", () => {
  // ================= TABS =================
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-section").forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.tab;
      const section = document.getElementById(target);
      if (section) section.classList.add("active");
    });
  });

  // ================= DARK MODE =================
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "🌞" : "🌙";
    });
  }

  // ================= KITS =================
  const kitsOverview = document.querySelectorAll(".kit-card");
  const kitDetail = document.getElementById("kitDetail");
  const kitTitle = document.getElementById("kitTitle");
  const kitItems = document.getElementById("kitItems");
  const backToKits = document.getElementById("backToKits");

  const kitsContent = {
    verao: ["shorts", "camisa", "chapeu", "oculos"],
    inverno: ["calca", "blusa", "jaqueta"],
    fervo: ["camiseta", "bermuda", "kenner"]
  };

  kitsOverview.forEach(card => {
    card.addEventListener("click", () => {
      const kit = card.dataset.kit;
      if (!kitsContent[kit]) return;

      kitTitle.textContent = "Itens do Kit " + kit.charAt(0).toUpperCase() + kit.slice(1);
      kitItems.innerHTML = kitsContent[kit].map(item => `
        <div class="kit-item">
          <img src="roupa/${item}.png" alt="${item}">
          <p>${item.charAt(0).toUpperCase() + item.slice(1)}</p>
          <button class="btn primary add-cart" data-name="${item}" data-type="clothing">Adicionar ao carrinho</button>
        </div>
      `).join("");

      kitDetail.classList.remove("hidden");
      document.querySelector(".kits-overview").classList.add("hidden");

      hookAddButtons();
    });
  });

  if (backToKits) {
    backToKits.addEventListener("click", () => {
      kitDetail.classList.add("hidden");
      document.querySelector(".kits-overview").classList.remove("hidden");
    });
  }

  // ================= DESBLOQUEIO =================
  const brands = {
    iphone: ["iphone7", "iphone8"],
    samsung: ["samsunga10", "samsunga20", "samsunga30"],
    xiaomi: ["mix2", "redminote7", "redminote8"]
  };

  const modelsContainer = document.getElementById("modelsContainer");

  document.querySelectorAll("#unlock .brand").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("#unlock .brand").forEach(b => b.classList.remove("active"));
      card.classList.add("active");

      const brand = card.dataset.brand;
      const modelList = brands[brand] || [];

      if (!modelsContainer) return;

      modelsContainer.innerHTML = modelList.map(model => `
        <div class="model-item">
          <img src="celulares/${model}.png">
          <p>${model}</p>
          <button class="btn primary add-cart" data-name="Desbloqueio ${brand} ${model}" data-type="unlock">Adicionar ao carrinho</button>
        </div>
      `).join("");

      hookAddButtons();
    });
  });

  // ================= CARRINHO =================
  let cart = JSON.parse(localStorage.getItem("cart_drehmer") || "[]");

  const cartToggle = document.getElementById("cartToggle");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartCountEl = document.getElementById("cartCount");
  const buyCartBtn = document.getElementById("buyCartBtn");

  function saveCart() {
    localStorage.setItem("cart_drehmer", JSON.stringify(cart));
  }

  function updateHeaderCount() {
    if (cartCountEl) cartCountEl.textContent = String(cart.length);
  }

  function renderCart() {
    if (!cartItemsEl) return;
    if (cart.length === 0) {
      cartItemsEl.innerHTML = "<p>Carrinho vazio</p>";
      if (cartTotalEl) cartTotalEl.textContent = "0";
      updateHeaderCount();
      return;
    }

    cartItemsEl.innerHTML = cart.map((item, i) => `
      <div class="cart-item" style="display:flex;justify-content:space-between;gap:8px;">
        <div>
          <strong>${item.name}</strong>
          ${item.size ? `<div>Tamanho: ${item.size}</div>` : ``}
          ${item.color ? `<div>Cor: ${item.color}</div>` : ``}
        </div>
        <button data-i="${i}" class="btn" style="background:#e63946;color:#fff;">X</button>
      </div>
    `).join("");

    cartItemsEl.querySelectorAll("button[data-i]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.i);
        cart.splice(i, 1);
        saveCart();
        renderCart();
      });
    });

    if (cartTotalEl) cartTotalEl.textContent = "0";
    updateHeaderCount();
  }

  if (cartToggle && cartSidebar) {
    cartToggle.addEventListener("click", () => {
      cartSidebar.classList.toggle("hidden");
      renderCart();
    });
  }

  if (buyCartBtn) {
    buyCartBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Carrinho vazio!");
        return;
      }
      const phone = "554599299360";
      let msg = "Olá! Gostaria de comprar os seguintes itens:%0A";
      cart.forEach(item => {
        let line = "- " + item.name;
        if (item.size) line += " | Tam: " + item.size;
        if (item.color) line += " | Cor: " + item.color;
        msg += line + "%0A";
      });
      window.open("https://wa.me/" + phone + "?text=" + msg, "_blank");
    });
  }

  // ================= MODAL TAMANHO/COR =================
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.background = "rgba(0,0,0,0.5)";
  modal.style.display = "none";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "3000";

  modal.innerHTML = `
    <div style="background:#fff;padding:16px;border-radius:12px;min-width:260px;max-width:90%;">
      <h3 id="modalTitle">Escolha opções</h3>

      <div style="text-align:center;margin-bottom:10px;">
        <img id="modalPreviewImg" src="" style="max-width:140px;max-height:140px;object-fit:contain;border-radius:8px;">
      </div>

      <div id="sizeBlock" style="margin:10px 0;">
        <div><strong>Tamanho</strong></div>
        <div id="sizeBtns" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;"></div>
      </div>

      <div style="margin:10px 0;">
        <div><strong>Cor</strong></div>
        <div id="colorBtns" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;"></div>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;">
        <button id="cancelModal" class="btn">Cancelar</button>
        <button id="confirmModal" class="btn primary">Adicionar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  let pendingItem = null;
  let selectedSize = null;
  let selectedColor = null;

  function openModal(itemName) {
    pendingItem = itemName;
    selectedSize = null;
    selectedColor = null;
    modal.style.display = "flex";

    const previewImg = modal.querySelector("#modalPreviewImg");
    const sizeBlock = modal.querySelector("#sizeBlock");
    const sizeBtns = modal.querySelector("#sizeBtns");
    const colorBtns = modal.querySelector("#colorBtns");

    sizeBtns.innerHTML = "";
    colorBtns.innerHTML = "";

    const rules = {
      shorts: { sizes: ["M","G","GG"], colors: ["preto","branco"] },
      camisa: { sizes: ["M","G","GG"], colors: ["preto","branco"] },
      kenner: { sizes: ["37/38","39/40","41/42"], colors: ["preto","branco"] },
      chapeu: { sizes: [], colors: ["preto","branco"] },
      oculos: { sizes: [], colors: ["dourada","chumbo","cromada","preto"] }
    };

    const cfg = rules[itemName] || { sizes: ["M","G","GG"], colors: ["preto"] };

    if (cfg.sizes.length === 0) {
      sizeBlock.style.display = "none";
    } else {
      sizeBlock.style.display = "block";
      cfg.sizes.forEach(s => {
        const b = document.createElement("button");
        b.className = "btn size";
        b.textContent = s;
        b.onclick = () => {
          selectedSize = s;
          sizeBtns.querySelectorAll("button").forEach(x => x.classList.remove("primary"));
          b.classList.add("primary");
        };
        sizeBtns.appendChild(b);
      });
    }

    cfg.colors.forEach(c => {
      const b = document.createElement("button");
      b.className = "btn color";
      b.textContent = c;
      b.onclick = () => {
        selectedColor = c;
        colorBtns.querySelectorAll("button").forEach(x => x.classList.remove("primary"));
        b.classList.add("primary");

        const test = new Image();
        test.onload = () => previewImg.src = `roupa/${itemName}-${c}.png`;
        test.onerror = () => previewImg.src = `roupa/${itemName}.png`;
        test.src = `roupa/${itemName}-${c}.png`;
      };
      colorBtns.appendChild(b);
    });

    const firstColor = cfg.colors[0];
    const test = new Image();
    test.onload = () => previewImg.src = `roupa/${itemName}-${firstColor}.png`;
    test.onerror = () => previewImg.src = `roupa/${itemName}.png`;
    test.src = `roupa/${itemName}-${firstColor}.png`;
  }

  function closeModal() {
    modal.style.display = "none";
    pendingItem = null;
  }

  modal.querySelector("#cancelModal").onclick = closeModal;
  modal.querySelector("#confirmModal").onclick = () => {
    if (!pendingItem) return;

    const rulesNoSize = ["oculos", "chapeu"];
    if (!selectedColor) {
      alert("Escolha a cor.");
      return;
    }
    if (!rulesNoSize.includes(pendingItem) && !selectedSize) {
      alert("Escolha o tamanho.");
      return;
    }

    cart.push({ name: pendingItem, size: selectedSize || null, color: selectedColor });
    saveCart();
    updateHeaderCount();
    closeModal();
    alert("Adicionado ao carrinho!");
  };

  function hookAddButtons() {
    document.querySelectorAll(".add-cart").forEach(btn => {
      btn.onclick = () => {
        const name = btn.dataset.name;
        const type = btn.dataset.type || "clothing";
        if (type === "clothing") {
          openModal(name);
        } else {
          cart.push({ name: name });
          saveCart();
          updateHeaderCount();
          alert("Adicionado ao carrinho!");
        }
      };
    });
  }

  // init
  updateHeaderCount();
  renderCart();
});
