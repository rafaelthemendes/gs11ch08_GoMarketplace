import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

async function persistProducts(products: Product[]): Promise<void> {
  return AsyncStorage.setItem(
    '@GoMarketplace:cartProducts',
    JSON.stringify(products),
  );
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storedProducts = await AsyncStorage.getItem(
        '@GoMarketplace:cartProducts',
      );
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      const updatedProducts = products.map(product => {
        if (product.id === id) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });

      await persistProducts(updatedProducts);
      setProducts(updatedProducts);
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const updatedProducts = products
        .map(product => {
          if (product.id === id) {
            return { ...product, quantity: product.quantity - 1 };
          }
          return product;
        })
        .filter(product => product.quantity > 0);

      await persistProducts(updatedProducts);
      setProducts(updatedProducts);
    },
    [products],
  );

  const addToCart = useCallback(
    async product => {
      const productIndex = products.findIndex(item => item.id === product.id);

      if (productIndex !== -1) {
        await increment(product.id);
        return;
      }

      const newProducts = [...products, { ...product, quantity: 1 }];

      await persistProducts(newProducts);
      setProducts(newProducts);
    },
    [products, increment],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
