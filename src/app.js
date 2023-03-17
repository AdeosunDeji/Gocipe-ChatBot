import express from "express";
import path from "path";
import session from "express-session";
import http from "http";
import socketio from "socket.io";
import { formatMessage } from "./utils/messages";
import { userJoin, getCurrentUser } from "./utils/users";


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "mysecretKey",
  resave: false,
  saveUninitialized: true,
}));

const botName = "Go'cipe bot";

const menu = [
  { no: "20", name: "Hamburger", price: "$5.99" },
  { no: "21", name: "Cheeseburger", price: "$6.99" },
  { no: "22",name: "Pizza", price: "$8.99" },
  { no: "23",name: "Pasta", price: "$10.99" },
  { no: "24",name: "Salad", price: "$7.99" },
];

// Run when a client connects
io.on("connection", socket => {
  // Welcome current user
  socket.on("joinChat", ({ username }) => {
    const user = userJoin(socket.id, username);
    socket.emit("message",formatMessage(botName, `<strong>Welcome to Go'cipe ${user.username}!</strong> <br> <br> <br> Select 1 to place an order. <br> Select 99 to checkout order. <br> Select 98 to see order history. <br> Select 97 to see current order. <br> Select 0 to cancel order. `));
  });


  // Listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.emit("message", formatMessage(user.username, msg,));
  }); 

  // Listen for menu request
  socket.on("menu", () => {
  // Send menu as a message to the client
    io.to(socket.id).emit("message", formatMessage(botName, getMenuText()));
  });

  // Listen for order
  socket.on("placeOrder", (order) => {
    io.emit("message", formatMessage(botName, `Your order has been placed: ${order.itemName} - ${order.price}. <br><br> <strong>Choose more items or Enter 99 to checkout, or cancel current order with 0.</strong>`));
  });

  // Function to get menu as formatted text
  function getMenuText() {
    let menuText = "<strong>Our menu today:</strong><br><br> Select the number to place order: <br><br>";
    for (let i = 0; i < menu.length; i++) {
      menuText += `${menu[i].no}. ${menu[i].name} - ${menu[i].price}<br>`;
    }
    return menuText;
  }
});


server.listen(PORT, () => console.log(`App listening at port ${PORT}`));
