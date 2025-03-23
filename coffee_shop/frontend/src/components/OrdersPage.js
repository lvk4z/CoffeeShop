import React, { useState, useEffect, useRef } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

// Custom hook do interwału
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval
    }
    console.log(delay);
  }, [delay]);
}

const OrdersPage = () => {
  const [orders, setOrders] = useState(new Map());
  const [userName, setUserName] = useState("");
  console.log("OrdersPage");
  const fetchOrders = () => {
    fetch("/api/get-guest-orders")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.orders || !Array.isArray(data.orders)) {
          throw new Error("Nieprawidłowy format odpowiedzi z API");
        }

        setUserName(data.userName || "Nieznany użytkownik");

        const map = new Map();
        data.orders.forEach((element) => {
          if (element.name) {
            map.set(element.name, (map.get(element.name) || 0) + 1);
          }
        });
        console.log("Pobrane zamówienia:", map);
        setOrders(new Map(map));
      })
      .catch((error) => console.error("Błąd pobierania zamówień:", error));
  };

  useInterval(fetchOrders, 6000); 

  return (
    <div>
      <Typography variant="h4">Zamówione przez: {userName}</Typography>
      <List>
        {Array.from(orders.entries()).map(([order, count]) => (
          <ListItem key={order}>
            <ListItemText primary={`x${count}: ${order}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default OrdersPage;