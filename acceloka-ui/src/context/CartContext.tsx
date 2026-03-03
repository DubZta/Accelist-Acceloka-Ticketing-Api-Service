"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    kodeTiket: string;
    namaTiket: string;
    kategori: string;
    harga: number;
    quantity: number;
    eventDate: string;
    quota: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (kodeTiket: string) => void;
    updateQuantity: (kodeTiket: string, quantity: number) => void;
    clearCart: () => void;
    totalPrice: number;
    totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('acceloka_cart');
            return saved ? (JSON.parse(saved) as CartItem[]) : [];
        } catch {
            return [];
        }
    });
    const isLoaded = true;

    // Save to localStorage whenever cart changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('acceloka_cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isLoaded]);

    const addToCart = (newItem: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.kodeTiket === newItem.kodeTiket);
            if (existing) {
                // Limit to quota
                const nextQty = Math.min(existing.quantity + newItem.quantity, newItem.quota);
                return prev.map(item =>
                    item.kodeTiket === newItem.kodeTiket
                        ? { ...item, quantity: nextQty }
                        : item
                );
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (kodeTiket: string) => {
        setCartItems(prev => prev.filter(item => item.kodeTiket !== kodeTiket));
    };

    const updateQuantity = (kodeTiket: string, quantity: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item.kodeTiket === kodeTiket
                    ? { ...item, quantity: Math.min(Math.max(1, quantity), item.quota) }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.harga * item.quantity), 0);
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalPrice,
            totalCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
