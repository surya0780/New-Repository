let inventoryData = [];

const API_URL = "https://script.google.com/macros/s/AKfycbw5nVn2wkXgzMM0tb04z4j46Mc5ct0Gg0o77lr_1saiwyMNFnZW5tOy4-vhhesBEtjSJg/exec";

async function loadData(){

  if(API_URL.includes("PASTE")){
    sampleData();
    return;
  }

  const response = await fetch(API_URL);
  inventoryData = await response.json();

  renderTable(inventoryData);
  updateStats();
  loadVendors();
}

function sampleData(){

  inventoryData = [
    {
      item_id:"10026569",
      upc:"8901234567890",
      product_name:"VVD Gold Pure Coconut Oil",
      brand:"VVD",
      mrp:190,
      qty:2,
      threshold:1
    },
    {
      item_id:"10079890",
      upc:"8909876543210",
      product_name:"Mee Mee Baby Wash",
      brand:"Mee Mee",
      mrp:349,
      qty:0,
      threshold:1
    }
  ];

  renderTable(inventoryData);
  updateStats();
  loadVendors();
}

function renderTable(data){

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach((item,index)=>{

    const isGood =
    Number(item.qty) >= Number(item.threshold);

    tbody.innerHTML += `
    <tr>
      <td>${index+1}</td>

      <td>
        <img
        class="product-image"
        src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png">
      </td>

      <td>${item.item_id}</td>
      <td>${item.upc}</td>
      <td>${item.product_name}</td>
      <td>${item.brand}</td>
      <td>₹${item.mrp}</td>
      <td>${item.qty}</td>

      <td>
        <span class="status-pill ${isGood ? 'good-pill':'bad-pill'}">
          ${isGood ? 'GOOD':'LOW'}
        </span>
      </td>
    </tr>`;
  });
}

function updateStats(){

  document.getElementById("totalProducts").innerText =
  inventoryData.length;

  document.getElementById("goodCount").innerText =
  inventoryData.filter(x=>Number(x.qty)>=Number(x.threshold)).length;

  document.getElementById("badCount").innerText =
  inventoryData.filter(x=>Number(x.qty)<Number(x.threshold)).length;
}

function filterStock(type){

  if(type==='good'){
    renderTable(
      inventoryData.filter(x=>
        Number(x.qty)>=Number(x.threshold)
      )
    );
  }

  if(type==='bad'){
    renderTable(
      inventoryData.filter(x=>
        Number(x.qty)<Number(x.threshold)
      )
    );
  }
}

function loadVendors(){

  const vendorFilter =
  document.getElementById("vendorFilter");

  vendorFilter.innerHTML =
  '<option value="">All Vendors</option>';

  const brands = [
    ...new Set(
      inventoryData.map(x=>x.brand)
    )
  ];

  brands.forEach(brand=>{

    const option =
    document.createElement("option");

    option.value = brand;
    option.innerText = brand;

    vendorFilter.appendChild(option);
  });
}

document
.getElementById("vendorFilter")
.addEventListener("change",function(){

  const value = this.value;

  if(!value){
    renderTable(inventoryData);
    return;
  }

  renderTable(
    inventoryData.filter(item=>
      item.brand===value
    )
  );
});

document
.getElementById("search")
.addEventListener("keyup",function(){

  const value =
  this.value.toLowerCase();

  const filtered = inventoryData.filter(item=>

    String(item.item_id)
    .toLowerCase()
    .includes(value)

    ||

    String(item.upc)
    .toLowerCase()
    .includes(value)

    ||

    item.product_name
    .toLowerCase()
    .includes(value)

  );

  renderTable(filtered);
});

loadData();
