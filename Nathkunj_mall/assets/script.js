const CART_KEY = 'agriMallCart'
let cart = []
try{cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]')}catch(e){cart = []}
function saveCart(){localStorage.setItem(CART_KEY,JSON.stringify(cart))}
function addToCart(name,price){const idx = cart.findIndex(i=>i.name===name);if(idx>-1){cart[idx].quantity+=1}else{cart.push({name,price,quantity:1})}saveCart();alert('Added to cart: '+name)}
function formatPrice(p){return '₹ '+p+'/kg'}
function formatCurrency(p){return '₹ '+p}
function loadProducts(){return[
{name:'Tomato',category:'Seasonal',price:40,image:'images/tomato.jpg'},
{name:'Potato',category:'Root',price:30,image:'images/Potato.jpg'},
{name:'Onion',category:'Root',price:35,image:'images/Onion.jpg'},
{name:'Spinach',category:'Leafy',price:25,image:'images/Spinach.jpg'},
{name:'Cabbage',category:'Leafy',price:28,image:'images/Cabbage.jpg'},
{name:'Cauliflower',category:'Seasonal',price:45,image:'images/Cauliflower.jpg'},
{name:'Carrot',category:'Root',price:40,image:'images/Carrot.jpg'},
{name:'Beetroot',category:'Root',price:42,image:'images/Beetroot.jpg'},
{name:'Radish',category:'Root',price:32,image:'images/Radish.jpg'},
{name:'Coriander',category:'Leafy',price:20,image:'images/Coriander.jpg'},
{name:'Mint',category:'Leafy',price:22,image:'images/Mint.jpg'},
{name:'Green Peas',category:'Seasonal',price:60,image:'images/Green Peas.jpg'},
{name:'Capsicum',category:'Seasonal',price:55,image:'images/Capsicum.jpg'},
{name:'Brinjal',category:'Seasonal',price:38,image:'images/Brinjal.jpg'},
{name:'Pumpkin',category:'Seasonal',price:36,image:'images/Pumpkin.jpg'}
]}
function renderProducts(list){const grid=document.getElementById('productGrid');if(!grid)return;grid.innerHTML='';list.forEach(p=>{const card=document.createElement('div');card.className='product-card';card.innerHTML=`
  <div class="product-img"><img src="${p.image}" alt="${p.name}"></div>
  <div class="product-body">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h3 style="margin:0;color:#111827">${p.name}</h3>
      <span class="price">${formatPrice(p.price)}</span>
    </div>
    <button class="btn" data-name="${p.name}" data-price="${p.price}">Add to Cart</button>
  </div>
`;grid.appendChild(card)});grid.querySelectorAll('button[data-name]').forEach(b=>{b.addEventListener('click',e=>{const name=e.currentTarget.getAttribute('data-name');const price=parseFloat(e.currentTarget.getAttribute('data-price'));addToCart(name,price)})});grid.querySelectorAll('button[data-wishlist]').forEach(b=>{b.addEventListener('click',e=>{const n=e.currentTarget.getAttribute('data-wishlist');let w=getWishlist();if(!w.includes(n)){w.push(n);saveWishlist(w);alert('Added to wishlist: '+n)}})})}
function initProducts(){let products=loadProducts();try{const lp=JSON.parse(localStorage.getItem('agriProducts')||'null');if(lp)products=lp}catch(e){}renderProducts(products);const search=document.getElementById('searchInput');const cat=document.getElementById('categoryFilter');function apply(){let q=search?search.value.toLowerCase():'';let c=cat?cat.value:'';let filtered=products.filter(p=>(!q||p.name.toLowerCase().includes(q))&&(!c||p.category===c));renderProducts(filtered)}if(search)search.addEventListener('input',apply);if(cat)cat.addEventListener('change',apply)}
function renderCart(){const table=document.getElementById('cartTable');const tbody=document.getElementById('cartBody');const gt=document.getElementById('grandTotal');if(!table||!tbody||!gt)return;tbody.innerHTML='';let grand=0;cart.forEach((item,idx)=>{const total=item.price*item.quantity;grand+=total;const tr=document.createElement('tr');tr.innerHTML=`
  <td>${item.name}</td>
  <td>${formatCurrency(item.price)}</td>
  <td><input type="number" min="1" value="${item.quantity}" data-index="${idx}" class="input" style="width:80px"></td>
  <td>${formatCurrency(total.toFixed(2))}</td>
  <td><button class="btn secondary" data-remove="${idx}">Remove</button></td>
`;tbody.appendChild(tr)});gt.textContent=formatCurrency(grand.toFixed(2));tbody.querySelectorAll('input[type="number"]').forEach(inp=>{inp.addEventListener('change',e=>{const i=parseInt(e.target.getAttribute('data-index'));let q=parseInt(e.target.value);if(isNaN(q)||q<1){q=1;e.target.value='1'}cart[i].quantity=q;saveCart();renderCart()})});tbody.querySelectorAll('button[data-remove]').forEach(btn=>{btn.addEventListener('click',e=>{const i=parseInt(e.currentTarget.getAttribute('data-remove'));cart.splice(i,1);saveCart();renderCart()})})}
function initCart(){renderCart();const radios=document.querySelectorAll('input[name="payment"]');const upi=document.getElementById('upiFields');const card=document.getElementById('cardFields');function show(){const m=document.querySelector('input[name="payment"]:checked').value;if(upi)upi.classList.toggle('hidden',m!=='UPI');if(card)card.classList.toggle('hidden',m!=='Card')}radios.forEach(r=>r.addEventListener('change',show));show();const place=document.getElementById('placeOrderBtn');if(place)place.addEventListener('click',()=>{if(cart.length===0){alert('Your cart is empty');return}const m=document.querySelector('input[name="payment"]:checked').value;if(m==='COD'){alert('Order placed with COD');cart=[];saveCart();renderCart();return}if(m==='UPI'){const id=document.getElementById('upiId');if(!id||!id.value.trim()){alert('Enter UPI ID');return}const ok=/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(id.value.trim());if(!ok){alert('Enter a valid UPI ID');return}alert('Order placed with UPI');cart=[];saveCart();renderCart();return}if(m==='Card'){const name=document.getElementById('cardName');const num=document.getElementById('cardNumber');const exp=document.getElementById('cardExpiry');const cvv=document.getElementById('cardCvv');if(!name||!num||!exp||!cvv){alert('Enter card details');return}const nameOk=name.value.trim().length>1;const numOk=/^\d{13,19}$/.test(num.value.replace(/\s+/g,''));const expOk=/^(0[1-9]|1[0-2])\/(\d{2})$/.test(exp.value.trim());const cvvOk=/^\d{3,4}$/.test(cvv.value.trim());if(!nameOk||!numOk||!expOk||!cvvOk){alert('Enter valid card details');return}alert('Order placed with Card');cart=[];saveCart();renderCart();return}})}
function validate(fields){for(const f of fields){if(!f.value||!String(f.value).trim())return false}return true}
function initFarmerForm(){const form=document.getElementById('farmerForm');if(!form)return;form.addEventListener('submit',e=>{e.preventDefault();const name=form.querySelector('[name="name"]');const village=form.querySelector('[name="village"]');const contact=form.querySelector('[name="contact"]');const type=form.querySelector('[name="type"]');const qty=form.querySelector('[name="quantity"]');const price=form.querySelector('[name="price"]');if(!validate([name,village,contact,type,qty,price])){alert('Please fill all fields');return}const phoneOk=/^[0-9]{7,14}$/.test(contact.value);const qtyOk=parseFloat(qty.value)>0;const priceOk=parseFloat(price.value)>0;if(!phoneOk){alert('Enter a valid contact number');return}if(!qtyOk){alert('Enter a valid quantity');return}if(!priceOk){alert('Enter a valid price per Kg');return}alert('Registration submitted');form.reset()})}
function initContactForm(){const form=document.getElementById('contactForm');if(!form)return;form.addEventListener('submit',e=>{e.preventDefault();const name=form.querySelector('[name="name"]');const email=form.querySelector('[name="email"]');const message=form.querySelector('[name="message"]');if(!validate([name,email,message])){alert('Please fill all fields');return}const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);if(!emailOk){alert('Enter a valid email');return}if(message.value.length<5){alert('Message should be at least 5 characters');return}alert('Message sent');form.reset()})}
function init(){const page=document.body.getAttribute('data-page');if(page==='products')initProducts();if(page==='cart')initCart();if(page==='farmers')initFarmerForm();if(page==='contact')initContactForm();if(page==='signup')initSignupForm();if(page==='login')initLoginForm()}
document.addEventListener('DOMContentLoaded',init)
const USER_KEY='agriMallUser'
function getUser(){try{return JSON.parse(localStorage.getItem(USER_KEY)||'null')}catch(e){return null}}
function saveUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u))}
async function hashPassword(p){const enc=new TextEncoder().encode(p);const buf=await crypto.subtle.digest('SHA-256',enc);return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('')}
function initSignupForm(){const form=document.getElementById('signupForm');if(!form)return;form.addEventListener('submit',async e=>{e.preventDefault();const name=form.querySelector('[name="name"]');const email=form.querySelector('[name="email"]');const password=form.querySelector('[name="password"]');const confirm=form.querySelector('[name="confirm"]');if(!validate([name,email,password,confirm])){alert('Please fill all fields');return}const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);if(!emailOk){alert('Enter a valid email');return}if(password.value.length<6){alert('Password should be at least 6 characters');return}if(password.value!==confirm.value){alert('Passwords do not match');return}const hash=await hashPassword(password.value);saveUser({name:name.value,email:email.value,passwordHash:hash});alert('Account created');window.location.href='login.html'})}
function initLoginForm(){const form=document.getElementById('loginForm');if(!form)return;form.addEventListener('submit',async e=>{e.preventDefault();const email=form.querySelector('[name="email"]');const password=form.querySelector('[name="password"]');if(!validate([email,password])){alert('Please fill all fields');return}const user=getUser();if(!user){alert('No account found. Please sign up');return}if(email.value!==user.email){alert('Invalid credentials');return}const hash=await hashPassword(password.value);if(hash!==user.passwordHash){alert('Invalid credentials');return}alert('Logged in')})}
const PRODUCTS_KEY='agriProducts'
function getProducts(){try{return JSON.parse(localStorage.getItem(PRODUCTS_KEY)||'null')}catch(e){return null}}
function saveProducts(p){localStorage.setItem(PRODUCTS_KEY,JSON.stringify(p))}
const ORDERS_KEY='agriOrders'
function getOrders(){try{return JSON.parse(localStorage.getItem(ORDERS_KEY)||'[]')}catch(e){return []}}
function saveOrders(o){localStorage.setItem(ORDERS_KEY,JSON.stringify(o))}
function readFileAsDataURL(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
function initAdminAddProduct(){const form=document.getElementById('adminAddProduct');if(!form)return;form.addEventListener('submit',async e=>{e.preventDefault();const name=form.querySelector('[name="name"]');const category=form.querySelector('[name="category"]');const price=form.querySelector('[name="price"]');const stock=form.querySelector('[name="stock"]');const image=form.querySelector('[name="image"]');if(!validate([name,category,price,stock])){alert('Fill all product fields');return}let img='';if(image&&image.files&&image.files[0]){img=await readFileAsDataURL(image.files[0])}const products=getProducts()||[];products.push({name:name.value,category:category.value,price:parseFloat(price.value),stock:parseInt(stock.value),image:img||'images/seasonal.svg'});saveProducts(products);alert('Product added');form.reset()})}
function initAdminManageProducts(){const body=document.getElementById('adminProductsBody');if(!body)return;function render(){body.innerHTML='';(getProducts()||[]).forEach((p,i)=>{const tr=document.createElement('tr');tr.innerHTML=`
  <td>${p.name}</td>
  <td>${p.category}</td>
  <td><input class="input" type="number" value="${p.price}" data-edit="price" data-i="${i}" style="width:100px"></td>
  <td><input class="input" type="number" value="${p.stock||0}" data-edit="stock" data-i="${i}" style="width:100px"></td>
  <td><button class="btn secondary" data-del="${i}">Delete</button></td>
`;body.appendChild(tr)});body.querySelectorAll('input[data-edit]').forEach(inp=>{inp.addEventListener('change',e=>{const i=parseInt(e.target.getAttribute('data-i'));const k=e.target.getAttribute('data-edit');const products=getProducts()||[];products[i][k]=k==='price'?parseFloat(e.target.value):parseInt(e.target.value);saveProducts(products)})});body.querySelectorAll('button[data-del]').forEach(btn=>{btn.addEventListener('click',e=>{const i=parseInt(e.currentTarget.getAttribute('data-del'));const products=getProducts()||[];products.splice(i,1);saveProducts(products);render()})})}render()}
function initAdminManageOrders(){const body=document.getElementById('adminOrdersBody');if(!body)return;function render(){body.innerHTML='';(getOrders()||[]).forEach((o,i)=>{const tr=document.createElement('tr');tr.innerHTML=`
  <td>${o.id}</td>
  <td>${o.customer}</td>
  <td>${o.payment.method}</td>
  <td>
    <select class="input" data-status="${i}">
      <option${o.status==='New'?' selected':''}>New</option>
      <option${o.status==='Packed'?' selected':''}>Packed</option>
      <option${o.status==='Out for Delivery'?' selected':''}>Out for Delivery</option>
      <option${o.status==='Delivered'?' selected':''}>Delivered</option>
    </select>
  </td>
  <td>${formatCurrency(o.total)}</td>
  <td><input class="input" placeholder="Partner ID" value="${o.assignedTo||''}" data-assign="${i}" style="width:110px"></td>
  <td><button class="btn secondary" data-save="${i}">Save</button></td>
`;body.appendChild(tr)});body.querySelectorAll('select[data-status]').forEach(s=>{s.addEventListener('change',e=>{const i=parseInt(e.target.getAttribute('data-status'));const orders=getOrders()||[];orders[i].status=e.target.value;saveOrders(orders)})});body.querySelectorAll('input[data-assign]').forEach(inp=>{inp.addEventListener('change',e=>{const i=parseInt(e.target.getAttribute('data-assign'));const orders=getOrders()||[];orders[i].assignedTo=e.target.value;saveOrders(orders)})});body.querySelectorAll('button[data-save]').forEach(btn=>{btn.addEventListener('click',()=>{alert('Order updated')})})}render()}
function initAdminManageUsers(){const body=document.getElementById('adminUsersBody');if(!body)return;const user=getUser();let users=user?[{name:user.name,email:user.email}]:[];body.innerHTML='';users.forEach(u=>{const orders=(getOrders()||[]).filter(o=>o.customer===u.email);const tr=document.createElement('tr');tr.innerHTML=`
  <td>${u.name}</td>
  <td>${u.email}</td>
  <td>${orders.length}</td>
`;body.appendChild(tr)})}
function initAdminDashboard(){const stats=document.getElementById('adminStats');if(!stats)return;const orders=getOrders()||[];let sales=0;orders.forEach(o=>sales+=o.total);stats.innerHTML='';[{label:'Total Sales',value:formatCurrency(sales.toFixed(2))},{label:'Orders',value:String(orders.length)},{label:'Products',value:String((getProducts()||[]).length)}].forEach(s=>{const c=document.createElement('div');c.className='card';c.innerHTML=`<div class="icon">${s.value}</div><div>${s.label}</div>`;stats.appendChild(c)});const low=document.getElementById('lowStock');const items=(getProducts()||[]).filter(p=>(p.stock||0)<=10);low.innerHTML='';items.forEach(p=>{const c=document.createElement('div');c.className='card';c.innerHTML=`<div>${p.name}</div><div>Stock: ${p.stock||0} kg</div>`;low.appendChild(c)})}
function toCsv(rows){return rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')}
function initAdminReports(){const top=document.getElementById('topSelling');if(!top)return;const orders=getOrders()||[];const counts={};orders.forEach(o=>o.items.forEach(i=>{counts[i.name]=(counts[i.name]||0)+i.quantity}));const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]);const top3=sorted.slice(0,3);const low3=sorted.slice(-3);const summary=document.getElementById('reportSummary');let sales=0;orders.forEach(o=>sales+=o.total);summary.innerHTML='';[{label:'Daily',value:formatCurrency(sales.toFixed(2))},{label:'Orders',value:String(orders.length)}].forEach(s=>{const c=document.createElement('div');c.className='card';c.innerHTML=`<div class="icon">${s.value}</div><div>${s.label}</div>`;summary.appendChild(c)});const renderList=(target,list)=>{target.innerHTML='';list.forEach(([name,qty])=>{const c=document.createElement('div');c.className='card';c.innerHTML=`<div>${name}</div><div>Qty: ${qty}</div>`;target.appendChild(c)})};renderList(top,top3);renderList(document.getElementById('lowSelling'),low3);const exportBtn=document.getElementById('exportCsv');if(exportBtn)exportBtn.addEventListener('click',()=>{const rows=[['OrderID','Customer','Total','Status']];orders.forEach(o=>rows.push([o.id,o.customer,o.total,o.status]));const blob=new Blob([toCsv(rows)],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sales.csv';a.click()});const printBtn=document.getElementById('printReport');if(printBtn)printBtn.addEventListener('click',()=>{window.print()})}
function initDeliveryLogin(){const form=document.getElementById('deliveryLoginForm');if(!form)return;form.addEventListener('submit',e=>{e.preventDefault();const id=form.querySelector('[name="id"]').value.trim();if(!id){alert('Enter Partner ID');return}localStorage.setItem('deliveryPartnerId',id);window.location.href='orders.html'})}
function initDeliveryOrders(){const body=document.getElementById('deliveryOrdersBody');if(!body)return;const id=localStorage.getItem('deliveryPartnerId')||'';body.innerHTML='';(getOrders()||[]).filter(o=>String(o.assignedTo||'')===id).forEach((o)=>{const tr=document.createElement('tr');const route=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}`;tr.innerHTML=`
  <td>${o.id}</td>
  <td>${o.address}</td>
  <td>${o.status}</td>
  <td><a href="${route}" target="_blank">Open Maps</a></td>
  <td>
    <select class="input" data-delivery-status="${o.id}">
      <option${o.status==='Out for Delivery'?' selected':''}>Out for Delivery</option>
      <option${o.status==='Delivered'?' selected':''}>Delivered</option>
    </select>
  </td>
`;body.appendChild(tr)});body.querySelectorAll('select[data-delivery-status]').forEach(s=>{s.addEventListener('change',e=>{const oid=e.target.getAttribute('data-delivery-status');const orders=getOrders()||[];const idx=orders.findIndex(x=>x.id===oid);if(idx>-1){orders[idx].status=e.target.value;saveOrders(orders);alert('Status updated')}})})}
function initAdminPages(){const page=document.body.getAttribute('data-page');if(page==='admin-dashboard')initAdminDashboard();if(page==='admin-add-product')initAdminAddProduct();if(page==='admin-manage-products')initAdminManageProducts();if(page==='admin-manage-orders')initAdminManageOrders();if(page==='admin-manage-users')initAdminManageUsers();if(page==='admin-reports')initAdminReports();if(page==='delivery-login')initDeliveryLogin();if(page==='delivery-orders')initDeliveryOrders()}
function hookOrderRecording(){const btn=document.getElementById('placeOrderBtn');if(!btn)return;btn.addEventListener('click',()=>{if(cart.length===0)return;const m=document.querySelector('input[name="payment"]:checked');const method=m?m.value:'COD';let total=0;cart.forEach(i=>{total+=i.price*i.quantity});const user=getUser();const id='ORD'+Date.now();const order={id,customer:user?user.email:'guest',items:cart.map(i=>Object.assign({},i)),status:'New',payment:{method:method,ref:''},total:parseFloat(total.toFixed(2)),address:'Nathkunj Agri Mall, Gujarat',assignedTo:null,createdAt:new Date().toISOString()};const orders=getOrders()||[];orders.push(order);saveOrders(orders)},true)}
document.addEventListener('DOMContentLoaded',()=>{initAdminPages();if(document.body.getAttribute('data-page')==='cart')hookOrderRecording()})