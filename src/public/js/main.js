/* eslint-disable no-empty */
const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");

const socket = io();
const botName = "Go'cipe bot";

// Get username
const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

let orderList = [];
let checkedOut = [];

// Join chat
socket.emit("joinChat", { username });

// Message from server
socket.on("message", message => {
  outputMessage(message);

  // Scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight;
});


// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Functionality
  if (msg === "1") {
    socket.emit("chatMessage", msg);
    socket.emit("menu");
  }
  else if (msg === "20") {
    socket.emit("chatMessage", msg);
    const order = {
      itemNo: "20",
      itemName: "Hamburger",
      price: "5.99"
    };
    orderList.push(order);
    socket.emit("placeOrder", order);
  }
  else if (msg === "21") {
    socket.emit("chatMessage", msg);
    const order = {
      itemNo: "20",
      itemName: "Cheeseburger",
      price: "6.99"
    };
    orderList.push(order);
    socket.emit("placeOrder", order);
  }
  else if (msg === "22") {
    socket.emit("chatMessage", msg);
    const order = {
      itemNo: "20",
      itemName: "Pizza",
      price: "8.99"
    };
    orderList.push(order);
    socket.emit("placeOrder", order);
  }
  else if (msg === "23") {
    socket.emit("chatMessage", msg);
    const order = {
      itemNo: "20",
      itemName: "Pasta",
      price: "10.99"
    };
    orderList.push(order);
    socket.emit("placeOrder", order);
  }
  else if (msg === "24") {
    socket.emit("chatMessage", msg);
    const order = {
      itemNo: "20",
      itemName: "Salad",
      price: "7.99"
    };
    orderList.push(order);
    socket.emit("placeOrder", order);
  }
  else if (msg === "97") {
    socket.emit("chatMessage", msg);
    setTimeout(() => {
      if (orderList.length === 0 ) {
        outputMessage({ username: botName, time: `${formatTime(new Date())}`, text: "<strong>Your cart is empty. Select 1 to place an order.</strong>"});
      } else {
        const orderListString = orderList.map(order => `${order.itemName} - ${order.price}`).join("<br>");
        outputMessage({ username: botName, time: `${formatTime(new Date())}`, text: `Your order list: <br> ${JSON.stringify(orderListString)}. <br> <strong>Reply with 99 to checkout or Select 1 to place an order.</strong>`});
      }  
    }, 100);
    
  }
  else if (msg === "0") {
    socket.emit("chatMessage", msg);
    setTimeout(() => {
      outputMessage({ username: botName, time: `${formatTime(new Date())}`, text: "<strong>You have no order. <br><br> Select 1 to place an order.</strong>"});
      orderList = [];
    }, 100);
  }
  else if (msg === "99") {
    socket.emit("chatMessage", msg);
    setTimeout(() => {
      let total = 0;
      for (let i = 0; i < orderList.length; i++) {
        total += Number(orderList[i].price);
      }
      checkedOut.push(orderList);
      orderList = [];
      outputMessage({ username: botName, time: `${formatTime(new Date())}`, text: `<strong>Checkout order is: ${total}</strong>`});
    }, 100);
  } 
  else if (msg === "98") {
    socket.emit("chatMessage", msg);
    setTimeout(() => {
      const history = checkedOut.map((order, index) => {
        const items = order.map(item => `${item.itemName} (${item.price})`).join(", ");
        return `Order ${index+1}: ${items}`;
      }).join("<br><br>");
      outputMessage({ username: botName, time: `${formatTime(new Date())}`, text: `<strong>Your order history: <br> ${history}</strong>`});
    }, 100); 
  } else {
    // Handle any other input
    outputMessage({ username: botName, time: `${formatTime(new Date())}`, text: "<strong>I do not understand your request. Input the right number.</strong>" });
  }
  

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});


function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");

  if (message.username === botName) {
    div.classList.add("bot");
  } else {
    div.classList.add("user");
  }

  div.innerHTML = `<p class="meta"> ${message.username} <span>${message.time}</span></p>
  <p class="text"> ${message.text} </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}


function formatTime(date) {
  const hours = date.getHours() % 12 || 12;
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const ampm = hours >= 12 ? "am" : "pm";
  return `${hours}:${minutes} ${ampm}`;
}

document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave?");
  if (leaveRoom) {
    window.location = "../index.html";
  } else {
  }
});



