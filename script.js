"use strict";

/* =========================================================
   SELETORES GLOBAIS
========================================================= */
const body = document.body;

// Menu
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

// Dark mode
const themeToggle = document.getElementById("themeToggle");

// Tabs
const navLinks = document.querySelectorAll(".nav-link");
const tabSections = document.querySelectorAll(".tab-section");

// Home → Kits de roupas
const showKitsBtn = document.getElementById("showKits");
const kitsContainer = document.getElementById("kitsContainer");
const kitItems = document.getElementById("kitItems");

const kits = {
    verao: ["Shorts", "Camisa", "Chapéu"],
    inverno: ["Calça", "Blusa", "Jaqueta"],
    fervo: ["Camiseta", "Bermuda", "Tênis"]
};

// Desbloqueio → modelos
const modelsContainer = document.getElementById("modelsContainer");
const brands = {
    iphone: ["iPhone 7", "iPhone 8", "iPhone X"],
    samsung: ["Galaxy S7", "Galaxy S8", "Galaxy S10"],
    xiaomi: ["Mi 8", "Mi 9", "Mi 10"]
};

// Empréstimos
const loanAmount = document.getElementById("loanAmount");
const loanFinal = document.getElementById("loanFinal");
const loanForm = document.getElementById("loanForm");
const loanFeedback = document.getElementById("loanFeedback");

// Contacto
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */
function log(msg) { console.log(`[LOG] ${msg}`); }

/* =========================================================
   MENU MOBILE
========================================================= */
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => mobileMenu.classList.toggle("active"));
    mobileMenu.querySelectorAll(".nav-link").forEach(btn => {
        btn.addEventListener("click", () => mobileMenu.classList.remove("active"));
    });
}

/* =========================================================
   DARK MODE
========================================================= */
function loadTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
        body.classList.add("dark");
        if (themeToggle) themeToggle.textContent = "☀️";
    }
}

function toggleTheme() {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    log(`Tema alterado: ${isDark ? "Dark" : "Light"}`);
}

if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

/* =========================================================
   TABS / ABAS
========================================================= */
function deactivateTabs() {
    navLinks.forEach(btn => btn.classList.remove("active"));
    tabSections.forEach(sec => sec.classList.remove("active"));
}

function activateTab(tabId) {
    deactivateTabs();
    const btn = document.querySelector(`[data-tab="${tabId}"]`);
    const section = document.getElementById(tabId);
    if (btn && section) {
        btn.classList.add("active");
        section.classList.add("active");
        log(`Aba ativa: ${tabId}`);
    }
}

navLinks.forEach(btn => {
    btn.addEventListener("click", () => {
        activateTab(btn.dataset.tab);
    });
});

/* =========================================================
   KITS DE ROUPAS
========================================================= */
if (showKitsBtn && kitsContainer) {
    showKitsBtn.addEventListener("click", () => {
        kitsContainer.classList.toggle("hidden");
    });

    document.querySelectorAll(".kit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const kit = btn.dataset.kit;
            kitItems.innerHTML = kits[kit].map(item => `<p>${item}</p>`).join("");
        });
    });
}

/* =========================================================
   DESBLOQUEIO DE TELEFONE
========================================================= */
document.querySelectorAll("#unlock .brand").forEach(card => {
    card.addEventListener("click", () => {
        const brand = card.dataset.brand;
        const modelList = brands[brand] || [];
        modelsContainer.innerHTML = `
            <h4>${brand.toUpperCase()}</h4>
            <div class="sub-models">
                ${modelList.map(m => `<p>${m}</p>`).join("")}
            </div>
        `;
        log(`Marca selecionada: ${brand}`);
    });
});

/* =========================================================
   EMPRÉSTIMOS
========================================================= */
function updateLoan() {
    const valor = Number(loanAmount.value);
    const finalValue = valor * 2; // juros dobrados
    loanFinal.textContent = finalValue.toFixed(2);
}

if (loanAmount) loanAmount.addEventListener("input", updateLoan);

if (loanForm) {
    loanForm.addEventListener("submit", e => {
        e.preventDefault();
        if (loanFeedback) {
            loanFeedback.textContent = `Simulação concluída: R$ ${loanFinal.textContent}`;
            setTimeout(() => loanFeedback.textContent = "", 3000);
        }
        loanForm.reset();
        updateLoan();
        log("Simulação de empréstimo enviada");
    });
}

/* =========================================================
   FORMULÁRIO DE CONTACTO
========================================================= */
if (contactForm) {
    contactForm.addEventListener("submit", e => {
        e.preventDefault();
        if (formFeedback) {
            formFeedback.textContent = "Mensagem enviada com sucesso!";
            setTimeout(() => formFeedback.textContent = "", 3000);
        }
        contactForm.reset();
        log("Formulário de contacto enviado");
    });
}

/* =========================================================
   ANIMAÇÃO DE ENTRADA SIMPLES
========================================================= */
function animateSections() {
    tabSections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "all 0.4s ease";
    });

    setTimeout(() => {
        tabSections.forEach(section => {
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        });
    }, 200);
}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    animateSections();
    updateLoan();
    log("Sistema inicializado");
});
