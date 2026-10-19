import React, { useState, useEffect } from 'react';
import { vehicleStorage } from '../../services/vehicleStorage';
import { salesService } from '../../services/salesService';
import { settingsService } from '../../services/settingsService';
import {
  Car,
  ShoppingCart,
  Search,
  User,
  Phone,
  DollarSign,
  Printer,
  Share2,
  CheckCircle2,
  Sparkles,
  Tag,
  FileText,
  ShieldCheck,
  Percent,
  X,
  Plus,
  Minus,
  Trash2,
  Barcode,
  Heart,
  CreditCard,
  Building,
  RotateCcw,
} from 'lucide-react';
import { ThermalReceipt80mm } from '../../components/printing/ThermalReceipt80mm';
import { Pagination } from '../../components/ui';
import { useToast } from '../../context/ToastContext';

const BRANDS = [
  'All Brands',
  'Toyota',
  'Honda',
  'Suzuki',
  'Kia',
  'Hyundai',
  'Changan',
  'MG',
  'Spare Parts & Detailing',
];

// Additional Automotive Spare Parts & Accessories inventory items for high-volume POS sales
const POS_CATALOG_ITEMS = [
  {
    id: 'PART-001',
    name: 'ASSAMBLE Panel (Front Grille)',
    brand: 'Toyota',
    category: 'Spare Parts & Detailing',
    stock: 2,
    price: 1750,
    sku: 'CG125-SELF',
    type: 'PART',
  },
  {
    id: 'PART-002',
    name: 'ASSAMBLE Panel LED Unit',
    brand: 'Honda',
    category: 'Spare Parts & Detailing',
    stock: 4,
    price: 1000,
    sku: 'PRIDER',
    type: 'PART',
  },
  {
    id: 'PART-003',
    name: 'BACK LIT COMPLETE LAMP',
    brand: 'Suzuki',
    category: 'Spare Parts & Detailing',
    stock: 4,
    price: 350,
    sku: 'UNION-STAR',
    type: 'PART',
  },
  {
    id: 'PART-004',
    name: 'Brake Pad Set OEM (Ceramic)',
    brand: 'Toyota',
    category: 'Spare Parts & Detailing',
    stock: 8,
    price: 4500,
    sku: 'BRK-PAD-01',
    type: 'PART',
  },
  {
    id: 'PART-005',
    name: 'Ceramic 9H Coating & Detail Kit',
    brand: 'Spare Parts & Detailing',
    category: 'Spare Parts & Detailing',
    stock: 12,
    price: 6500,
    sku: 'CERAMIC-9H',
    type: 'PART',
  },
];

export const POSTerminalPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [searchTerm, setSearchTerm] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash'); // Cash | Online | Credit
  const [favorites, setFavorites] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Customer Form
  const [customer, setCustomer] = useState({
    name: 'Walk-in Customer',
    phone: '',
    cnic: '',
    mechanicName: '',
  });

  const [discount, setDiscount] = useState('0');
  const [amountPaid, setAmountPaid] = useState('');
  const [completedSale, setCompletedSale] = useState(null);
  const [settings, setSettings] = useState(settingsService.getSettings());

  const { showToast } = useToast();

  const loadStock = () => {
    const all = vehicleStorage.getAllVehicles();
    const activeCars = all.filter((v) => ['Available', 'Reserved'].includes(v.status));
    setVehicles(activeCars);
    setSettings(settingsService.getSettings());
  };

  useEffect(() => {
    loadStock();
    const handleUpdate = () => loadStock();
    window.addEventListener('ahsan_inventory_updated', handleUpdate);
    return () => window.removeEventListener('ahsan_inventory_updated', handleUpdate);
  }, []);

  // Combine vehicles and parts into POS catalog
  const catalog = [
    ...vehicles.map((v) => ({
      id: `VEH-${v.id}`,
      vehicleId: v.id,
      name: `${v.make} ${v.model} (${v.variant || ''})`,
      brand: v.make,
      regNo: v.registrationNo,
      stock: 1,
      price: Number(v.demandPrice || v.costPrice || 0),
      sku: v.stockCode || `STK-${v.id}`,
      type: 'VEHICLE',
      vehicle: v,
    })),
    ...POS_CATALOG_ITEMS,
  ];

  // Add Item to Cart (Handles multiple products)
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.id === product.id);
      if (existingIdx !== -1) {
        // Increment QTY if part; if vehicle, only 1 allowed
        if (product.type === 'VEHICLE') {
          showToast('info', `${product.name} is already in the cart.`, 'Vehicle in Cart');
          return prevCart;
        }
        const updated = [...prevCart];
        updated[existingIdx].qty += 1;
        return updated;
      } else {
        return [...prevCart, { ...product, qty: 1, foc: 0 }];
      }
    });
    showToast('success', `Added ${product.name} to cart!`, 'Cart Updated');
  };

  // Quantity Controls
  const handleUpdateQty = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscount('0');
    setAmountPaid('');
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountNum = Number(discount || 0);
  const total = Math.max(0, subtotal - discountNum);
  const paidNum = amountPaid !== '' ? Number(amountPaid) : total;
  const balance = Math.max(0, total - paidNum);

  // Filter Catalog
  const filteredCatalog = catalog.filter((item) => {
    const matchesBrand = selectedBrand === 'All Brands' || item.brand.toLowerCase() === selectedBrand.toLowerCase() || (selectedBrand === 'Spare Parts & Detailing' && item.type === 'PART');
    const term = (searchTerm || brandSearch).toLowerCase().trim();
    const matchesSearch =
      !term ||
      item.name.toLowerCase().includes(term) ||
      item.sku.toLowerCase().includes(term) ||
      item.brand.toLowerCase().includes(term) ||
      (item.regNo && item.regNo.toLowerCase().includes(term));

    return matchesBrand && matchesSearch;
  });

  const totalCatalogPages = Math.ceil(filteredCatalog.length / pageSize) || 1;
  const paginatedCatalog = filteredCatalog.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle Checkout
  const handleCheckout = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('error', 'Cart is empty. Please add items to proceed.', 'Empty Cart');
      return;
    }

    try {
      // Find any vehicle in the cart to trigger vehicle sale transaction
      const vehicleItem = cart.find((i) => i.type === 'VEHICLE');

      let saleRecord = null;
      if (vehicleItem) {
        saleRecord = salesService.executeSaleTransaction({
          vehicleId: vehicleItem.vehicleId,
          salePrice: vehicleItem.price,
          discount: discountNum,
          additionalCharges: 0,
          amountReceived: paidNum,
          paymentMethod: paymentMode === 'Cash' ? 'Cash in Hand' : paymentMode === 'Online' ? 'Meezan Bank Transfer' : 'Credit / Token Advance',
          accountDepositedTo: paymentMode === 'Online' ? 'Meezan Bank Current A/C' : 'Cash in Hand (Counter)',
          buyer: {
            name: customer.name,
            phone: customer.phone || '03001234567',
            cnic: customer.cnic || '',
          },
          witnesses: {},
          commission: {
            showroomType: 'FIXED',
            showroomValue: 0,
            brokerName: '',
            brokerType: 'FIXED',
            brokerValue: 0,
          },
          notes: `POS Quick Sale Order • Mode: ${paymentMode}`,
        });
      }

      const receiptSaleData = {
        id: saleRecord?.id || `BILL-${Math.floor(Math.random() * 900) + 100}`,
        invoiceNo: saleRecord?.id || `BILL-${Math.floor(Math.random() * 900) + 100}`,
        saleDate: new Date().toLocaleDateString('en-GB'),
        buyer: { name: customer.name, phone: customer.phone, cnic: customer.cnic },
        customer: { name: customer.name, phone: customer.phone, cnic: customer.cnic },
        vehicleSummary: cart.map((c) => `${c.name} (x${c.qty})`).join(', '),
        salePrice: subtotal,
        discount: discountNum,
        netSalePrice: total,
        amountReceived: paidNum,
        remainingBalance: balance,
        paymentMethod: paymentMode,
      };

      setCompletedSale(receiptSaleData);
      showToast('success', `Order ${receiptSaleData.id} completed successfully!`, 'Payment Received');
      loadStock();
    } catch (err) {
      showToast('error', err.message || 'Transaction failed', 'Error');
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleWhatsAppReceipt = () => {
    if (!completedSale) return;
    const text = encodeURIComponent(
      `*AHSAN AUTOS - SALE RECEIPT*\n` +
      `----------------------------------------\n` +
      `Bill #: ${completedSale.id}\n` +
      `Date: ${completedSale.saleDate}\n` +
      `Customer: ${completedSale.buyer?.name}\n` +
      `Items: ${completedSale.vehicleSummary}\n` +
      `----------------------------------------\n` +
      `Total Amount: Rs ${completedSale.netSalePrice.toLocaleString()}\n` +
      `Amount Paid: Rs ${completedSale.amountReceived.toLocaleString()}\n` +
      `Balance: Rs ${completedSale.remainingBalance.toLocaleString()}\n` +
      `Payment Mode: ${completedSale.paymentMethod}\n` +
      `----------------------------------------\n` +
      `Thank you for shopping at Ahsan Autos!\n` +
      `TikTok: ${settings.social?.tiktok} | Instagram: ${settings.social?.instagram}`
    );
    const phoneNum = customer.phone.replace(/[^0-9]/g, '') || settings.whatsapp;
    window.open(`https://wa.me/${phoneNum}?text=${text}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Main 2-Column POS Layout Grid (Responsive on Tablet & Mobile) */}
      <div
        className="pos-terminal-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '16px',
          alignItems: 'start',
          width: '100%',
        }}
      >
        
        {/* =========================================================================
            LEFT SECTION: BARCODE SEARCH, BRAND FILTER PILLS, & CATALOG GRID
            ========================================================================= */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Top Barcode Scanner & Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 18px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              borderRadius: '12px',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <Barcode size={24} color="#EF4444" />
              <input
                type="text"
                placeholder="Scan barcode with reader or type part name / SKU / Car model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.875rem',
                  width: '100%',
                }}
              />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: '#064E3B',
                color: '#34D399',
                fontSize: '0.75rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
              Scanner Ready
            </div>
          </div>

          {/* Brand Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {BRANDS.map((brand) => {
              const isSelected = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: isSelected ? '#000000' : '#E2E8F0',
                    background: isSelected ? '#000000' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#0F172A',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {brand}
                </button>
              );
            })}
          </div>

          {/* Inner Brand Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
            <input
              type="text"
              className="form-input"
              placeholder={`Search products inside ${selectedBrand}...`}
              value={brandSearch}
              onChange={(e) => {
                setBrandSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={{ paddingLeft: '38px', borderRadius: '10px' }}
            />
          </div>

          {/* Products / Vehicle Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '14px',
            }}
          >
            {paginatedCatalog.map((item) => {
              const isFav = favorites[item.id];
              return (
                <div
                  key={item.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    padding: '14px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '200px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                >
                  {/* Top Heart & SKU Tag */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: '#334155',
                        color: '#FFFFFF',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.sku}
                    </span>

                    <button
                      onClick={() => toggleFavorite(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <Heart size={18} color={isFav ? '#EF4444' : '#CBD5E1'} fill={isFav ? '#EF4444' : 'none'} />
                    </button>
                  </div>

                  {/* Center Icon Graphic */}
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    {item.type === 'VEHICLE' ? (
                      <Car size={42} color="#64748B" style={{ margin: '0 auto', opacity: 0.8 }} />
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', opacity: 0.7 }}>
                        <Sparkles size={36} color="#64748B" />
                      </div>
                    )}
                  </div>

                  {/* Product Title & Stock */}
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F172A', lineHeight: 1.3, marginBottom: '4px' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600, marginBottom: '10px' }}>
                      Stock: {item.stock} {item.stock > 1 ? 'units' : 'unit'}
                    </div>

                    {/* Price & Add to Cart Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#0F172A' }}>
                        Rs {item.price.toLocaleString()}
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: '#0F172A',
                          color: '#FFFFFF',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                          transition: 'background 0.15s ease',
                        }}
                        title="Add to Shopping Cart"
                      >
                        <ShoppingCart size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Catalog Pagination */}
          {totalCatalogPages > 1 && (
            <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalCatalogPages}
                totalItems={filteredCatalog.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(sz) => {
                  setPageSize(sz);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>

        {/* =========================================================================
            RIGHT SECTION: SHOPPING CART & DEAL DESK (Matches Screenshot 2)
            ========================================================================= */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '18px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            position: 'sticky',
            top: '84px',
            width: '100%',
            maxWidth: '340px',
            boxSizing: 'border-box',
          }}
        >
          {/* Cart Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Shopping Cart
            </h2>
            {cart.length > 0 && (
              <button
                onClick={handleClearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#DC2626',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Payment Mode Selector Tabs */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
              PAYMENT MODE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[
                { id: 'Cash', label: '💵 Cash' },
                { id: 'Online', label: '💳 Online' },
                { id: 'Credit', label: '🔧 Credit/Token' },
              ].map((m) => {
                const isSelected = paymentMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMode(m.id)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isSelected ? '#DC2626' : '#F1F5F9',
                      color: isSelected ? '#FFFFFF' : '#334155',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Walk-in Customer Name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              style={{ fontSize: '0.8125rem', padding: '8px 12px' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Phone No (e.g. 03001234567)"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                style={{ fontSize: '0.8125rem', padding: '8px 12px' }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="CNIC / Mechanic Ref"
                value={customer.cnic}
                onChange={(e) => setCustomer({ ...customer, cnic: e.target.value })}
                style={{ fontSize: '0.8125rem', padding: '8px 12px' }}
              />
            </div>
          </div>

          {/* Cart Item List with [-] [QTY] [+] [x] */}
          <div
            style={{
              maxHeight: '220px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingRight: '4px',
            }}
          >
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.875rem' }}>
                <ShoppingCart size={32} style={{ margin: '0 auto 6px', opacity: 0.4 }} />
                No items in cart yet
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Rs {item.price.toLocaleString()}
                    </div>
                  </div>

                  {/* QTY Controllers */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, -1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontWeight: 800, fontSize: '0.8125rem', width: '18px', textAlign: 'center' }}>
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, 1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Plus size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#DC2626',
                        cursor: 'pointer',
                        marginLeft: '4px',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Subtotal, Discount & Big Total */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 700 }}>Rs {subtotal.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#475569' }}>
              <span>Discount (Rs)</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                style={{
                  width: '80px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  textAlign: 'right',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '8px',
                borderTop: '1px dashed #CBD5E1',
              }}
            >
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>Total</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#DC2626' }}>
                Rs {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Big Red Proceed to Checkout Button (Matches Screenshot 2) */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={cart.length === 0}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#DC2626',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
              opacity: cart.length === 0 ? 0.6 : 1,
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            <FileText size={18} /> Proceed to Checkout & Receipt
          </button>
        </div>
      </div>

      {/* =========================================================================
          RECEIPT SUCCESS MODAL (Styled Exactly as Screenshot 1 Thermal Slip)
          ========================================================================= */}
      {completedSale && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '440px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0F172A' }}>
                ✓ Transaction Completed
              </div>
              <button
                onClick={() => setCompletedSale(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Thermal Receipt Preview Area */}
            <div id="printable-pos-receipt">
              <ThermalReceipt80mm
                sale={completedSale}
                cartItems={cart.map((c) => ({
                  description: c.name,
                  qty: c.qty,
                  price: c.price,
                  foc: 0,
                  amount: c.price * c.qty,
                }))}
                settings={settings}
              />
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                className="btn btn-emerald"
                onClick={handleWhatsAppReceipt}
                style={{ flex: 1, fontSize: '0.8125rem' }}
              >
                <Share2 size={15} /> WhatsApp
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePrintReceipt}
                style={{ flex: 1, fontSize: '0.8125rem' }}
              >
                <Printer size={15} /> Print Receipt
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setCompletedSale(null);
                  handleClearCart();
                }}
                style={{ fontSize: '0.8125rem' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
