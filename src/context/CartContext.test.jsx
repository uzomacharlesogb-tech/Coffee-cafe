import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with an empty cart", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);
  });

  it("adds a product to the cart", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    const product = {
      id: 1,
      name: "Cappuccino",
      price: 3500,
      category: "Hot Coffee",
      image: "☕",
    };

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].name).toBe("Cappuccino");
    expect(result.current.cartItems[0].quantity).toBe(1);
    expect(result.current.cartCount).toBe(1);
    expect(result.current.cartTotal).toBe(3500);
  });

  it("increases quantity when the same product is added again", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    const product = {
      id: 1,
      name: "Cappuccino",
      price: 3500,
      category: "Hot Coffee",
      image: "☕",
    };

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(2);
    expect(result.current.cartCount).toBe(2);
    expect(result.current.cartTotal).toBe(7000);
  });
});
