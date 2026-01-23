window.SELLER = {
  "name":"Awa Marché",
  "phone":"22501234567",
  "city":"Abidjan",
  "currency":"FCFA",
  "products":[
    {"id":"p1","title":"Beignet maison","price":200,"img":"https://via.placeholder.com/600x600/4CAF50/fff?text=Beignet","unit":"pièce"},
    {"id":"p2","title":"Jus de bissap","price":500,"img":"https://via.placeholder.com/600x600/E91E63/fff?text=Bissap","unit":"bouteille"},
    {"id":"p3","title":"Alloco (portion)","price":800,"img":"https://via.placeholder.com/600x600/FF5722/fff?text=Alloco","unit":"portion"},
    {"id":"p4","title":"Pain frais","price":150,"img":"https://via.placeholder.com/600x600/2196F3/fff?text=Pain","unit":"pièce"},
    {"id":"p5","title":"Beurre local","price":300,"img":"https://via.placeholder.com/600x600/FFC107/fff?text=Beurre","unit":"pot"},
    {"id":"p6","title":"Poulet braisé","price":2500,"img":"https://via.placeholder.com/600x600/FF9800/fff?text=Poulet","unit":"portion"},
    {"id":"p7","title":"Attiéké","price":500,"img":"https://via.placeholder.com/600x600/9C27B0/fff?text=Attieke","unit":"portion"},
    {"id":"p8","title":"Gâteau","price":1000,"img":"https://via.placeholder.com/600x600/3F51B5/fff?text=Gateau","unit":"part"},
    {"id":"p9","title":"Baskets Nike","price":15000,"img":"https://via.placeholder.com/600x600/1976D2/fff?text=Nike","unit":"paire","variants":{"colors":[{"name":"Noir","hex":"#000000"},{"name":"Blanc","hex":"#FFFFFF"},{"name":"Rouge","hex":"#FF0000"},{"name":"Bleu","hex":"#0000FF"}],"sizes":["38","39","40","41","42","43","44"]}},
    {"id":"p10","title":"T-shirt Premium","price":5000,"img":"https://via.placeholder.com/600x600/00BCD4/fff?text=Tshirt","unit":"pièce","variants":{"colors":[{"name":"Bleu","hex":"#2196F3"},{"name":"Vert","hex":"#4CAF50"},{"name":"Jaune","hex":"#FFC107"},{"name":"Rose","hex":"#E91E63"}],"sizes":["S","M","L","XL","XXL"]}},
    {"id":"p11","title":"Sandales","price":8000,"img":"https://via.placeholder.com/600x600/795548/fff?text=Sandales","unit":"paire","variants":{"colors":[{"name":"Marron","hex":"#795548"},{"name":"Beige","hex":"#D7CCC8"}],"sizes":["36","37","38","39","40","41"]}},
    {"id":"p12","title":"Robe","price":12000,"img":"https://via.placeholder.com/600x600/9C27B0/fff?text=Robe","unit":"pièce","variants":{"colors":[{"name":"Violet","hex":"#9C27B0"},{"name":"Orange","hex":"#FF9800"}],"sizes":["S","M","L"]}},
    {"id":"p13","title":"Jeans","price":9000,"img":"https://via.placeholder.com/600x600/607D8B/fff?text=Jeans","unit":"pièce","variants":{"sizes":["28","30","32","34","36","38"]}},
    {"id":"p14","title":"Casquette","price":3000,"img":"https://via.placeholder.com/600x600/FF5722/fff?text=Cap","unit":"pièce","variants":{"colors":[{"name":"Noir","hex":"#000000"},{"name":"Blanc","hex":"#FFFFFF"},{"name":"Rouge","hex":"#F44336"}]}},
    {"id":"p15","title":"Sac à dos","price":18000,"img":"https://via.placeholder.com/600x600/00BCD4/fff?text=Sac","unit":"pièce","variants":{"colors":[{"name":"Bleu marine","hex":"#1565C0"},{"name":"Gris","hex":"#757575"},{"name":"Vert","hex":"#388E3C"}]}}
  ]
};

const PRODUCTS_PER_PAGE = 12;

(function(){
  const seller = window.SELLER;
  const PRODUCTS_PER_PAGE = window.PRODUCTS_PER_PAGE || 12;
  const cart = {};
  let currentPage = 1;
  let filteredProducts = seller.products;
  
  document.getElementById('shopName').textContent = seller.name;
  
  const productsEl = document.getElementById('products');
  const noResultsEl = document.getElementById('noResults');
  const searchInput = document.getElementById('search');
  const paginationEl = document.getElementById('pagination');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageNumbersEl = document.getElementById('pageNumbers');
  const quickbar = document.getElementById('quickbar');
  const quickSummary = document.getElementById('quickSummary');
  const customerName = document.getElementById('customerName');
  const customerContact = document.getElementById('customerContact');
  const customerAddress = document.getElementById('customerAddress');
  const quickOrderBtn = document.getElementById('quickOrder');

  function fmt(n){ return n.toLocaleString() + ' ' + seller.currency; }
  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  function renderProducts(){
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const list = filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
    
    if(filteredProducts.length === 0){
      productsEl.innerHTML = '';
      noResultsEl.style.display = 'block';
      paginationEl.style.display = 'none';
      return;
    }
    
    noResultsEl.style.display = 'none';
    paginationEl.style.display = totalPages > 1 ? 'flex' : 'none';
    
    productsEl.innerHTML = list.map(p => {
      const cartItem = cart[p.id] || {qty: 0};
      let variantsHTML = '';
      
      if(p.variants){
        variantsHTML = '<div class="variants">';
        
        if(p.variants.colors){
          variantsHTML += '<div><div class="variant-label">Couleur:</div>';
          variantsHTML += `<select class="variant-select" data-id="${p.id}" data-type="color">`;
          variantsHTML += '<option value="">-- Choisir --</option>';
          p.variants.colors.forEach(c => {
            const colorName = c.name || c;
            const selected = cartItem.color === colorName ? 'selected' : '';
            variantsHTML += `<option value="${escapeHtml(colorName)}" ${selected}>${escapeHtml(colorName)}</option>`;
          });
          variantsHTML += '</select></div>';
        }
        
        if(p.variants.sizes){
          variantsHTML += '<div><div class="variant-label">Taille:</div>';
          variantsHTML += `<select class="variant-select" data-id="${p.id}" data-type="size">`;
          variantsHTML += '<option value="">-- Choisir --</option>';
          p.variants.sizes.forEach(s => {
            const selected = cartItem.size === s ? 'selected' : '';
            variantsHTML += `<option value="${escapeHtml(s)}" ${selected}>${escapeHtml(s)}</option>`;
          });
          variantsHTML += '</select></div>';
        }
        
        variantsHTML += '</div>';
      }
      
      return `
      <article class="card">
        <div class="thumb">
          <img src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy">
        </div>
        <div class="product-info">
          <div class="title">${escapeHtml(p.title)}</div>
          <div class="meta">${escapeHtml(p.unit)}</div>
          <div class="price">${fmt(p.price)}</div>
          ${variantsHTML}
          <div class="qty-controls">
            <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
            <input class="qty-input" type="number" min="0" value="${cartItem.qty}" data-id="${p.id}">
            <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
          </div>
          <button class="order-btn" data-id="${p.id}">Commander</button>
        </div>
      </article>
    `}).join('');
    
    renderPagination(totalPages);
  }

  function renderPagination(totalPages){
    if(totalPages <= 1){
      paginationEl.style.display = 'none';
      return;
    }
    
    paginationEl.style.display = 'flex';
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    pageNumbersEl.innerHTML = '';
    
    const maxVisible = 5;
    let pages = [];
    
    if(totalPages <= maxVisible){
      pages = Array.from({length: totalPages}, (_, i) => i + 1);
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if(start > 2) {
        const dot = document.createElement('span');
        dot.textContent = '...';
        dot.style.padding = '0 8px';
        dot.style.color = 'var(--muted)';
        pageNumbersEl.appendChild(dot);
      }
      
      for(let i = start; i <= end; i++){
        if(!pages.includes(i)) pages.push(i);
      }
      
      if(end < totalPages - 1){
        const dot = document.createElement('span');
        dot.textContent = '...';
        dot.style.padding = '0 8px';
        dot.style.color = 'var(--muted)';
        pageNumbersEl.appendChild(dot);
      }
      
      if(!pages.includes(totalPages)) pages.push(totalPages);
    }
    
    pages.forEach(i => {
      const btn = document.createElement('div');
      btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
      btn.textContent = i;
      btn.onclick = () => { 
        currentPage = i; 
        renderProducts(); 
        window.scrollTo({top: 0, behavior: 'smooth'}); 
      };
      pageNumbersEl.appendChild(btn);
    });
  }

  prevBtn.addEventListener('click', () => {
    if(currentPage > 1){
      currentPage--;
      renderProducts();
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  });

  nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if(currentPage < totalPages){
      currentPage++;
      renderProducts();
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  });

  function updateCart(id, qty, color, size){
    qty = Math.max(0, parseInt(qty) || 0);
    if(qty === 0){
      delete cart[id];
    } else {
      cart[id] = {qty, color, size};
    }
    updateQuickbar();
  }

  function updateQuickbar(){
    const items = Object.keys(cart).filter(k => cart[k].qty > 0);
    
    if(items.length === 0){
      quickbar.classList.remove('visible');
      return;
    }
    
    quickbar.classList.add('visible');
    
    const lines = items.map(id => {
      const p = seller.products.find(x => x.id === id);
      const item = cart[id];
      let details = `${item.qty} x ${p.title}`;
      if(item.color) details += ` (${item.color})`;
      if(item.size) details += ` - Taille ${item.size}`;
      return details;
    });
    
    const total = items.reduce((sum, id) => {
      const p = seller.products.find(x => x.id === id);
      return sum + (p.price * cart[id].qty);
    }, 0);
    
    quickSummary.innerHTML = `${lines.join(' • ')}<br><strong>Total: ${fmt(total)}</strong>`;
  }

  function buildMessage(products, name, contact, address){
    let lines = [`Bonjour ${seller.name},`, '', 'Je souhaite commander:', ''];
    
    products.forEach(({product, item}) => {
      let line = `• ${item.qty} x ${product.title}`;
      if(item.color) line += ` (Couleur: ${item.color})`;
      if(item.size) line += ` - Taille: ${item.size}`;
      line += ` = ${fmt(product.price * item.qty)}`;
      lines.push(line);
    });
    
    const total = products.reduce((sum, {product, item}) => sum + (product.price * item.qty), 0);
    lines.push('', `*Total: ${fmt(total)}*`, '');
    lines.push(`*Client:* ${name}`);
    lines.push(`*Contact:* ${contact}`);
    lines.push(`*Adresse:* ${address}`);
    lines.push('', `Ville: ${seller.city}`);
    
    return encodeURIComponent(lines.join('\n'));
  }

  productsEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-action], .order-btn');
    if(!btn) return;
    
    const id = btn.getAttribute('data-id');
    
    if(btn.classList.contains('order-btn')){
      const product = seller.products.find(p => p.id === id);
      const input = productsEl.querySelector(`.qty-input[data-id="${id}"]`);
      const qty = Math.max(1, parseInt(input.value) || 1);
      
      if(qty === 0){
        alert('Veuillez sélectionner une quantité');
        return;
      }
      
      const item = cart[id] || {qty};
      
      if(product.variants){
        if(product.variants.colors && !item.color){
          alert('Veuillez sélectionner une couleur');
          return;
        }
        if(product.variants.sizes && !item.size){
          alert('Veuillez sélectionner une taille');
          return;
        }
      }
      
      const name = prompt('Votre nom:') || 'Client';
      const contact = prompt('Votre contact:') || '';
      const address = prompt('Adresse / Points de repère:') || '';
      
      if(!contact || !address){
        alert('Veuillez renseigner tous les champs');
        return;
      }
      
      const msg = buildMessage([{product, item: {...item, qty}}], name, contact, address);
      window.open(`https://wa.me/${seller.phone.replace(/\D/g,'')}?text=${msg}`, '_blank');
      return;
    }
    
    const action = btn.getAttribute('data-action');
    const input = productsEl.querySelector(`.qty-input[data-id="${id}"]`);
    let val = parseInt(input.value) || 0;
    
    if(action === 'inc') val++;
    if(action === 'dec') val--;
    
    val = Math.max(0, val);
    input.value = val;
    
    const item = cart[id] || {};
    updateCart(id, val, item.color, item.size);
  });

  productsEl.addEventListener('change', e => {
    if(e.target.classList.contains('variant-select')){
      const id = e.target.getAttribute('data-id');
      const type = e.target.getAttribute('data-type');
      const value = e.target.value;
      
      if(!cart[id]) cart[id] = {qty: 0};
      cart[id][type] = value;
    }
  });

  productsEl.addEventListener('input', e => {
    if(!e.target.classList.contains('qty-input')) return;
    const id = e.target.getAttribute('data-id');
    const item = cart[id] || {};
    updateCart(id, e.target.value, item.color, item.size);
  });

  searchInput.addEventListener('input', e => {
    const term = e.target.value.trim().toLowerCase();
    filteredProducts = seller.products.filter(p => p.title.toLowerCase().includes(term));
    currentPage = 1;
    renderProducts();
  });

  quickOrderBtn.addEventListener('click', () => {
    const name = customerName.value.trim();
    const contact = customerContact.value.trim();
    const address = customerAddress.value.trim();
    
    if(!name || !contact || !address){
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    for(let id of Object.keys(cart)){
      if(cart[id].qty === 0) continue;
      const product = seller.products.find(p => p.id === id);
      if(product.variants){
        if(product.variants.colors && !cart[id].color){
          alert(`Veuillez sélectionner une couleur pour ${product.title}`);
          return;
        }
        if(product.variants.sizes && !cart[id].size){
          alert(`Veuillez sélectionner une taille pour ${product.title}`);
          return;
        }
      }
    }
    
    const items = Object.keys(cart).filter(k => cart[k].qty > 0).map(id => ({
      product: seller.products.find(p => p.id === id),
      item: cart[id]
    }));
    
    const msg = buildMessage(items, name, contact, address);
    window.open(`https://wa.me/${seller.phone.replace(/\D/g,'')}?text=${msg}`, '_blank');
    
    Object.keys(cart).forEach(k => delete cart[k]);
    customerName.value = '';
    customerContact.value = '';
    customerAddress.value = '';
    renderProducts();
    updateQuickbar();
  });

  renderProducts();
})();
