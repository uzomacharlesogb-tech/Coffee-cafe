import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

const ordersCollection = collection(db, "orders");

// Create a new order
export const createOrder = async (order) => {
  const docRef = await addDoc(ordersCollection, {
    ...order,
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
};

// Get orders belonging to one user
export const getUserOrders = async (userId) => {
  const ordersQuery = query(
    ordersCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

// Cancel an order
export const cancelOrder = async (orderId) => {
  const orderRef = doc(db, "orders", orderId);

  await updateDoc(orderRef, {
    status: "Cancelled",
  });
};