const PRODUCTS = [
  {"id":"p1","name":"Goku Power Graphic Tee","price":199,"category":"Anime","image":"assets/goku.jpg","sizes":["M","L","XL"],"badge":"NEW"},
  {"id":"p2","name":"VIKAS Street Tee","price":199,"category":"Streetwear","image":"assets/vibes-blue.jpg","sizes":["M","L","XL"],"badge":"BESTSELLER"},
  {"id":"p3","name":"Naruto x Itachi Graphic Tee","price":199,"category":"Anime","image":"assets/naruto-itachi.jpg","sizes":["M","L","XL"],"badge":"NEW"},
  {"id":"p4","name":"Fire Fighter Graphic Tee","price":199,"category":"Graphic","image":"assets/fire-fighter.jpg","sizes":["M","L","XL"],"badge":"TRENDING"},
  {"id":"p5","name":"Itachi Cream Oversized Tee","price":199,"category":"Anime","image":"assets/itachi-cream.jpg","sizes":["M","L","XL"],"badge":""},
  {"id":"p6","name":"VIKAS Red Street Tee","price":199,"category":"Streetwear","image":"assets/vibes-red.jpg","sizes":["M","L","XL"],"badge":"HOT"},
  {"id":"p7","name":"Itachi Akatsuki Tee","price":199,"category":"Anime","image":"assets/itachi-green.jpg","sizes":["M","L","XL"],"badge":""},
  {"id":"p8","name":"Akaza Graphic Tee","price":199,"category":"Anime","image":"assets/akaza.jpg","sizes":["M","L","XL"],"badge":"NEW"},
  {"id":"p9","name":"ONESELF Graphic Tee","price":199,"category":"Graphic","image":"assets/oneself.jpg","sizes":["M","L","XL"],"badge":""}
];

let products = JSON.parse(localStorage.getItem("urban_products_v3") || "null") || PRODUCTS;
let cart = JSON.parse(localStorage.getItem("urban_cart_v3") || "[]");
let wishlist = JSON.parse(localStorage.getItem("urban_wishlist_v3") || "[]");
let category = "All";
let showOnlyWishlist = false;
const comboSelection = new Map();

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function money(n) { return "Rs. " + Math.round(n) + ".00"; }
function save() {
  localStorage.setItem("urban_products_v3", JSON.stringify(products));
  localStorage.setItem("urban_cart_v3", JSON.stringify(cart));
  localStorage.setItem("urban_wishlist_v3", JSON.stringify(wishlist));
}
function showToast(t) {
  const x = $("#toast");
  x.innerHTML = t;
  x.classList.add("show");
  setTimeout(() => x.classList.remove("show"), 2000);
}
function scrollShop() { document.querySelector("#shop").scrollIntoView({ behavior: "smooth" }); }
function toggleMenu() { 
  const nav = $("#navLinks");
  nav.style.display = nav.style.display === "none" ? "flex" : "none";
}
function setCategory(cat) {
  category = cat;
  showOnlyWishlist = false;
  $$(".list-menu__item").forEach(b => b.classList.remove("active"));
  // Highlight active
  $$(".list-menu__item").forEach(b => {
    if(b.textContent.trim() === cat || (cat === 'All' && b.textContent.trim() === 'Home')) {
      b.classList.add("active");
    }
  });
  render();
}
function toggleWishlistFilter() {
  showOnlyWishlist = !showOnlyWishlist;
  if(showOnlyWishlist) {
    $$(".list-menu__item").forEach(b => b.classList.remove("active"));
  } else {
    setCategory('All');
  }
  render();
}
function toggleWishlistItem(id, e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(x => x !== id);
    showToast("Removed from wishlist");
  } else {
    wishlist.push(id);
    showToast("Added to wishlist");
  }
  save();
  render();
}

function render() {
  let q = ($("#search")?.value || "").toLowerCase().trim();
  let list = products.filter(p => {
    if (showOnlyWishlist) return wishlist.includes(p.id);
    return (category === "All" || p.category === category);
  }).filter(p => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  
  const sort = $("#sort")?.value;
  if(sort === "low") list.sort((a,b) => a.price - b.price);
  if(sort === "high") list.sort((a,b) => b.price - a.price);

  $("#productGrid").innerHTML = list.map(p => {
    const selected = comboSelection.get(p.id)?.size || "";
    const isWishlist = wishlist.includes(p.id);
    return `
    <div class="card-wrapper">
      <div class="card">
        <div class="card__inner">
          <div class="card__media">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
          </div>
          <div class="card__badge">
            ${p.badge ? `<span class="badge ${p.badge === 'SALE' ? 'badge--sale' : ''}">${p.badge}</span>` : ''}
          </div>
          <button style="position:absolute; top:1rem; right:1rem; background:#fff; border-radius:50%; width:3.5rem; height:3.5rem; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.1);" onclick="toggleWishlistItem('${p.id}', event)">
            <svg viewBox="0 0 24 24" fill="${isWishlist ? 'rgb(var(--color-base-text))' : 'none'}" stroke="currentColor" stroke-width="2" style="width:1.8rem; height:1.8rem;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
        <div class="card__content">
          <h3 class="card__heading">${p.name}</h3>
          <div class="price">
            <span class="price__regular">${money(p.price)}</span>
            <span class="price__sale">Rs. 299.00</span>
          </div>
          <div class="product-sizes-inline">
            ${p.sizes.map(s => `<button class="size-btn-inline ${selected === s ? "selected" : ""}" onclick="selectSize(this, event)">${s}</button>`).join("")}
          </div>
          <div class="card-actions">
            <button class="button button--full-width button--small" onclick="addToCart('${p.id}', this, event)">Add to cart</button>
            <button class="button button--full-width button--small button--combo ${comboSelection.has(p.id) ? "active" : ""}" onclick="toggleComboItem('${p.id}', this, event)">
              ${comboSelection.has(p.id) ? "✓ In combo" : "Add to ₹499 combo"}
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }).join("") || `<p style="grid-column: 1/-1; padding: 4rem; text-align: center;">No products found.</p>`;
  
  updateComboUI();
}

function selectSize(btn, e) {
  e.preventDefault();
  const container = btn.parentElement;
  container.querySelectorAll(".size-btn-inline").forEach(x => x.classList.remove("selected"));
  btn.classList.add("selected");
}

function getSelectedSizeForProduct(context) {
  const container = context.closest('.card__content');
  const selectedBtn = container.querySelector(".size-btn-inline.selected");
  return selectedBtn ? selectedBtn.textContent.trim() : null;
}

function addToCart(id, btnElement, e) {
  e.preventDefault();
  const p = products.find(x => x.id === id); 
  if(!p) return;
  const size = getSelectedSizeForProduct(btnElement);
  if (!size) {
    showToast("Please select a size first");
    return;
  }
  
  const existing = cart.find(x => x.type === "single" && x.id === p.id && x.size === size);
  if(existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ type: "single", id: p.id, name: p.name, price: p.price, image: p.image, size, qty: 1 });
  }
  save(); renderCart(); openCart();
}

function toggleComboItem(id, btnElement, e) {
  e.preventDefault();
  const p = products.find(x => x.id === id); 
  if(!p) return;
  
  if(comboSelection.has(id)){
    comboSelection.delete(id);
    render();
    return;
  }
  
  if(comboSelection.size >= 3){
    showToast("Choose only 3 tees for combo");
    return;
  }
  
  const size = getSelectedSizeForProduct(btnElement);
  if (!size) {
    showToast("Please select a size for the combo");
    return;
  }
  
  comboSelection.set(id, { size });
  render();
}

function updateComboUI() {
  const btn = $("#comboBtn");
  if(!btn) return;
  btn.textContent = comboSelection.size === 3 ? "ADD COMBO TO CART (3/3)" : `SELECT 3 TEES (${comboSelection.size}/3)`;
  if(comboSelection.size === 3) {
    btn.classList.remove("button--secondary");
  } else {
    btn.classList.add("button--secondary");
  }
}

function addCombo() {
  if(comboSelection.size !== 3) {
    showToast("Select 3 tees first for the combo offer");
    return;
  }
  
  const items = [...comboSelection.entries()].map(([id, data]) => {
    const p = products.find(x => x.id === id);
    return { id: p.id, name: p.name, image: p.image, size: data.size };
  });
  
  cart.push({ type: "combo", id: "combo-" + Date.now(), name: "3-Piece Combo", price: 499, image: items[0].image, items, qty: 1 });
  comboSelection.clear();
  save(); render(); renderCart(); openCart();
}

function removeItem(i) {
  cart.splice(i,1);
  save(); renderCart();
}

function updateQty(i, delta) {
  if(!cart[i].qty) cart[i].qty = 1;
  cart[i].qty += delta;
  if(cart[i].qty <= 0) {
    removeItem(i);
  } else {
    save(); renderCart();
  }
}

function renderCart() {
  const count = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
  $("#cartCount").textContent = count;
  
  $("#cartItems").innerHTML = cart.length ? cart.map((x, i) => {
    const qty = x.qty || 1;
    if(x.type === "combo") {
      return `
      <div class="cart-item" style="border:1px solid rgba(var(--color-base-text),0.1); padding:1rem;">
        <div class="cart-item__media">
          <img src="${x.image}" alt="${x.name}">
        </div>
        <div class="cart-item__details">
          <span class="cart-item__name">3-Piece Combo</span>
          <div class="cart-item__price">${money(x.price * qty)}</div>
          <div class="cart-item__options">
            ${x.items.map(it => `• ${it.name} (${it.size})`).join("<br>")}
          </div>
          <div class="quantity-wrapper" style="margin-bottom:1rem;">
            <button class="quantity__button" onclick="updateQty(${i}, -1)">-</button>
            <input class="quantity__input" type="text" value="${qty}" readonly>
            <button class="quantity__button" onclick="updateQty(${i}, 1)">+</button>
          </div>
          <button class="cart-item__remove" onclick="removeItem(${i})">Remove</button>
        </div>
      </div>`;
    }
    
    return `
    <div class="cart-item">
      <div class="cart-item__media">
        <img src="${x.image}" alt="${x.name}">
      </div>
      <div class="cart-item__details">
        <span class="cart-item__name">${x.name}</span>
        <div class="cart-item__price">${money(x.price * qty)}</div>
        <div class="cart-item__options">Size: ${x.size}</div>
        <div class="quantity-wrapper" style="margin-bottom:1rem;">
          <button class="quantity__button" onclick="updateQty(${i}, -1)">-</button>
          <input class="quantity__input" type="text" value="${qty}" readonly>
          <button class="quantity__button" onclick="updateQty(${i}, 1)">+</button>
        </div>
        <button class="cart-item__remove" onclick="removeItem(${i})">Remove</button>
      </div>
    </div>`;
  }).join("") : '<p style="text-align: center; margin-top: 5rem;">Your cart is empty.</p>';
  
  const total = cart.reduce((s, x) => s + (x.price * (x.qty || 1)), 0);
  $("#cartTotal").textContent = money(total);
}

// Cart Drawer
function openCart() {
  $("#cartDrawer").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart(e) {
  if(e && e.target && e.target.id !== "cartDrawer") return;
  $("#cartDrawer").classList.remove("active");
  document.body.style.overflow = "";
}

// Checkout Flow
function openCheckoutModal() {
  if(!cart.length) { showToast("Your cart is empty"); return; }
  closeCart();
  $("#checkoutModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCheckout(e) {
  if(e && e.target && e.target.id !== "checkoutModal" && !e.target.closest('.modal__close')) return;
  $("#checkoutModal").classList.remove("active");
  document.body.style.overflow = "";
}

function processCheckout(e) {
  e.preventDefault();
  const name = $("#c_name").value.trim();
  const phone = $("#c_phone").value.trim();
  const address = $("#c_address").value.trim();
  
  if(!name || !phone || !address) {
    showToast("Please fill all details");
    return;
  }
  
  const lines = [];
  cart.forEach((x, i) => {
    const qty = x.qty || 1;
    if(x.type === "combo") {
      lines.push(`${i+1}. 3-Piece Combo (Qty: ${qty}) - ${money(x.price * qty)}`);
      x.items.forEach((it, j) => lines.push(`   ${j+1}) ${it.name} - Size ${it.size}`));
    } else {
      lines.push(`${i+1}. ${x.name} - Size ${x.size} (Qty: ${qty}) - ${money(x.price * qty)}`);
    }
  });
  
  const total = cart.reduce((s, x) => s + (x.price * (x.qty || 1)), 0);
  
  let msg = `*NEW ORDER: URBAN T-SHIRTS*\n\n`;
  msg += `*Customer Details*\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\n`;
  msg += `*Order Summary*\n${lines.join("\n")}\n\n`;
  msg += `*Total Amount:* ${money(total)}\n\n`;
  msg += `Please confirm availability and delivery status.`;
  
  window.open("https://wa.me/917603871293?text=" + encodeURIComponent(msg), "_blank");
  closeCheckout();
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  $("#search").addEventListener("input", render);
  $("#sort").addEventListener("change", render);
  
  render();
  renderCart();
});
