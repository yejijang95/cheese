function updateCoffeeView(coffeeQty) {
  let coffeeCounter = document.getElementById("coffee_counter");

  coffeeCounter.innerText = coffeeQty;

  return coffeeCounter.innerText;
}

function clickCoffee(data) {
  data.coffee++;
  renderProducers(data);

  return updateCoffeeView(data.coffee);
}

function unlockProducers(producers, coffeeCount) {
  for (let i = 0; i < producers.length; i++) {
    if (coffeeCount >= producers[i].price / 2) {
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
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
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
  unlockProducers(data.producers, data.coffee);

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
  return data.coffee > checkProducer.price;
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
    data.coffee -= producerObj.price;
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
    } else window.alert("Not enough coffee!");
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

function updateDOMElements(data) {
  renderProducers(data);
  updateCoffeeView(data.coffee);
  updateCPSView(data.totalCPS);
}

if (typeof process === "undefined") {
  const data = window.data;

  const bigCoffee = document.getElementById("big_cheese");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  setInterval(() => tick(data), 1000);
} else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
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
