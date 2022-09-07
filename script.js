/* eslint-disable no-alert */

// 🐶 Your Grade: 35/49
// Two points for each test spec.
// One point for passing test and one for functional application.

/**************
 *   SLICE 1
 **************/

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

/**************
 *   SLICE 2
 **************/

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

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
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
  //whoops - not sure what i could do to make this appear on the site :'(
}

/**************
 *   SLICE 3
 **************/

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

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_cheese");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
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
