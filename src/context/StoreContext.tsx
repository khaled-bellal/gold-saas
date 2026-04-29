import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Sale, Karat, StoreConfig } from "../types";
import { generateId } from "../lib/utils";
import { storage } from "../lib/storage";

interface StoreContextType {
  config: StoreConfig;
  products: Product[];
  sales: Sale[];
  loading: boolean;
  updateGoldPrice: (karat: Karat, price: number) => Promise<void>;
  updateConfig: (config: Partial<StoreConfig>) => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  recordSale: (sale: Omit<Sale, "id" | "timestamp">) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CONFIG: "aurum_config",
  PRODUCTS: "aurum_products",
  SALES: "aurum_sales",
};

const defaultConfig: StoreConfig = {
  ownerEmail: "admin@aurumsaas.com",
  currency: "USD",
  prices: {
    "14K": 45.5,
    "18K": 58.2,
    "22K": 71.1,
    "24K": 77.5,
  },
};

const defaultProducts: Product[] = [
  {
    id: "p1",
    name: "Classic Gold Ring",
    weight: 5.2,
    karat: "18K",
    makingCost: 120,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "p2",
    name: "Elegant 24K Necklace",
    weight: 12.5,
    karat: "24K",
    makingCost: 250,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoreConfig>(() =>
    storage.get(STORAGE_KEYS.CONFIG, defaultConfig)
  );

  const [products, setProducts] = useState<Product[]>(() =>
    storage.get(STORAGE_KEYS.PRODUCTS, defaultProducts)
  );

  const [sales, setSales] = useState<Sale[]>(() =>
    storage.get(STORAGE_KEYS.SALES, [])
  );

  const [loading] = useState(false);

  // ✅ حفظ تلقائي
  useEffect(() => {
    storage.set(STORAGE_KEYS.CONFIG, config);
  }, [config]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.SALES, sales);
  }, [sales]);

  const updateGoldPrice = async (karat: Karat, price: number) => {
    setConfig((prev) => ({
      ...prev,
      prices: { ...prev.prices, [karat]: price },
    }));
  };

  const updateConfig = async (updates: Partial<StoreConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const addProduct = async (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(), // 🔥 مهم
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  
    setProducts((prev) => [newProduct, ...prev]);
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const recordSale = async (saleData: Omit<Sale, "id" | "timestamp">) => {
    const newSale: Sale = {
      ...saleData,
      id: "sale-" + Date.now(),
      timestamp: Date.now(),
    };

    setSales((prev) => [newSale, ...prev]);
  };

  return (
    <StoreContext.Provider
      value={{
        config,
        products,
        sales,
        loading,
        updateGoldPrice,
        updateConfig,
        addProduct,
        deleteProduct,
        recordSale,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};









// import React, { createContext, useContext, useState, useEffect } from "react";
// import { Product, Sale, Karat, StoreConfig } from "../types";
// import { generateId } from "../lib/utils";

// interface StoreContextType {
//   config: StoreConfig;
//   products: Product[];
//   sales: Sale[];
//   loading: boolean;
//   updateGoldPrice: (karat: Karat, price: number) => Promise<void>;
//   updateConfig: (config: Partial<StoreConfig>) => Promise<void>;
//   addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<void>;
//   deleteProduct: (id: string) => Promise<void>;
//   recordSale: (sale: Omit<Sale, "id" | "timestamp">) => Promise<void>;
// }

// const StoreContext = createContext<StoreContextType | undefined>(undefined);

// const STORAGE_KEYS = {
//   CONFIG: "aurum_config",
//   PRODUCTS: "aurum_products",
//   SALES: "aurum_sales",
// };

// const defaultConfig: StoreConfig = {
//   ownerEmail: "admin@aurumsaas.com",
//   currency: "USD",
//   prices: {
//     "14K": 45.5,
//     "18K": 58.2,
//     "22K": 71.1,
//     "24K": 77.5,
//   },
// };

// const defaultProducts: Product[] = [
//   {
//     id: "p1",
//     name: "Classic Gold Ring",
//     weight: 5.2,
//     karat: "18K",
//     makingCost: 120,
//     createdAt: Date.now(),
//     updatedAt: Date.now(),
//   },
//   {
//     id: "p2",
//     name: "Elegant 24K Necklace",
//     weight: 12.5,
//     karat: "24K",
//     makingCost: 250,
//     createdAt: Date.now(),
//     updatedAt: Date.now(),
//   },
//   {
//     id: "p3",
//     name: "Luxury Bracelet",
//     weight: 8.7,
//     karat: "22K",
//     makingCost: 180,
//     createdAt: Date.now(),
//     updatedAt: Date.now(),
//   },
// ];

// function loadFromStorage<T>(key: string, fallback: T): T {
//   try {
//     const raw = localStorage.getItem(key);
//     if (!raw) return fallback;
//     return JSON.parse(raw) as T;
//   } catch {
//     return fallback;
//   }
// }

// function saveToStorage<T>(key: string, value: T) {
//   try {
//     localStorage.setItem(key, JSON.stringify(value));
//   } catch (e) {
//     console.error("Failed to save:", e);
//   }
// }

// export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [config, setConfig] = useState<StoreConfig>(() =>
//     loadFromStorage(STORAGE_KEYS.CONFIG, defaultConfig)
//   );
//   const [products, setProducts] = useState<Product[]>(() =>
//     loadFromStorage(STORAGE_KEYS.PRODUCTS, defaultProducts)
//   );
//   const [sales, setSales] = useState<Sale[]>(() =>
//     loadFromStorage(STORAGE_KEYS.SALES, [])
//   );
//   const [loading] = useState(false);

//   // Persist changes
//   useEffect(() => {
//     saveToStorage(STORAGE_KEYS.CONFIG, config);
//   }, [config]);

//   useEffect(() => {
//     saveToStorage(STORAGE_KEYS.PRODUCTS, products);
//   }, [products]);

//   useEffect(() => {
//     saveToStorage(STORAGE_KEYS.SALES, sales);
//   }, [sales]);

//   const updateGoldPrice = async (karat: Karat, price: number) => {
//     setConfig((prev) => ({
//       ...prev,
//       prices: { ...prev.prices, [karat]: price },
//     }));
//   };

//   const updateConfig = async (updates: Partial<StoreConfig>) => {
//     setConfig((prev) => ({ ...prev, ...updates }));
//   };

//   const addProduct = async (
//     productData: Omit<Product, "id" | "createdAt" | "updatedAt">
//   ) => {
//     const newProduct: Product = {
//       ...productData,
//       id: generateId(),
//       createdAt: Date.now(),
//       updatedAt: Date.now(),
//     };
//     setProducts((prev) => [newProduct, ...prev]);
//   };

//   const deleteProduct = async (id: string) => {
//     setProducts((prev) => prev.filter((p) => p.id !== id));
//   };

//   const recordSale = async (saleData: Omit<Sale, "id" | "timestamp">) => {
//     const newSale: Sale = {
//       ...saleData,
//       id: "sale-" + Date.now(),
//       timestamp: Date.now(),
//     };
//     setSales((prev) => [newSale, ...prev]);
//   };

//   return (
//     <StoreContext.Provider
//       value={{
//         config,
//         products,
//         sales,
//         loading,
//         updateGoldPrice,
//         updateConfig,
//         addProduct,
//         deleteProduct,
//         recordSale,
//       }}
//     >
//       {children}
//     </StoreContext.Provider>
//   );
// };

// export const useStore = () => {
//   const context = useContext(StoreContext);
//   if (!context) throw new Error("useStore must be used within a StoreProvider");
//   return context;
// };