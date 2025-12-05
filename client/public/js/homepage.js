// SAMPLE PRODUCTS (replace with API call later)
const products = [];
for(let i=1;i<=12;i++){
  products.push({
    id: i,
    title: `Sample Product ${i}`,
    price: (Math.random()*250 + 20).toFixed(2),
    rating: (Math.random()*2 + 3).toFixed(1),
    img: `https://picsum.photos/seed/p${i}/400/300`
  });
}

const productGrid = document.getElementById('productGrid');
const cartCountEl = document.getElementById('cartCount');

function renderProducts(list){
  productGrid.innerHTML = '';
  list.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <div class="title">${p.title}</div>
      <div class="meta">Rating: ${p.rating} ★</div>
      <div class="price">₹ ${p.price}</div>
      <div class="actions">
        <button class="btn outline" onclick="viewProduct(${p.id})">View</button>
        <button onclick="addToCart({
  id: 101,
  name: 'Nike Shoes',
  price: 2499,
  image: 'images/nike.jpg'
})">Add to Cart</button>

      </div>
    `;
    productGrid.appendChild(div);
  })
}

function viewProduct(id){
  window.location.href = `product.html?id=${id}`;
}

function getCart(){ return JSON.parse(localStorage.getItem('vendo_cart')||'[]') }
function setCart(c){ localStorage.setItem('vendo_cart',JSON.stringify(c)); updateCartCount(); }
function addToCart(id){
  const c = getCart();
  const found = c.find(x=>x.id===id);
  if(found) found.qty++;
  else c.push({id,qty:1});
  setCart(c);
  // lightweight toast
  const t = document.createElement('div');
  t.textContent = 'Added to cart';
  t.style.position='fixed'; t.style.right='20px'; t.style.bottom='120px';
  t.style.background='var(--primary)'; t.style.color='white'; t.style.padding='8px 12px';
  t.style.borderRadius='8px'; t.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'; t.style.zIndex=9999;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),1400);
}

function updateCartCount(){
  const c = getCart();
  const total = c.reduce((s,i)=>s+i.qty,0);
  cartCountEl.textContent = total;
}

// search & sort handlers
document.getElementById('searchBtn').addEventListener('click',()=>{
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = products.filter(p=>p.title.toLowerCase().includes(q));
  renderProducts(filtered);
});

document.getElementById('sortSelect').addEventListener('change',(e)=>{
  const v = e.target.value;
  let sorted = [...products];
  if(v==='price-asc') sorted.sort((a,b)=>a.price - b.price);
  if(v==='price-desc') sorted.sort((a,b)=>b.price - a.price);
  renderProducts(sorted);
});

// chat widget (toggle)
const chatToggle = document.createElement('button');
chatToggle.className = 'chat-toggle';
chatToggle.id = 'chatToggle';
chatToggle.innerText = 'Chat';
document.body.appendChild(chatToggle);

const chatWindow = document.createElement('div');
chatWindow.className = 'chat-window';
chatWindow.id = 'chatWindow';
chatWindow.style.display = 'none';
chatWindow.innerHTML = `
  <div class="header">Vendo Support • AI Assistant</div>
  <div class="messages"><div style="font-size:13px;color:var(--muted)">Hello! I'm VendoBot — ask me about products, orders, or returns.</div></div>
  <div class="composer">
    <input id="chatInput" placeholder="Type your question..." />
    <button id="sendChat">Send</button>
  </div>
`;
document.body.appendChild(chatWindow);

chatToggle.addEventListener('click',()=>{
  if(chatWindow.style.display === 'none'){ chatWindow.style.display = 'flex'; } else { chatWindow.style.display = 'none'; }
});

// chat send (prototype)
document.addEventListener('click', (e)=>{
  if(e.target && e.target.id === 'sendChat'){
    const chatInput = document.getElementById('chatInput');
    const text = chatInput.value.trim();
    if(!text) return;
    const msgs = chatWindow.querySelector('.messages');
    const u = document.createElement('div'); u.style.textAlign='right'; u.style.margin='8px 0'; u.textContent = 'You: '+text;
    msgs.appendChild(u);
    chatInput.value='';
    const bot = document.createElement('div'); bot.style.margin='8px 0'; bot.textContent = 'VendoBot: Let me check that for you...';
    msgs.appendChild(bot);
    msgs.scrollTop = msgs.scrollHeight;
  }
});

// init
renderProducts(products);
updateCartCount();
