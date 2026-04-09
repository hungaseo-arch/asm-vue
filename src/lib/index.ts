// ─── Route Constants ───────────────────────────────────────────────────────
export const ROUTE_PATHS = {
  HOME: '/',
  DASHBOARD: '/',
  // Procurement Management
  PO_CREATE: '/po-create',
  PO_PROCESSING: '/po-processing',
  GOODS_RECEIPT: '/goods-receipt',
  SUPPLIER: '/supplier',
  COST_ANALYSIS: '/cost-analysis',
  // Sales Management
  SALES_ORDER: '/sales-order',
  // Product Management
  PRODUCT: '/product',
  // Customer Management
  CUSTOMER: '/customer',
  // Sales Analysis
  SALES_ANALYSIS: '/sales-analysis',
  // Reports
  REPORTS: '/reports',
  // Settings
  SETTINGS: '/settings',
} as const;

// ─── Types — Procurement ─────────────────────────────────────────────────
export type ApprovalStatus =
  | 'Draft'
  | 'Team Leader'
  | 'Purchase Manager'
  | 'Division Head'
  | 'COO'
  | 'Confirmed'
  | 'Rejected';

export type SOApprovalStatus =
  | 'Draft'
  | 'Team Leader'
  | 'Sales Manager'
  | 'Division Head'
  | 'COO'
  | 'Confirmed'
  | 'Rejected';

export type POStatus = 'Confirmed' | 'In Transit' | 'Pending' | 'On Hold' | 'Cancelled' | 'Draft';
export type GRStatus = 'Completed' | 'Pending' | 'In Progress' | 'NG' | 'Partial';
export type SupplierTier = 'A' | 'B' | 'C';

// Delivery / Payment
export type DeliveryStatus = 'Delivered' | 'In Transit' | 'Ready To Ship' | 'Packing' | 'On Hold' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid';
export type CustomerChannel = 'Wholesale' | 'Retail';
export type ProductStatus = 'Active' | 'Inactive' | 'Discontinued';

// ─── Procurement Interfaces ──────────────────────────────────────────────
export interface PurchaseOrder {
  id: string;
  poNo: string;
  poDate: string;
  supplier: string;
  supplierCode: string;
  productDesc: string;
  qty: number;
  unit: string;
  fobUsd: number;
  cifUsd: number;
  landedCostIdr: number;
  whPriceIdr: number;
  totalUsd: number;
  totalIdr: number;
  status: POStatus;
  approvalStatus: ApprovalStatus;
  etaDate: string;
  warehouse: string;
  buyer: string;
  remarks?: string;
}

export interface POLineItem {
  no: number;
  brand: string;
  description: string;
  type: string;
  qty: number;
  unit: string;
  fobUsd: number;
  cifUsd: number;
  landedCostIdr: number;
  whPriceIdr: number;
  amount: number;
  fxRate: number;
}

export interface GoodsReceipt {
  id: string;
  grNo: string;
  poNo: string;
  grDate: string;
  supplier: string;
  warehouse: string;
  totalQty: number;
  goodQty: number;
  ngQty: number;
  status: GRStatus;
  inspector: string;
  container: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  country: string;
  contact: string;
  email: string;
  tier: SupplierTier;
  onTimeRate: number;
  qualityRate: number;
  leadTimeDays: number;
  totalOrdersUsd: number;
  activeOrders: number;
  paymentTerms: string;
  lastOrderDate: string;
}

export interface CostBreakdown {
  productCode: string;
  description: string;
  fobUsd: number;
  cifUsd: number;
  dutyIdr: number;
  customsIdr: number;
  inlandIdr: number;
  landedCostIdr: number;
  overheadIdr: number;
  whPriceIdr: number;
  deliveredIdr: number;
  sellingIdr: number;
  marginPct: number;
  fxRate: number;
}

// ─── Sales Order Interfaces ──────────────────────────────────────────────
export interface SOLineItem {
  no: number;
  type: 'Tire' | 'Tube' | 'Flap' | 'ETC';
  brand: string;
  description: string;
  qty: number;
  unitPrice: number;
  discPct: number;
  netPrice: number;
  amount: number;
  cogs: number;
  marginPct: number;
}

export interface SalesOrder {
  id: string;
  soNo: string;
  soDate: string;
  customerOrderNo: string;
  planDeliveryDate: string;
  originWH: string;
  salesRep: string;
  customerCode: string;
  customerName: string;
  phone: string;
  address: string;
  creditLimit: number;
  creditBalance: number;
  paymentTerms: string;
  deliveryMethod: string;
  approvalStatus: SOApprovalStatus;
  deliveryStatus: DeliveryStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  totalCogs: number;
  marginPct: number;
  qty: number;
  trackingNo?: string;
  originWHShip?: string;
  shipDate?: string;
  estArrival?: string;
  actualArrival?: string;
  remarks?: string;
  items: SOLineItem[];
}

// ─── Customer Interface ──────────────────────────────────────────────────
export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  channel: CustomerChannel;
  creditLimit: number;
  creditBalance: number;
  creditUsed: number;
  paymentTerms: string;
  salesRep: string;
  totalSalesIdr: number;
  totalMarginIdr: number;
  marginPct: number;
  activeOrders: number;
  status: 'Active' | 'On Hold' | 'Inactive';
  joinDate: string;
  lastOrderDate: string;
  vsAvgMargin: number;
  trend: string;
}

// ─── Product Interface ───────────────────────────────────────────────────
export interface Product {
  id: string;
  code: string;
  brand: string;
  category: string;
  size: string;
  pattern: string;
  pr: string;
  type1: string;
  type2: string;
  type3: string;
  fobUsd: number;
  cifUsd: number;
  whPriceIdr: number;
  retailPriceIdr: number;
  wholesalePriceIdr: number;
  retailMarginPct: number;
  wholesaleMarginPct: number;
  promoPriceIdr: number;
  promoMarginPct: number;
  minStock: number;
  reorderPoint: number;
  currentStock: number;
  bufferPct: number;
  warehouse: string;
  status: ProductStatus;
  approvalStatus: SOApprovalStatus;
  hsCode: string;
  fxRate: number;
  lastFxUpdate: string;
}

export interface PriceHistory {
  id: string;
  productCode: string;
  productDesc: string;
  date: string;
  priceType: 'Retail' | 'Wholesale' | 'WH Price' | 'Promo';
  oldPrice: number;
  newPrice: number;
  changeReason: string;
  changedBy: string;
  fxRateAtChange: number;
  approvedBy: string;
}

// ─── Formatters ────────────────────────────────────────────────────────────
export const fmtIDR = (v: number) =>
  'Rp ' + v.toLocaleString('id-ID');

export const fmtUSD = (v: number) =>
  '$' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const fmtNum = (v: number) =>
  v.toLocaleString('id-ID');

export const fmtIDRCompact = (v: number) => {
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(0)}K`;
  return fmtIDR(v);
};

// ─── Status helpers ────────────────────────────────────────────────────────
export const poStatusColor: Record<POStatus, string> = {
  Confirmed:   'bg-chart-1/20 text-chart-1 border-chart-1/40',
  'In Transit':'bg-chart-2/20 text-chart-2 border-chart-2/40',
  Pending:     'bg-chart-3/20 text-chart-3 border-chart-3/40',
  'On Hold':   'bg-destructive/20 text-destructive border-destructive/40',
  Cancelled:   'bg-muted text-muted-foreground border-border',
  Draft:       'bg-secondary text-secondary-foreground border-border',
};

export const grStatusColor: Record<GRStatus, string> = {
  Completed:   'bg-chart-1/20 text-chart-1 border-chart-1/40',
  Pending:     'bg-chart-3/20 text-chart-3 border-chart-3/40',
  'In Progress':'bg-chart-2/20 text-chart-2 border-chart-2/40',
  NG:          'bg-destructive/20 text-destructive border-destructive/40',
  Partial:     'bg-chart-4/20 text-chart-4 border-chart-4/40',
};

export const deliveryStatusColor: Record<DeliveryStatus, string> = {
  Delivered:        'bg-chart-1/20 text-chart-1 border-chart-1/40',
  'In Transit':     'bg-chart-2/20 text-chart-2 border-chart-2/40',
  'Ready To Ship':  'bg-accent/20 text-accent border-accent/40',
  Packing:          'bg-chart-3/20 text-chart-3 border-chart-3/40',
  'On Hold':        'bg-destructive/20 text-destructive border-destructive/40',
  Cancelled:        'bg-muted text-muted-foreground border-border',
};

export const paymentStatusColor: Record<PaymentStatus, string> = {
  Paid:    'bg-chart-1/20 text-chart-1 border-chart-1/40',
  Partial: 'bg-chart-3/20 text-chart-3 border-chart-3/40',
  Unpaid:  'bg-destructive/20 text-destructive border-destructive/40',
};

export const approvalSteps: ApprovalStatus[] = [
  'Draft', 'Team Leader', 'Purchase Manager', 'Division Head', 'COO', 'Confirmed',
];

export const soApprovalSteps: SOApprovalStatus[] = [
  'Draft', 'Team Leader', 'Sales Manager', 'Division Head', 'COO', 'Confirmed',
];
