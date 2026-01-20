
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
    verao: ["shorts", "camisa", "chapeu"],
    inverno: ["calca", "blusa", "jaqueta"],
    fervo: ["camiseta", "bermuda", "tenis"]
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

    if (cartTotalEl) cartTotalEl.textContent = "0"; // sem preços por enquanto
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

      <div style="margin:10px 0;">
        <div><strong>Tamanho</strong></div>
        <div id="sizeBtns" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">
          <button class="btn size" data-size="M">M</button>
          <button class="btn size" data-size="G">G</button>
          <button class="btn size" data-size="GG">GG</button>
        </div>
      </div>
      <div style="margin:10px 0;">
        <div><strong>Cor</strong></div>
        <div id="colorBtns" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">
          <button class="btn color" data-color="Preto">Preto</button>
          <button class="btn color" data-color="Branco">Branco</button>
        </div>
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

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function openModal(itemName) {
    pendingItem = itemName;
    selectedSize = null;
    selectedColor = null;
    modal.style.display = "flex";

    const previewImg = modal.querySelector("#modalPreviewImg");
    if (previewImg) {
      // imagem padrão: preto
      previewImg.src = "roupa/" + itemName + "-preto.png";
    }

    modal.querySelectorAll("button.size").forEach(b => {
      b.classList.remove("primary");
      b.onclick = () => {
        selectedSize = b.dataset.size;
        modal.querySelectorAll("button.size").forEach(x => x.classList.remove("primary"));
        b.classList.add("primary");
      };
    });

    modal.querySelectorAll("button.color").forEach(b => {
      b.classList.remove("primary");
      b.onclick = () => {
        selectedColor = b.dataset.color;
        modal.querySelectorAll("button.color").forEach(x => x.classList.remove("primary"));
        b.classList.add("primary");

        // troca a imagem conforme a cor
        if (previewImg) {
          const cor = selectedColor.toLowerCase(); // preto / branco
          previewImg.src = "roupa/" + itemName + "-" + cor + ".png";
        }
      };
    });
  }

  function closeModal() {
    modal.style.display = "none";
    pendingItem = null;
  }

  modal.querySelector("#cancelModal").onclick = closeModal;
  modal.querySelector("#confirmModal").onclick = () => {
    if (!pendingItem) return;
    // exige tamanho/cor apenas para roupas
    if (!selectedSize || !selectedColor) {
      alert("Escolha tamanho e cor.");
      return;
    }
    cart.push({ name: pendingItem, size: selectedSize, color: selectedColor });
    saveCart();
    updateHeaderCount();
    closeModal();
    alert("Adicionado ao carrinho!");
  };

  // ================= HOOK BOTÕES =================
  function hookAddButtons() {
    document.querySelectorAll(".add-cart").forEach(btn => {
      btn.onclick = () => {
        const name = btn.dataset.name;
        const type = btn.dataset.type || "clothing";
        if (type === "clothing") {
          openModal(name);
        } else {
          // desbloqueio vai direto, sem tamanho/cor
          cart.push({ name: name });
          saveCart();
          updateHeaderCount();
          alert("Adicionado ao carrinho!");
        }
      };
    });
  }

  // ================= EMPRÉSTIMO =================
  const loanInput = document.getElementById("loanInput");
  const loanValue = document.getElementById("loanValue");
  const loanTotal = document.getElementById("loanTotal");
  const loanWhatsapp = document.getElementById("loanWhatsapp");

  if (loanInput && loanValue && loanTotal && loanWhatsapp) {
    loanInput.addEventListener("input", () => {
      const v = Number(loanInput.value) || 0;
      loanValue.textContent = v;
      loanTotal.textContent = v * 2;
    });

    loanWhatsapp.addEventListener("click", () => {
      const v = Number(loanInput.value);
      if (!v) return alert("Digite um valor");
      const phone = "554599299360";
      const msg = "Olá! Gostaria de solicitar um empréstimo no valor de R$ " + v + ". Total a devolver: R$ " + (v*2) + ".";
      window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(msg), "_blank");
    });
  }

  // ================= CONTATO =================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      alert("Mensagem enviada!");
      contactForm.reset();
    });
  }

  // init
  updateHeaderCount();
  renderCart();
});


// ===== FIX: FECHAR CARRINHO =====
document.addEventListener("DOMContentLoaded", function(){
  const panel = document.getElementById("cartPanel") || document.getElementById("cartSidebar");
  const btn = document.getElementById("closeCartBtn");
  if(btn && panel){
    btn.addEventListener("click", ()=> panel.classList.add("hidden"));
  }
});

// ===== FIX: EMPRÉSTIMO (DOBRO) =====
document.addEventListener("DOMContentLoaded", function(){
  const input = document.getElementById("loanInput") || document.getElementById("loanRange");
  const val = document.getElementById("loanValue");
  const total = document.getElementById("loanTotal");
  if(input && val && total){
    const update = ()=>{
      const v = Number(input.value)||0;
      val.textContent = v;
      total.textContent = v*2;
    };
    input.addEventListener("input", update);
    update();
  }
});
