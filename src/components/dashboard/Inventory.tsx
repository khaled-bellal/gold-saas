import React, { useState } from "react";
import { Plus, Search, QrCode, Trash2, Edit3, Camera } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Product, Karat } from "../../types";
import { formatCurrency } from "../../lib/utils";
import { QRCodeSVG } from "qrcode.react";

export const Inventory: React.FC = () => {
  const { products, addProduct, deleteProduct, config } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    weight: 0,
    karat: "18K" as Karat,
    makingCost: 0,
    description: "",
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.includes(searchTerm)
  );

  const calculatePrice = (weight: number, karat: Karat, makingCost: number) => {
    const goldPricePerGram = config.prices[karat];
    return weight * goldPricePerGram + makingCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct(newProduct);
    setIsAdding(false);
    setNewProduct({ name: "", weight: 0, karat: "18K", makingCost: 0, description: "" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products, ID, or scan..."
            className="input-field w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="secondary-button flex items-center gap-2 flex-1 sm:flex-none justify-center">
            <Camera size={18} />
            <span>Scan QR</span>
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="gold-button flex items-center gap-2 flex-1 sm:flex-none justify-center"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-8 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">New Inventory Item</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="text-white/50 hover:text-white"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/50">Product Name</label>
                <input
                  required
                  type="text"
                  className="input-field w-full"
                  placeholder="e.g. Wedding Band"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/50">
                    Weight (grams)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    className="input-field w-full"
                    value={newProduct.weight || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        weight: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/50">Karat</label>
                  <select
                    className="input-field w-full"
                    value={newProduct.karat}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, karat: e.target.value as Karat })
                    }
                  >
                    <option value="14K">14K</option>
                    <option value="18K">18K</option>
                    <option value="22K">22K</option>
                    <option value="24K">24K</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/50">
                  Making Cost ({config.currency})
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  className="input-field w-full"
                  value={newProduct.makingCost || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      makingCost: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="p-4 rounded-lg bg-gold/10 border border-gold/20">
                <p className="text-xs text-gold uppercase tracking-widest mb-1">
                  Estimated Selling Price
                </p>
                <p className="text-2xl font-bold text-gold">
                  {formatCurrency(
                    calculatePrice(
                      newProduct.weight,
                      newProduct.karat,
                      newProduct.makingCost
                    )
                  )}
                </p>
              </div>

              <button type="submit" className="gold-button w-full">
                Save to Inventory
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 animate-fade-in">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="bg-white p-4 rounded-xl shadow-2xl">
                <QRCodeSVG
                  value={selectedProduct.id}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <p className="text-white/50 font-mono text-sm mt-1">
                  ID: {selectedProduct.id}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full border-y border-white/5 py-6">
                <div className="text-center">
                  <p className="text-xs text-white/30 uppercase tracking-widest">Weight</p>
                  <p className="font-bold">{selectedProduct.weight}g</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/30 uppercase tracking-widest">Karat</p>
                  <p className="font-bold">{selectedProduct.karat}</p>
                </div>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="secondary-button flex-1"
                >
                  Close
                </button>
                <button className="gold-button flex-1" onClick={() => window.print()}>
                  Print Label
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full glass-card p-10 text-center text-white/40">
            No products found. Add your first item to get started.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass-card group overflow-hidden hover:border-gold/30 transition-all"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-xs font-mono text-white/30">{product.id}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-white/5 border border-white/10 uppercase">
                    {product.karat}
                  </span>
                </div>

                <div className="flex items-center gap-6 py-4 border-y border-white/5">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">
                      Weight
                    </p>
                    <p className="font-medium">{product.weight}g</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">
                      Price
                    </p>
                    <p className="font-bold text-gold">
                      {formatCurrency(
                        calculatePrice(product.weight, product.karat, product.makingCost)
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="p-2 rounded-lg bg-surface-top hover:bg-gold hover:text-black transition-all flex-1 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <QrCode size={16} />
                    QR Code
                  </button>
                  <button className="p-2 rounded-lg bg-surface-top hover:bg-white/10 transition-all text-white/50 hover:text-white">
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg bg-surface-top hover:bg-red-500/20 text-white/30 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};