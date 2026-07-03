import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Session,
  CartItem,
  Order,
  Language,
  Product,
  Modifier,
  Establishment,
  PointOfSale,
} from "@/types";

interface StoreState {
  // Session
  session: Session | null;
  setSession: (session: Session | null) => void;
  
  // Establishment
  establishment: Establishment | null;
  setEstablishment: (establishment: Establishment | null) => void;
  
  // Language
  language: Language;
  setLanguage: (language: Language) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  
  // Orders
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: number, status: string) => void;
  
  // Location
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  
  // Points of Sale
  nearbyPOS: PointOfSale[];
  setNearbyPOS: (pos: PointOfSale[]) => void;
  selectedPOS: PointOfSale | null;
  setSelectedPOS: (pos: PointOfSale | null) => void;
  
  // UI State
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Session
      session: null,
      setSession: (session) => set({ session }),
      
      // Establishment
      establishment: null,
      setEstablishment: (establishment) => set({ establishment }),
      
      // Language
      language: "es",
      setLanguage: (language) => set({ language }),
      
      // Cart
      cart: [],
      addToCart: (item) =>
        set((state) => {
          // Check if product already exists in cart
          const existingIndex = state.cart.findIndex(
            (cartItem) =>
              cartItem.product.id === item.product.id &&
              JSON.stringify(cartItem.selectedModifiers) ===
                JSON.stringify(item.selectedModifiers) &&
              cartItem.notes === item.notes
          );

          if (existingIndex >= 0) {
            // Update quantity
            const newCart = [...state.cart];
            newCart[existingIndex].quantity += item.quantity;
            newCart[existingIndex].subtotal =
              parseFloat(item.product.price) *
              newCart[existingIndex].quantity +
              item.selectedModifiers.reduce(
                (sum, mod) => sum + parseFloat(mod.price) * newCart[existingIndex].quantity,
                0
              );
            return { cart: newCart };
          } else {
            // Add new item
            return { cart: [...state.cart, item] };
          }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      updateCartItemQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.product.id === productId) {
              const newQuantity = Math.max(0, quantity);
              const subtotal =
                parseFloat(item.product.price) * newQuantity +
                item.selectedModifiers.reduce(
                  (sum, mod) => sum + parseFloat(mod.price) * newQuantity,
                  0
                );
              return { ...item, quantity: newQuantity, subtotal };
            }
            return item;
          }).filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ cart: [] }),
      
      // Orders
      orders: [],
      setOrders: (orders) => set({ orders }),
      addOrder: (order) =>
        set((state) => ({ orders: [...state.orders, order] })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status: status as any } : order
          ),
        })),
      
      // Location
      userLocation: null,
      setUserLocation: (location) => set({ userLocation: location }),
      
      // Points of Sale
      nearbyPOS: [],
      setNearbyPOS: (pos) => set({ nearbyPOS: pos }),
      selectedPOS: null,
      setSelectedPOS: (pos) => set({ selectedPOS: pos }),
      
      // UI State
      isMenuOpen: false,
      setIsMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
      isCartOpen: false,
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    }),
    {
      name: "restaurant-storage",
      partialize: (state) => ({
        session: state.session,
        language: state.language,
        cart: state.cart,
        orders: state.orders,
        userLocation: state.userLocation,
      }),
    }
  )
);
