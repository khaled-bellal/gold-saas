import React, { useState } from "react";
import QRScanner from "../QRScanner";
import { ShoppingCart } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Product } from "../../types";
import { formatCurrency } from "../../lib/utils";

export const Sales: React.FC = () => {
  const { products, recordSale, config } = useStore();

  const [cart, setCart] = useState<Product[]>([]);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  // 🔍 scan → preview
  const handleScan = (qrCode: string) => {
    const product = products.find((p) => p.id === qrCode);

    if (!product) {
      alert("Product not found ❌");
      return;
    }

    setPreviewProduct(product);
    setShowScanner(false);
  };

  // ✅ confirm → cart
  const confirmProduct = () => {
    if (!previewProduct) return;

    setCart((prev) => [previewProduct, ...prev]);
    setPreviewProduct(null);
  };

  // ❌ cancel preview
  const cancelPreview = () => {
    setPreviewProduct(null);
  };

  // 🗑 remove
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  // 💰 total
  const totalPrice = cart.reduce((sum, p) => {
    return sum + (p.weight * config.prices[p.karat] + p.makingCost);
  }, 0);

  // 🧾 checkout

  const handleCheckout = async () => {
    if (cart.length === 0) return;
  
    await recordSale({
      productId: "multi",
      productName: '${cart.length} items',
      finalPrice: totalPrice,
      discount: 0,
      paymentMethod: "CASH",
      customerName: "",
      customerPhone: "",
      staffId: "staff-1",
    });
  
    alert("Sale completed ✅");
    setCart([]);
  };
  // const handleCheckout = async () => {
  //   if (cart.length === 0) return;

  //   await recordSale({
  //     productId: "multi",
  //     productName: '${cart.length} items',
  //     finalPrice: totalPrice,
  //     discount: 0,
  //     paymentMethod: "CASH",
  //     customerName: "",
  //     customerPhone: "",
  //     staffId: "staff-1",
  //   });

  //   alert("Sale completed ✅");
  //   setCart([]);
  // };

  return (
    <div className="p-6 space-y-4">

      {/* 🔘 Scan */}
      <button
        onClick={() => setShowScanner(true)}
        className="w-full bg-yellow-500 text-black py-3 rounded font-bold"
      >
        Scan Product (QR)
      </button>

      {/* 📷 Scanner */}
      {showScanner && (
        <div className="bg-black p-4 rounded">
          <QRScanner onScan={handleScan} />
        </div>
      )}

      {/* 👁 Preview */}
      {previewProduct && (
        <div className="bg-white/5 p-4 rounded space-y-3 border border-yellow-500">
          <h2 className="text-lg font-bold">{previewProduct.name}</h2>

          <p>
            {previewProduct.weight}g | {previewProduct.karat}
          </p>

          <p>
            {formatCurrency(
              previewProduct.weight *
                config.prices[previewProduct.karat] +
                previewProduct.makingCost
            )}
          </p>

          <div className="flex gap-2">
            <button
              onClick={confirmProduct}
              className="flex-1 bg-green-500 py-2 rounded"
            >
              Confirm
            </button>

            <button
              onClick={cancelPreview}
              className="flex-1 bg-red-500 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 🛒 Cart */}
      {cart.length > 0 && (
        <div className="space-y-3">

          {cart.map((p) => {
            const price =
              p.weight * config.prices[p.karat] + p.makingCost;

            return (
              <div
                key={p.id}
                className="bg-white/5 p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-sm text-white/40">
                    {formatCurrency(price)}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(p.id)}
                  className="text-red-400 text-sm"
                >
                  Remove
                </button>
              </div>
            );
          })}

{/* total */}
          <div className="bg-white/10 p-4 rounded flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>

          {/* checkout */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 py-3 rounded font-bold"
          >
            Complete Sale
          </button>
        </div>
      )}

      {/* empty */}
      {!previewProduct && cart.length === 0 && (
        <div className="flex flex-col items-center justify-center h-60 text-white/30">
          <ShoppingCart size={40} />
          <p>No product selected</p>
        </div>
      )}
    </div>
  );
};


// import React, { useState } from "react";
// import QRScanner from "../QRScanner";
// import {
//   Search,
//   ShoppingCart,
//   User,
//   CreditCard,
//   Wallet,
//   Banknote,
//   CheckCircle2,
// } from "lucide-react";
// import { useStore } from "../../context/StoreContext";
// import { Product } from "../../types";
// import { formatCurrency, cn } from "../../lib/utils";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// type PaymentMethod = "CASH" | "CARD" | "TRANSFER" | "BINANCE";

// export const Sales: React.FC = () => {
//   const { products, recordSale, config } = useStore();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [discount, setDiscount] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
//   const [customer, setCustomer] = useState({ name: "", phone: "" });
//   const [isSuccess, setIsSuccess] = useState(false);

//   //QRScanner

//   const [scannedProduct, setScannedProduct] = useState(null);
//   const [showScanner, setShowScanner] = useState(false);

//   const handleScan = (qrCode: string) => {
//     const product = products.find((p) => p.id === qrCode);
  
//     if (product) {
//       setScannedProduct(product);
//       setShowScanner(false);
//     } else {
//       alert("Product not found");
//     }
//   };

//   const filteredProducts = products.filter(
//     (p) =>
//       p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.id.includes(searchTerm)
//   );

//   const calculateBasePrice = (product: Product) => {
//     return product.weight * config.prices[product.karat] + product.makingCost;
//   };

//   const calculateFinalPrice = () => {
//     if (!selectedProduct) return 0;
//     return Math.max(0, calculateBasePrice(selectedProduct) - discount);
//   };

//   const handleCompleteSale = async () => {
//     if (!selectedProduct) return;

//     await recordSale({
//       productId: selectedProduct.id,
//       productName: selectedProduct.name,
//       finalPrice: calculateFinalPrice(),
//       discount,
//       paymentMethod,
//       customerName: customer.name,
//       customerPhone: customer.phone,
//       staffId: "admin-1",
//     });

//     generateInvoice();
//     setIsSuccess(true);
//     setTimeout(() => {
//       setIsSuccess(false);
//       setSelectedProduct(null);
//       setDiscount(0);
//       setCustomer({ name: "", phone: "" });
//     }, 3000);
//   };

//   const generateInvoice = () => {
//     if (!selectedProduct) return;
//     const doc = new jsPDF();

//     // Header
//     doc.setFontSize(22);
//     doc.setTextColor(212, 175, 55);
//     doc.text("AURUM GOLD SAAS", 105, 20, { align: "center" });
//     doc.setFontSize(10);
//     doc.setTextColor(100, 100, 100);
//     doc.text("Premium Jewelry Solutions", 105, 27, { align: "center" });

//     // Invoice Info
//     doc.setFontSize(11);
//     doc.setTextColor(0, 0, 0);
//     doc.text(`Invoice #: INV-${Date.now().toString().slice(-6)}`, 20, 45);
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 52);

//     // Customer
//     if (customer.name) {
//       doc.text("Customer Details:", 140, 45);
//       doc.text(`Name: ${customer.name}`, 140, 52);
//       if (customer.phone) doc.text(`Phone: ${customer.phone}`, 140, 59);
//     }

//     // Table
//     const finalPrice = calculateFinalPrice();
//     const basePrice = calculateBasePrice(selectedProduct);

//     autoTable(doc, {
//       startY: 70,
//       head: [["Description", "Karat", "Weight", "Base Price", "Discount", "Total"]],
//       body: [
//         [
//           selectedProduct.name,
//           selectedProduct.karat,
//           `${selectedProduct.weight}g`,
//           formatCurrency(basePrice),
//           formatCurrency(discount),
//           formatCurrency(finalPrice),
//         ],
//       ],
//       theme: "striped",
//       headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0] },
//     });

//     // Total
//     const finalY = (doc as any).lastAutoTable.finalY || 100;
//     doc.setFontSize(14);
//     doc.setFont("helvetica", "bold");
//     doc.text(`Total Amount: ${formatCurrency(finalPrice)}`, 190, finalY + 20, {
//       align: "right",
//     });

//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");
//     doc.text("Payment Method: " + paymentMethod, 20, finalY + 20);
//     doc.text("Thank you for choosing Aurum SaaS!", 105, finalY + 40, {
//       align: "center",
//     });

//     doc.save(`invoice_${selectedProduct.id}.pdf`);
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//       {/* Selection Area */}
//       <div className="space-y-6">
//         <h3 className="text-xl font-bold">New Sale</h3>
//         <div className="relative">
//           <Search
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
//             size={18}
//           />
//           <input
//             type="text"
//             placeholder="Scan QR or search product name..."
//             className="input-field w-full pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="glass-card max-h-[600px] overflow-auto divide-y divide-white/5">
//           {filteredProducts.length === 0 ? (
//             <div className="p-10 text-center text-white/30">No products found.</div>
//           ) : (
//             filteredProducts.map((p) => (
//               <button
//                 key={p.id}
//                 onClick={() => setSelectedProduct(p)}
//                 className={cn(
//                   "w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-all group",
//                   selectedProduct?.id === p.id && "bg-gold/10 border-l-4 border-l-gold"
//                 )}
//               >
//                 <div>
//                   <p className="font-semibold text-lg">{p.name}</p>
//                   <p className="text-xs text-white/30 font-mono italic">
//                     {p.karat} • {p.weight}g
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-gold group-hover:scale-110 transition-transform">
//                     {formatCurrency(calculateBasePrice(p))}
//                   </p>
//                   <p className="text-[10px] uppercase text-white/30">Base Price</p>
//                 </div>
//               </button>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Checkout Area */}
//       <div className="space-y-6">
//         {selectedProduct ? (
//           <div className="glass-card p-8 space-y-8 sticky top-24">
//             <div className="flex justify-between items-start">
//               <div>
//                 <span className="text-[10px] uppercase tracking-widest text-gold mb-1 block">
//                   Checkout Summary
//                 </span>
//                 <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
//                 <p className="text-white/50">
//                   {selectedProduct.karat} Gold • {selectedProduct.weight}g
//                 </p>
//               </div>
//               <ShoppingCart size={32} className="text-white/10" />
//             </div>

//             <div className="space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-xs font-medium text-white/30 uppercase tracking-widest">
//                     Customer Name
//                   </label>
//                   <input
//                     type="text"
//                     className="input-field w-full"
//                     placeholder="Optional"
//                     value={customer.name}
//                     onChange={(e) =>
//                       setCustomer({ ...customer, name: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-xs font-medium text-white/30 uppercase tracking-widest">
//                     Discount ({config.currency})
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     className="input-field w-full"
//                     value={discount || ""}
//                     onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <label className="text-xs font-medium text-white/30 uppercase tracking-widest">
//                   Payment Method
//                 </label>
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                   {[
//                     { id: "CASH" as const, icon: Banknote },
//                     { id: "CARD" as const, icon: CreditCard },
//                     { id: "TRANSFER" as const, icon: Wallet },
//                     { id: "BINANCE" as const, icon: User },
//                   ].map((method) => (
//                     <button
//                       key={method.id}
//                       onClick={() => setPaymentMethod(method.id)}
//                       className={cn(
//                         "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all text-[10px] font-bold uppercase",
//                         paymentMethod === method.id
//                           ? "bg-gold border-gold text-black"
//                           : "bg-surface-top border-white/5 text-white/50 hover:bg-white/5"
//                       )}
//                     >
//                       <method.icon size={16} />
//                       {method.id}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-white/5 pt-8 space-y-4">
//               <div className="flex justify-between text-white/50 text-sm">
//                 <span>Subtotal</span>
//                 <span>{formatCurrency(calculateBasePrice(selectedProduct))}</span>
//               </div>
//               <div className="flex justify-between text-white/50 text-sm">
//                 <span>Discount</span>
//                 <span className="text-red-500">-{formatCurrency(discount)}</span>
//               </div>
//               <div className="flex justify-between text-xl font-bold pt-2">
//                 <span>Total Due</span>
//                 <span className="text-gold">{formatCurrency(calculateFinalPrice())}</span>
//               </div>
//             </div>

//             {isSuccess ? (
//               <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 text-green-500 animate-fade-in">
//                 <CheckCircle2 size={24} />
//                 <span className="font-semibold text-sm">
//                   Sale Recorded & Invoice Generated!
//                 </span>
//               </div>
//             ) : (
//               <button
//                 onClick={handleCompleteSale}
//                 className="gold-button w-full py-4 text-lg"
//               >
//                 Complete Transaction
//               </button>
//             )}

//             <button
//               onClick={() => setSelectedProduct(null)}
//               className="w-full text-center text-xs text-white/30 hover:text-white transition-colors"
//             >
//               Cancel Transaction
//             </button>
//           </div>
//         ) : (
//           <div className="glass-card p-10 h-full flex flex-col items-center justify-center text-center space-y-4 border-dashed">
//             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20">
//               <ShoppingCart size={40} />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold">No Product Selected</h3>
//               <p className="text-sm text-white/30 max-w-[240px] mx-auto mt-1">
//                 Scan a QR code or pick a product from the inventory to start a sale.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };