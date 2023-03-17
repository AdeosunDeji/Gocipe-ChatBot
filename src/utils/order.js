const orders = [];

function orderJoin(id, orderName) {
  const order = { id, orderName };

  orders.push(order);
  return order;
}

function getCurrentOrder(id) {
  return orders.find(order => order.id === id);
}

export { 
  orderJoin, 
  getCurrentOrder
};