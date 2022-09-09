function updateCheeseView(cheeseQty) {
  let cheeseCounter = document.getElementById("cheese_counter");

  cheeseCounter.innerText = cheeseQty;

  return cheeseCounter.innerText;
}

function clickCheese(data) {
  data.cheese++;
  renderProducers(data);

  return updateCheeseView(data.cheese);
}

function unlockProducers(producers, cheeseCount) {
  for (let i = 0; i < producers.length; i++) {
    if (cheeseCount >= producers[i].price / 2) {
      producers[i].unlocked = true;
    }
  }
}

function getUnlockedProducers(data) {
  return data.producers.filter((producerObj) => {
    if (producerObj.unlocked === true) {
      return producerObj;
    }
  });
}

function makeDisplayNameFromId(id) {
  return id
    .split("_")
    .map((element) => element.charAt(0).toUpperCase() + element.slice(1))
    .join(" ");
}

function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <!--FIX THIS BUG WHEN YOU GET A CHANCE!!!! W THE PIC!!!!! -->
   <!-- <img class='producer-image' src=${producer.image}/> -->
  <div class="producer-column">
 
    <div class="producer-title">${displayName}</div>
    
    <div class='producer-description'>${producer.description}<div>
    
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Cheese/Second: ${producer.cps}</div>
    <div>Cost: ${currentCost} Cheese</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  let producerContainer = document.getElementById("producer_container");

  deleteAllChildNodes(producerContainer);
  unlockProducers(data.producers, data.cheese);

  for (let i = 0; i < data.producers.length; i++) {
    if (data.producers[i].unlocked === true) {
      producerContainer.appendChild(makeProducerDiv(data.producers[i]));
    }
  }
}

function getProducerById(data, producerId) {
  for (let i = 0; i < data.producers.length; i++) {
    if (data.producers[i].id === producerId) {
      return data.producers[i];
    }
  }
}

function canAffordProducer(data, producerId) {
  const checkProducer = getProducerById(data, producerId);
  return data.cheese > checkProducer.price;
}

function updateCPSView(cps) {
  let cpsIndicator = document.getElementById("cps");
  cpsIndicator.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  let producerObj = data.producers.find((element) => {
    return element.id === producerId;
  });
  if (canAffordProducer(data, producerId)) {
    producerObj.qty++;
    data.cheese -= producerObj.price;
    data.totalCPS += producerObj.cps;
    producerObj.price = updatePrice(producerObj.price);
    return true;
  } else {
    return false;
  }
}

function buyButtonClick(event, data) {
  const eventAction = event.target.id
    ? event.target.id.slice(0, 3)
    : "not button";
  if (eventAction === "buy") {
    let producerId = event.target.id.slice(4);
    if (canAffordProducer(data, producerId)) {
      attemptToBuyProducer(data, producerId);
      updateDOMElements(data);
    } else window.alert("Not enough cheese!");
  }
}

function tick(data) {
  data.cheese += data.totalCPS;
  updateCheeseView(data.cheese);
  renderProducers(data);
}

function updateDOMElements(data) {
  renderProducers(data);
  updateCheeseView(data.cheese);
  updateCPSView(data.totalCPS);
}

if (typeof process === "undefined") {
  const data = window.data;

  const bigCheese = document.getElementById("big_cheese");
  bigCheese.addEventListener("click", () => clickCheese(data));

  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  setInterval(() => tick(data), 1000);
} else if (process) {
  module.exports = {
    updateCheeseView,
    clickCheese,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
