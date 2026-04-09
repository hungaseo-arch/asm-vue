import type {
  PurchaseOrder, GoodsReceipt, Supplier, CostBreakdown, POLineItem,
  SalesOrder, Customer, Product, PriceHistory,
} from '@/lib/index';

// ─── Purchase Orders ────────────────────────────────────────────────────────
export const purchaseOrders: PurchaseOrder[] = [
  { id:'1', poNo:'ASM-PO-2603-001', poDate:'2026-03-01', supplier:'Hubei Aulice Tyre Co., Ltd.', supplierCode:'SUP-CN-001', productDesc:'ASC 10.00R20 AR102HD 18PR (TBR Radial)', qty:274, unit:'Pcs', fobUsd:134.20, cifUsd:142.23, landedCostIdr:2_512_451, whPriceIdr:2_712_087, totalUsd:38_971, totalIdr:743_511_838, status:'In Transit', approvalStatus:'Confirmed', etaDate:'2026-04-15', warehouse:'WH-Jakarta', buyer:'Ahmad R.', remarks:'40FT Container x1' },
  { id:'2', poNo:'ASM-PO-2603-002', poDate:'2026-03-03', supplier:'Shandong Linglong Tyre Co.', supplierCode:'SUP-CN-002', productDesc:'ASC 11.00R20 AR535 18PR (TBR Radial)', qty:548, unit:'Pcs', fobUsd:128.50, cifUsd:136.80, landedCostIdr:2_418_200, whPriceIdr:2_610_456, totalUsd:74_966, totalIdr:1_430_529_888, status:'Pending', approvalStatus:'Purchase Manager', etaDate:'2026-04-20', warehouse:'WH-Surabaya', buyer:'Budi S.' },
  { id:'3', poNo:'ASM-PO-2603-003', poDate:'2026-03-05', supplier:'Qingdao Doublestar Tire Industrial Co.', supplierCode:'SUP-CN-003', productDesc:'ASC 12.00R20 AR585 20PR (TBR Radial)', qty:192, unit:'Pcs', fobUsd:152.00, cifUsd:161.60, landedCostIdr:2_857_280, whPriceIdr:3_085_262, totalIdr:592_370_304, totalUsd:31_027, status:'Confirmed', approvalStatus:'Confirmed', etaDate:'2026-04-28', warehouse:'WH-Karawang', buyer:'Sari W.' },
  { id:'4', poNo:'ASM-PO-2603-004', poDate:'2026-03-08', supplier:'Zhongce Rubber Group Co.', supplierCode:'SUP-CN-004', productDesc:'ASC 10.00-20 TR78 Heavy Duty Tube', qty:1200, unit:'Pcs', fobUsd:18.40, cifUsd:19.80, landedCostIdr:350_100, whPriceIdr:378_108, totalIdr:453_729_600, totalUsd:23_760, status:'Draft', approvalStatus:'Draft', etaDate:'2026-05-05', warehouse:'WH-Jakarta', buyer:'Dewi P.' },
  { id:'5', poNo:'ASM-PO-2602-012', poDate:'2026-02-15', supplier:'Hubei Aulice Tyre Co., Ltd.', supplierCode:'SUP-CN-001', productDesc:'ASC 7.50R16 AR102HD 14PR (LTR)', qty:400, unit:'Pcs', fobUsd:68.50, cifUsd:73.20, landedCostIdr:1_294_140, whPriceIdr:1_397_671, totalIdr:558_868_400, totalUsd:29_280, status:'Confirmed', approvalStatus:'Confirmed', etaDate:'2026-03-20', warehouse:'WH-Semarang', buyer:'Ahmad R.' },
  { id:'6', poNo:'ASM-PO-2602-015', poDate:'2026-02-22', supplier:'Shandong Haian Rubber Co.', supplierCode:'SUP-CN-005', productDesc:'FLAP 10.00/11.00R20(S) Metal Plate', qty:2000, unit:'Pcs', fobUsd:3.80, cifUsd:4.10, landedCostIdr:72_468, whPriceIdr:78_265, totalIdr:156_530_000, totalUsd:8_200, status:'On Hold', approvalStatus:'Division Head', etaDate:'2026-04-10', warehouse:'WH-Jakarta', buyer:'Budi S.', remarks:'Quality spec review' },
];

export const poLineItems: POLineItem[] = [
  { no:1, brand:'ASCENDO', description:'ASC 10.00R20 AR102HD 18PR', type:'TBR Radial', qty:274, unit:'Pcs', fobUsd:134.20, cifUsd:142.23, landedCostIdr:2_512_451, whPriceIdr:2_712_087, amount:38_971.02, fxRate:17_500 },
];

// ─── Goods Receipts ─────────────────────────────────────────────────────────
export const goodsReceipts: GoodsReceipt[] = [
  { id:'1', grNo:'ASM-GR-2603-001', poNo:'ASM-PO-2602-012', grDate:'2026-03-20', supplier:'Hubei Aulice Tyre Co., Ltd.', warehouse:'WH-Semarang', totalQty:400, goodQty:396, ngQty:4, status:'Completed', inspector:'Rudi T.', container:'MSCU1234567' },
  { id:'2', grNo:'ASM-GR-2603-002', poNo:'ASM-PO-2603-001', grDate:'2026-04-15', supplier:'Hubei Aulice Tyre Co., Ltd.', warehouse:'WH-Jakarta', totalQty:274, goodQty:0, ngQty:0, status:'Pending', inspector:'-', container:'HLXU9876543' },
  { id:'3', grNo:'ASM-GR-2603-003', poNo:'ASM-PO-2603-003', grDate:'2026-04-28', supplier:'Qingdao Doublestar Tire Industrial Co.', warehouse:'WH-Karawang', totalQty:192, goodQty:0, ngQty:0, status:'Pending', inspector:'-', container:'TCKU4561230' },
  { id:'4', grNo:'ASM-GR-2602-009', poNo:'ASM-PO-2602-009', grDate:'2026-02-28', supplier:'Shandong Linglong Tyre Co.', warehouse:'WH-Surabaya', totalQty:320, goodQty:312, ngQty:8, status:'Completed', inspector:'Wati N.', container:'OOLU3348821' },
];

// ─── Suppliers ──────────────────────────────────────────────────────────────
export const suppliers: Supplier[] = [
  { id:'1', code:'SUP-CN-001', name:'Hubei Aulice Tyre Co., Ltd.', country:'China', contact:'Mr. Zhang Wei', email:'zhang@aulicetyre.com', tier:'A', onTimeRate:96.2, qualityRate:98.5, leadTimeDays:45, totalOrdersUsd:1_250_000, activeOrders:3, paymentTerms:'LC 60', lastOrderDate:'2026-03-01' },
  { id:'2', code:'SUP-CN-002', name:'Shandong Linglong Tyre Co.', country:'China', contact:'Ms. Li Mei', email:'li@linglong.com', tier:'A', onTimeRate:92.8, qualityRate:97.2, leadTimeDays:48, totalOrdersUsd:890_000, activeOrders:2, paymentTerms:'TT 30', lastOrderDate:'2026-03-03' },
  { id:'3', code:'SUP-CN-003', name:'Qingdao Doublestar Tire Industrial Co.', country:'China', contact:'Mr. Wang Fang', email:'wang@doublestar.com', tier:'B', onTimeRate:88.5, qualityRate:95.0, leadTimeDays:52, totalOrdersUsd:420_000, activeOrders:1, paymentTerms:'LC 90', lastOrderDate:'2026-03-05' },
  { id:'4', code:'SUP-CN-004', name:'Zhongce Rubber Group Co.', country:'China', contact:'Ms. Chen Jing', email:'chen@zhongce.com', tier:'B', onTimeRate:90.1, qualityRate:96.3, leadTimeDays:50, totalOrdersUsd:310_000, activeOrders:1, paymentTerms:'TT 45', lastOrderDate:'2026-03-08' },
  { id:'5', code:'SUP-CN-005', name:'Shandong Haian Rubber Co.', country:'China', contact:'Mr. Liu Bo', email:'liu@haianrubber.com', tier:'C', onTimeRate:82.4, qualityRate:93.1, leadTimeDays:60, totalOrdersUsd:180_000, activeOrders:1, paymentTerms:'TT 30', lastOrderDate:'2026-02-22' },
];

// ─── Cost Breakdown ─────────────────────────────────────────────────────────
export const costBreakdowns: CostBreakdown[] = [
  { productCode:'ASC-10R20-AR102HD-18', description:'ASC 10.00R20 AR102HD 18PR', fobUsd:134.20, cifUsd:142.23, dutyIdr:124_451, customsIdr:20_000, inlandIdr:35_000, landedCostIdr:2_512_451, overheadIdr:199_636, whPriceIdr:2_712_087, deliveredIdr:2_862_087, sellingIdr:3_200_000, marginPct:15.25, fxRate:17_500 },
  { productCode:'ASC-11R20-AR535-18', description:'ASC 11.00R20 AR535 18PR', fobUsd:128.50, cifUsd:136.80, dutyIdr:119_700, customsIdr:20_000, inlandIdr:35_000, landedCostIdr:2_418_200, overheadIdr:192_256, whPriceIdr:2_610_456, deliveredIdr:2_760_456, sellingIdr:3_196_397, marginPct:14.30, fxRate:17_500 },
  { productCode:'ASC-12R20-AR585-20', description:'ASC 12.00R20 AR585 20PR', fobUsd:152.00, cifUsd:161.60, dutyIdr:141_400, customsIdr:20_000, inlandIdr:35_000, landedCostIdr:2_857_280, overheadIdr:227_982, whPriceIdr:3_085_262, deliveredIdr:3_235_262, sellingIdr:3_650_000, marginPct:11.40, fxRate:17_500 },
  { productCode:'ASC-750R16-AR102HD-14', description:'ASC 7.50R16 AR102HD 14PR', fobUsd:68.50, cifUsd:73.20, dutyIdr:64_050, customsIdr:20_000, inlandIdr:35_000, landedCostIdr:1_294_140, overheadIdr:103_531, whPriceIdr:1_397_671, deliveredIdr:1_547_671, sellingIdr:1_750_000, marginPct:11.56, fxRate:17_500 },
];

// ─── Dashboard KPI (Procurement) ────────────────────────────────────────────
export const dashboardKPIs = {
  totalPOThisMonth: 4,
  totalPOValueUSD: 172_724,
  pendingApproval: 2,
  inTransit: 1,
  pendingGR: 2,
  avgLeadDays: 48.8,
  fxRateCurrent: 17_580,
  fxRateChange: +0.46,
  ngRatePct: 1.5,
};

export const monthlyPOTrend = [
  { month:'Oct', value:148000 },
  { month:'Nov', value:162000 },
  { month:'Dec', value:195000 },
  { month:'Jan', value:133000 },
  { month:'Feb', value:158000 },
  { month:'Mar', value:172724 },
];

export const costComposition = [
  { name:'FOB Price', value:68 },
  { name:'Ocean Freight', value:6 },
  { name:'Duty & Customs', value:12 },
  { name:'Inland Transport', value:3 },
  { name:'Overhead', value:9 },
  { name:'Sales Margin', value:14 },
];

// ─── Sales Orders ────────────────────────────────────────────────────────────
export const salesOrders: SalesOrder[] = [
  {
    id:'so1', soNo:'ORD-260301-001', soDate:'2026-03-01', customerOrderNo:'SS-2603-001',
    planDeliveryDate:'2026-03-10', originWH:'WH-Jakarta', salesRep:'Budi S.',
    customerCode:'CUST-0001', customerName:'PT Maju Jaya Motor', phone:'021-5555-1234',
    address:'Jl. Raya Bekasi No.88, Jakarta Timur', creditLimit:200_000_000, creditBalance:143_600_000,
    paymentTerms:'TOP 60', deliveryMethod:'Freight (JNE Trucking)',
    approvalStatus:'Confirmed', deliveryStatus:'Delivered', paymentStatus:'Paid',
    totalAmount:296_400_000, totalCogs:253_599_583, marginPct:14.4, qty:228,
    trackingNo:'JNE-2603010342', originWHShip:'WH-Jakarta', shipDate:'2026-03-01', estArrival:'2026-03-02', actualArrival:'2026-03-02',
    items:[
      { no:1, type:'Tire', brand:'ASCENDO', description:'ASC 11.00R20 AR535 18PR', qty:76, unitPrice:3_196_397, discPct:1.27, netPrice:3_155_936, amount:239_851_129, cogs:205_595_576, marginPct:14.3 },
      { no:2, type:'Tube', brand:'ASCENDO', description:'ASC 11.00-20 TR78 Heavy Duty', qty:76, unitPrice:298_198, discPct:1.27, netPrice:294_423, amount:22_376_174, cogs:18_162_001, marginPct:16.7 },
      { no:3, type:'Flap', brand:'ASCENDO', description:'ASC 10.00/11.00R20(S) Metal Plate', qty:76, unitPrice:63_964, discPct:1.27, netPrice:63_154, amount:4_799_729, cogs:4_230_517, marginPct:11.9 },
    ],
  },
  {
    id:'so2', soNo:'ORD-260301-002', soDate:'2026-03-01', customerOrderNo:'TBM-2603-008',
    planDeliveryDate:'2026-03-10', originWH:'WH-Jakarta', salesRep:'Sari W.',
    customerCode:'CUST-0023', customerName:'Toko Ban Makmur', phone:'021-7777-5678',
    address:'Jl. Gatot Subroto No.12, Jakarta Selatan', creditLimit:50_000_000, creditBalance:41_360_000,
    paymentTerms:'TOP 30', deliveryMethod:'Pickup',
    approvalStatus:'Confirmed', deliveryStatus:'Delivered', paymentStatus:'Paid',
    totalAmount:8_640_000, totalCogs:7_119_360, marginPct:17.6, qty:24,
    trackingNo:'SCP-260301-881', originWHShip:'WH-Jakarta', shipDate:'2026-03-01', estArrival:'2026-03-02', actualArrival:'2026-03-02',
    items:[
      { no:1, type:'Tire', brand:'ASCENDO', description:'ASC 10.00R20 AR102HD 18PR', qty:24, unitPrice:3_200_000, discPct:0, netPrice:3_200_000, amount:76_800_000, cogs:65_090_088, marginPct:15.25 },
    ],
  },
  {
    id:'so3', soNo:'ORD-260302-003', soDate:'2026-03-02', customerOrderNo:'CVS-2603-041',
    planDeliveryDate:'2026-03-12', originWH:'WH-Surabaya', salesRep:'Budi S.',
    customerCode:'CUST-0007', customerName:'CV Sentosa Parts', phone:'031-8888-9012',
    address:'Jl. Pemuda No.55, Surabaya', creditLimit:80_000_000, creditBalance:52_400_000,
    paymentTerms:'TOP 45', deliveryMethod:'Freight (SCP Express)',
    approvalStatus:'Confirmed', deliveryStatus:'In Transit', paymentStatus:'Paid',
    totalAmount:27_600_000, totalCogs:21_787_200, marginPct:21.1, qty:60,
    trackingNo:'JNE-2603023219', originWHShip:'WH-Surabaya', shipDate:'2026-03-02', estArrival:'2026-03-04', actualArrival:undefined,
    remarks:'1-Day Delay',
    items:[
      { no:1, type:'Tire', brand:'ASCENDO', description:'ASC 7.50R16 AR102HD 14PR', qty:60, unitPrice:1_750_000, discPct:2.0, netPrice:1_715_000, amount:102_900_000, cogs:83_860_260, marginPct:18.5 },
    ],
  },
  {
    id:'so4', soNo:'ORD-260302-004', soDate:'2026-03-02', customerOrderNo:'PLA-2603-015',
    planDeliveryDate:'2026-03-14', originWH:'WH-Jakarta', salesRep:'Ahmad R.',
    customerCode:'CUST-0015', customerName:'PT Lancar Abadi', phone:'021-3333-4567',
    address:'Jl. Mangga Dua Raya No.33, Jakarta Utara', creditLimit:120_000_000, creditBalance:81_600_000,
    paymentTerms:'TOP 60', deliveryMethod:'Freight (ANT Express)',
    approvalStatus:'Confirmed', deliveryStatus:'In Transit', paymentStatus:'Partial',
    totalAmount:38_400_000, totalCogs:29_337_600, marginPct:23.6, qty:48,
    trackingNo:'ANT-26030234A', originWHShip:'WH-Jakarta', shipDate:'2026-03-02', estArrival:'2026-03-06', actualArrival:undefined,
    remarks:'Installment',
    items:[
      { no:1, type:'Tire', brand:'ASCENDO', description:'ASC 10.00R20 AR102HD 18PR', qty:48, unitPrice:3_200_000, discPct:0, netPrice:3_200_000, amount:153_600_000, cogs:130_180_176, marginPct:15.25 },
    ],
  },
  {
    id:'so5', soNo:'ORD-260303-005', soDate:'2026-03-03', customerOrderNo:'BKU-2603-022',
    planDeliveryDate:'2026-03-30', originWH:'Wholesale', salesRep:'Sari W.',
    customerCode:'CUST-0042', customerName:'Bengkel Karya Unggul', phone:'0812-5678-9012',
    address:'Jl. Raya Cilincing No.7, Jakarta Utara', creditLimit:30_000_000, creditBalance:20_300_000,
    paymentTerms:'TOP 14', deliveryMethod:'Pickup',
    approvalStatus:'Confirmed', deliveryStatus:'Packing', paymentStatus:'Paid',
    totalAmount:9_720_000, totalCogs:8_101_440, marginPct:16.7, qty:36,
    trackingNo:'JTE-260303-771',
    items:[
      { no:1, type:'Tube', brand:'ASCENDO', description:'ASC 11.00-20 TR78 Heavy Duty', qty:36, unitPrice:298_198, discPct:1.27, netPrice:294_423, amount:10_599_228, cogs:8_536_836, marginPct:19.5 },
    ],
  },
  {
    id:'so6', soNo:'ORD-260303-006', soDate:'2026-03-03', customerOrderNo:'PNT-2603-007',
    planDeliveryDate:'2026-03-20', originWH:'WH-Jakarta', salesRep:'Ahmad R.',
    customerCode:'CUST-0031', customerName:'PT Nusantara Tire', phone:'021-9999-0123',
    address:'Jl. Yos Sudarso No.102, Jakarta Utara', creditLimit:150_000_000, creditBalance:6_000_000,
    paymentTerms:'TOP 60', deliveryMethod:'Freight (JNE Trucking)',
    approvalStatus:'Division Head', deliveryStatus:'On Hold', paymentStatus:'Unpaid',
    totalAmount:56_000_000, totalCogs:43_120_000, marginPct:23.0, qty:80,
    remarks:'Credit Review — Credit balance nearly full',
    items:[
      { no:1, type:'Tire', brand:'ASCENDO', description:'ASC 12.00R20 AR585 20PR', qty:80, unitPrice:3_650_000, discPct:0, netPrice:3_650_000, amount:292_000_000, cogs:246_820_960, marginPct:15.5 },
    ],
  },
  {
    id:'so7', soNo:'ORD-260304-007', soDate:'2026-03-04', customerOrderNo:'TSB-2603-003',
    planDeliveryDate:'2026-03-11', originWH:'WH-Semarang', salesRep:'Dewi P.',
    customerCode:'CUST-0018', customerName:'Toko Sejahtera Ban', phone:'024-7777-1234',
    address:'Jl. Pemuda No.78, Semarang', creditLimit:40_000_000, creditBalance:31_690_000,
    paymentTerms:'COD', deliveryMethod:'Pickup',
    approvalStatus:'Confirmed', deliveryStatus:'Delivered', paymentStatus:'Paid',
    totalAmount:4_560_000, totalCogs:3_517_200, marginPct:22.9, qty:12,
    trackingNo:'SCP-260304-225', originWHShip:'WH-Semarang', shipDate:'2026-03-04', estArrival:'2026-03-05', actualArrival:'2026-03-05',
    items:[
      { no:1, type:'Tire', brand:'ASCENDO', description:'ASC 7.50R16 AR102HD 14PR', qty:12, unitPrice:1_750_000, discPct:0, netPrice:1_750_000, amount:21_000_000, cogs:16_772_052, marginPct:20.1 },
    ],
  },
  {
    id:'so8', soNo:'ORD-260304-008', soDate:'2026-03-04', customerOrderNo:'PAP-2603-011',
    planDeliveryDate:'2026-03-11', originWH:'WH-Jakarta', salesRep:'Budi S.',
    customerCode:'CUST-0009', customerName:'PT Auto Prima', phone:'021-6666-7890',
    address:'Jl. Kramat Jati No.55, Jakarta Timur', creditLimit:100_000_000, creditBalance:73_800_000,
    paymentTerms:'TOP 30', deliveryMethod:'Freight (JNE Trucking)',
    approvalStatus:'Confirmed', deliveryStatus:'Delivered', paymentStatus:'Paid',
    totalAmount:16_800_000, totalCogs:12_700_800, marginPct:24.4, qty:40,
    trackingNo:'JNE-2603049988', originWHShip:'WH-Jakarta', shipDate:'2026-03-04', estArrival:'2026-03-05', actualArrival:'2026-03-05',
    items:[
      { no:1, type:'Tube', brand:'ASCENDO', description:'ASC 10.00-20 TR78 Heavy Duty', qty:40, unitPrice:420_000, discPct:0, netPrice:420_000, amount:16_800_000, cogs:12_700_800, marginPct:24.4 },
    ],
  },
  {
    id:'so9', soNo:'ORD-260305-009', soDate:'2026-03-05', customerOrderNo:'CBM-2603-018',
    planDeliveryDate:'2026-03-12', originWH:'WH-Surabaya', salesRep:'Dewi P.',
    customerCode:'CUST-0035', customerName:'CV Berkah Mandiri', phone:'031-5555-6789',
    address:'Jl. Wonokromo No.23, Surabaya', creditLimit:60_000_000, creditBalance:50_640_000,
    paymentTerms:'TOP 30', deliveryMethod:'Freight (ANT Express)',
    approvalStatus:'Confirmed', deliveryStatus:'In Transit', paymentStatus:'Partial',
    totalAmount:9_600_000, totalCogs:7_680_000, marginPct:20.0, qty:24,
    trackingNo:'ANT-26030501B', originWHShip:'WH-Surabaya', shipDate:'2026-03-05', estArrival:'2026-03-08', actualArrival:undefined,
    remarks:'Balance Due',
    items:[
      { no:1, type:'Flap', brand:'ASCENDO', description:'ASC 10.00/11.00R20(S) Metal Plate', qty:24, unitPrice:400_000, discPct:0, netPrice:400_000, amount:9_600_000, cogs:7_680_000, marginPct:20.0 },
    ],
  },
  {
    id:'so10', soNo:'ORD-260305-010', soDate:'2026-03-05', customerOrderNo:'BTS-2603-005',
    planDeliveryDate:'2026-03-12', originWH:'WH-Jakarta', salesRep:'Sari W.',
    customerCode:'CUST-0028', customerName:'Bengkel Top Speed', phone:'021-4444-3456',
    address:'Jl. Daan Mogot No.45, Jakarta Barat', creditLimit:25_000_000, creditBalance:19_800_000,
    paymentTerms:'COD', deliveryMethod:'Pickup',
    approvalStatus:'Confirmed', deliveryStatus:'Delivered', paymentStatus:'Paid',
    totalAmount:5_200_000, totalCogs:3_952_000, marginPct:24.0, qty:8,
    trackingNo:'SCP-260305-447', originWHShip:'WH-Jakarta', shipDate:'2026-03-05', estArrival:'2026-03-06', actualArrival:'2026-03-06',
    items:[
      { no:1, type:'Tire', brand:'ASCENDO', description:'ASC 7.50R16 AR585 14PR', qty:8, unitPrice:650_000, discPct:0, netPrice:650_000, amount:5_200_000, cogs:3_952_000, marginPct:24.0 },
    ],
  },
  {
    id:'so11', soNo:'ORD-260305-011', soDate:'2026-03-05', customerOrderNo:'PGM-2603-002',
    planDeliveryDate:'2026-03-15', originWH:'WH-Jakarta', salesRep:'Ahmad R.',
    customerCode:'CUST-0044', customerName:'PT Gemilang Motor', phone:'021-2222-5678',
    address:'Jl. Pangeran Jayakarta No.12, Jakarta Pusat', creditLimit:70_000_000, creditBalance:70_000_000,
    paymentTerms:'TOP 45', deliveryMethod:'Freight',
    approvalStatus:'Rejected', deliveryStatus:'Cancelled', paymentStatus:'Unpaid',
    totalAmount:33_000_000, totalCogs:26_730_000, marginPct:19.0, qty:60,
    remarks:'Stock Shortage — Cancelled',
    items:[
      { no:1, type:'Tube', brand:'ASCENDO', description:'ASC 12.00-20 TR78 20PR', qty:60, unitPrice:550_000, discPct:0, netPrice:550_000, amount:33_000_000, cogs:26_730_000, marginPct:19.0 },
    ],
  },
  {
    id:'so12', soNo:'ORD-260306-012', soDate:'2026-03-06', customerOrderNo:'TBM2-2603-014',
    planDeliveryDate:'2026-03-13', originWH:'WH-Semarang', salesRep:'Dewi P.',
    customerCode:'CUST-0051', customerName:'Toko Ban Murah', phone:'024-8888-5678',
    address:'Jl. Majapahit No.66, Semarang', creditLimit:30_000_000, creditBalance:24_060_000,
    paymentTerms:'COD', deliveryMethod:'Freight (JTE Express)',
    approvalStatus:'Confirmed', deliveryStatus:'Delivered', paymentStatus:'Paid',
    totalAmount:5_940_000, totalCogs:4_633_200, marginPct:22.0, qty:18,
    trackingNo:'JTE-260306-332', originWHShip:'WH-Semarang', shipDate:'2026-03-06', estArrival:'2026-03-08', actualArrival:'2026-03-08',
    items:[
      { no:1, type:'Flap', brand:'ASCENDO', description:'ASC 10.00/11.00R20(S) Metal Plate', qty:18, unitPrice:330_000, discPct:0, netPrice:330_000, amount:5_940_000, cogs:4_633_200, marginPct:22.0 },
    ],
  },
];

// ─── Customers ───────────────────────────────────────────────────────────────
export const customers: Customer[] = [
  { id:'c1', code:'CUST-0001', name:'PT Maju Jaya Motor', phone:'021-5555-1234', address:'Jl. Raya Bekasi No.88', city:'Jakarta Timur', channel:'Wholesale', creditLimit:200_000_000, creditBalance:143_600_000, creditUsed:56_400_000, paymentTerms:'TOP 60', salesRep:'Budi S.', totalSalesIdr:91_200_000, totalMarginIdr:21_300_000, marginPct:23.4, activeOrders:2, status:'Active', joinDate:'2021-06-15', lastOrderDate:'2026-03-01', vsAvgMargin:+0.9, trend:'▲ +2.1%' },
  { id:'c2', code:'CUST-0007', name:'CV Sentosa Parts', phone:'031-8888-9012', address:'Jl. Pemuda No.55', city:'Surabaya', channel:'Wholesale', creditLimit:80_000_000, creditBalance:52_400_000, creditUsed:27_600_000, paymentTerms:'TOP 45', salesRep:'Budi S.', totalSalesIdr:30_480_000, totalMarginIdr:6_432_000, marginPct:21.1, activeOrders:1, status:'Active', joinDate:'2022-01-20', lastOrderDate:'2026-03-02', vsAvgMargin:-1.3, trend:'▼ -1.2%' },
  { id:'c3', code:'CUST-0009', name:'PT Auto Prima', phone:'021-6666-7890', address:'Jl. Kramat Jati No.55', city:'Jakarta Timur', channel:'Wholesale', creditLimit:100_000_000, creditBalance:73_800_000, creditUsed:26_200_000, paymentTerms:'TOP 30', salesRep:'Budi S.', totalSalesIdr:26_200_000, totalMarginIdr:6_040_000, marginPct:23.1, activeOrders:1, status:'Active', joinDate:'2020-08-10', lastOrderDate:'2026-03-04', vsAvgMargin:+0.6, trend:'▲ +3.4%' },
  { id:'c4', code:'CUST-0015', name:'PT Lancar Abadi', phone:'021-3333-4567', address:'Jl. Mangga Dua Raya No.33', city:'Jakarta Utara', channel:'Wholesale', creditLimit:120_000_000, creditBalance:81_600_000, creditUsed:38_400_000, paymentTerms:'TOP 60', salesRep:'Ahmad R.', totalSalesIdr:55_840_000, totalMarginIdr:13_000_000, marginPct:23.3, activeOrders:1, status:'Active', joinDate:'2021-03-05', lastOrderDate:'2026-03-02', vsAvgMargin:+0.9, trend:'▲ +0.8%' },
  { id:'c5', code:'CUST-0018', name:'Toko Sejahtera Ban', phone:'024-7777-1234', address:'Jl. Pemuda No.78', city:'Semarang', channel:'Retail', creditLimit:40_000_000, creditBalance:31_690_000, creditUsed:8_310_000, paymentTerms:'COD', salesRep:'Dewi P.', totalSalesIdr:8_310_000, totalMarginIdr:1_434_000, marginPct:17.3, activeOrders:0, status:'Active', joinDate:'2023-02-14', lastOrderDate:'2026-03-04', vsAvgMargin:-5.2, trend:'▲ +2.1%' },
  { id:'c6', code:'CUST-0023', name:'Toko Ban Makmur', phone:'021-7777-5678', address:'Jl. Gatot Subroto No.12', city:'Jakarta Selatan', channel:'Retail', creditLimit:50_000_000, creditBalance:41_360_000, creditUsed:8_640_000, paymentTerms:'TOP 30', salesRep:'Sari W.', totalSalesIdr:12_240_000, totalMarginIdr:2_772_000, marginPct:22.6, activeOrders:0, status:'Active', joinDate:'2022-09-01', lastOrderDate:'2026-03-01', vsAvgMargin:+0.2, trend:'▲ +1.5%' },
  { id:'c7', code:'CUST-0028', name:'Bengkel Top Speed', phone:'021-4444-3456', address:'Jl. Daan Mogot No.45', city:'Jakarta Barat', channel:'Retail', creditLimit:25_000_000, creditBalance:19_800_000, creditUsed:5_200_000, paymentTerms:'COD', salesRep:'Sari W.', totalSalesIdr:11_240_000, totalMarginIdr:2_632_000, marginPct:23.4, activeOrders:0, status:'Active', joinDate:'2023-07-22', lastOrderDate:'2026-03-05', vsAvgMargin:+1.0, trend:'▼ -0.5%' },
  { id:'c8', code:'CUST-0031', name:'PT Nusantara Tire', phone:'021-9999-0123', address:'Jl. Yos Sudarso No.102', city:'Jakarta Utara', channel:'Wholesale', creditLimit:150_000_000, creditBalance:6_000_000, creditUsed:144_000_000, paymentTerms:'TOP 60', salesRep:'Ahmad R.', totalSalesIdr:56_000_000, totalMarginIdr:12_880_000, marginPct:23.0, activeOrders:1, status:'On Hold', joinDate:'2020-11-15', lastOrderDate:'2026-03-03', vsAvgMargin:+0.6, trend:'— 0.0%' },
  { id:'c9', code:'CUST-0035', name:'CV Berkah Mandiri', phone:'031-5555-6789', address:'Jl. Wonokromo No.23', city:'Surabaya', channel:'Wholesale', creditLimit:60_000_000, creditBalance:50_640_000, creditUsed:9_360_000, paymentTerms:'TOP 30', salesRep:'Dewi P.', totalSalesIdr:9_360_000, totalMarginIdr:1_848_000, marginPct:19.7, activeOrders:1, status:'Active', joinDate:'2022-04-18', lastOrderDate:'2026-03-05', vsAvgMargin:-2.7, trend:'▲ +4.2%' },
  { id:'c10', code:'CUST-0042', name:'Bengkel Karya Unggul', phone:'0812-5678-9012', address:'Jl. Raya Cilincing No.7', city:'Jakarta Utara', channel:'Retail', creditLimit:30_000_000, creditBalance:20_300_000, creditUsed:9_720_000, paymentTerms:'TOP 14', salesRep:'Sari W.', totalSalesIdr:16_680_000, totalMarginIdr:3_192_000, marginPct:19.1, activeOrders:1, status:'Active', joinDate:'2023-12-05', lastOrderDate:'2026-03-03', vsAvgMargin:-3.3, trend:'— 0.0%' },
  { id:'c11', code:'CUST-0044', name:'PT Gemilang Motor', phone:'021-2222-5678', address:'Jl. Pangeran Jayakarta No.12', city:'Jakarta Pusat', channel:'Wholesale', creditLimit:70_000_000, creditBalance:0, creditUsed:70_000_000, paymentTerms:'TOP 45', salesRep:'Ahmad R.', totalSalesIdr:33_000_000, totalMarginIdr:6_270_000, marginPct:19.0, activeOrders:0, status:'On Hold', joinDate:'2021-07-30', lastOrderDate:'2026-03-05', vsAvgMargin:-3.5, trend:'— 0.0%' },
  { id:'c12', code:'CUST-0051', name:'Toko Ban Murah', phone:'024-8888-5678', address:'Jl. Majapahit No.66', city:'Semarang', channel:'Retail', creditLimit:30_000_000, creditBalance:24_060_000, creditUsed:5_940_000, paymentTerms:'COD', salesRep:'Dewi P.', totalSalesIdr:5_940_000, totalMarginIdr:1_306_800, marginPct:22.0, activeOrders:0, status:'Active', joinDate:'2024-01-10', lastOrderDate:'2026-03-06', vsAvgMargin:-0.4, trend:'▲ +1.2%' },
];

// ─── Products ────────────────────────────────────────────────────────────────
export const products: Product[] = [
  { id:'p1', code:'ASC-10R20-AR102HD-18', brand:'ASCENDO', category:'TBR', size:'10.00R20', pattern:'AR102HD', pr:'18', type1:'Tire', type2:'TB', type3:'Radial', fobUsd:134.20, cifUsd:142.23, whPriceIdr:2_712_087, retailPriceIdr:3_200_000, wholesalePriceIdr:3_650_000, retailMarginPct:15.25, wholesaleMarginPct:25.70, promoPriceIdr:3_000_000, promoMarginPct:9.60, minStock:50, reorderPoint:80, currentStock:1_076, bufferPct:270, warehouse:'WH-Karawang', status:'Active', approvalStatus:'Confirmed', hsCode:'4011.10.00', fxRate:17_500, lastFxUpdate:'2026-03-01' },
  { id:'p2', code:'ASC-11R20-AR535-18', brand:'ASCENDO', category:'TBR', size:'11.00R20', pattern:'AR535', pr:'18', type1:'Tire', type2:'TB', type3:'Radial', fobUsd:128.50, cifUsd:136.80, whPriceIdr:2_610_456, retailPriceIdr:3_196_397, wholesalePriceIdr:3_550_000, retailMarginPct:18.33, wholesaleMarginPct:26.50, promoPriceIdr:2_950_000, promoMarginPct:11.54, minStock:100, reorderPoint:150, currentStock:76, bufferPct:50, warehouse:'WH-Jakarta', status:'Active', approvalStatus:'Confirmed', hsCode:'4011.10.00', fxRate:17_500, lastFxUpdate:'2026-03-01' },
  { id:'p3', code:'ASC-12R20-AR585-20', brand:'ASCENDO', category:'TBR', size:'12.00R20', pattern:'AR585', pr:'20', type1:'Tire', type2:'TB', type3:'Radial', fobUsd:152.00, cifUsd:161.60, whPriceIdr:3_085_262, retailPriceIdr:3_650_000, wholesalePriceIdr:4_100_000, retailMarginPct:15.47, wholesaleMarginPct:24.76, promoPriceIdr:3_400_000, promoMarginPct:9.24, minStock:150, reorderPoint:200, currentStock:46, bufferPct:23, warehouse:'WH-Jakarta', status:'Active', approvalStatus:'Confirmed', hsCode:'4011.10.00', fxRate:17_500, lastFxUpdate:'2026-03-01' },
  { id:'p4', code:'ASC-750R16-AR102HD-14', brand:'ASCENDO', category:'LTR', size:'7.50R16', pattern:'AR102HD', pr:'14', type1:'Tire', type2:'LTR', type3:'Radial', fobUsd:68.50, cifUsd:73.20, whPriceIdr:1_397_671, retailPriceIdr:1_750_000, wholesalePriceIdr:2_000_000, retailMarginPct:20.13, wholesaleMarginPct:30.12, promoPriceIdr:1_600_000, promoMarginPct:12.64, minStock:80, reorderPoint:120, currentStock:376, bufferPct:314, warehouse:'WH-Semarang', status:'Active', approvalStatus:'Confirmed', hsCode:'4011.20.00', fxRate:17_500, lastFxUpdate:'2026-03-01' },
  { id:'p5', code:'ASC-1100-20TR78', brand:'ASCENDO', category:'Tube', size:'11.00-20', pattern:'TR78', pr:'HD', type1:'Tube', type2:'TB', type3:'Heavy Duty', fobUsd:18.40, cifUsd:19.80, whPriceIdr:349_740, retailPriceIdr:420_000, wholesalePriceIdr:480_000, retailMarginPct:16.73, wholesaleMarginPct:27.14, promoPriceIdr:380_000, promoMarginPct:7.97, minStock:200, reorderPoint:300, currentStock:548, bufferPct:182, warehouse:'WH-Jakarta', status:'Active', approvalStatus:'Confirmed', hsCode:'4013.10.00', fxRate:17_500, lastFxUpdate:'2026-03-01' },
  { id:'p6', code:'ASC-FLAP-10R20-S', brand:'ASCENDO', category:'Flap', size:'10.00/11.00R20(S)', pattern:'-', pr:'-', type1:'Flap', type2:'TB', type3:'Metal Plate', fobUsd:3.80, cifUsd:4.10, whPriceIdr:72_468, retailPriceIdr:95_000, wholesalePriceIdr:110_000, retailMarginPct:23.72, wholesaleMarginPct:34.12, promoPriceIdr:85_000, promoMarginPct:14.74, minStock:500, reorderPoint:800, currentStock:320, bufferPct:40, warehouse:'WH-Jakarta', status:'Active', approvalStatus:'Confirmed', hsCode:'4012.90.00', fxRate:17_500, lastFxUpdate:'2026-03-01' },
];

// ─── Price History ────────────────────────────────────────────────────────────
export const priceHistories: PriceHistory[] = [
  { id:'ph1', productCode:'ASC-10R20-AR102HD-18', productDesc:'ASC 10.00R20 AR102HD 18PR', date:'2026-03-01', priceType:'WH Price', oldPrice:2_641_000, newPrice:2_712_087, changeReason:'FX Rate updated (17,000→17,500)', changedBy:'Ahmad R.', fxRateAtChange:17_500, approvedBy:'Hendra K.' },
  { id:'ph2', productCode:'ASC-10R20-AR102HD-18', productDesc:'ASC 10.00R20 AR102HD 18PR', date:'2026-03-01', priceType:'Retail', oldPrice:3_100_000, newPrice:3_200_000, changeReason:'Price adjustment due to WH Price increase', changedBy:'Ahmad R.', fxRateAtChange:17_500, approvedBy:'Division Head' },
  { id:'ph3', productCode:'ASC-11R20-AR535-18', productDesc:'ASC 11.00R20 AR535 18PR', date:'2026-02-15', priceType:'WH Price', oldPrice:2_550_000, newPrice:2_610_456, changeReason:'FOB price change ($125→$128.50)', changedBy:'Budi S.', fxRateAtChange:17_200, approvedBy:'Hendra K.' },
  { id:'ph4', productCode:'ASC-11R20-AR535-18', productDesc:'ASC 11.00R20 AR535 18PR', date:'2026-02-15', priceType:'Wholesale', oldPrice:3_450_000, newPrice:3_550_000, changeReason:'Reflecting WH Price increase', changedBy:'Budi S.', fxRateAtChange:17_200, approvedBy:'Sales Manager' },
  { id:'ph5', productCode:'ASC-12R20-AR585-20', productDesc:'ASC 12.00R20 AR585 20PR', date:'2026-01-10', priceType:'WH Price', oldPrice:2_990_000, newPrice:3_085_262, changeReason:'Reflecting FX Rate increase (17,000→17,500)', changedBy:'Sari W.', fxRateAtChange:17_500, approvedBy:'Hendra K.' },
  { id:'ph6', productCode:'ASC-12R20-AR585-20', productDesc:'ASC 12.00R20 AR585 20PR', date:'2026-01-10', priceType:'Retail', oldPrice:3_550_000, newPrice:3_650_000, changeReason:'Reflecting cost increase', changedBy:'Sari W.', fxRateAtChange:17_500, approvedBy:'COO' },
  { id:'ph7', productCode:'ASC-750R16-AR102HD-14', productDesc:'ASC 7.50R16 AR102HD 14PR', date:'2025-11-20', priceType:'WH Price', oldPrice:1_340_000, newPrice:1_397_671, changeReason:'Supplier FOB increase ($65→$68.50)', changedBy:'Ahmad R.', fxRateAtChange:17_200, approvedBy:'Hendra K.' },
  { id:'ph8', productCode:'ASC-FLAP-10R20-S', productDesc:'FLAP 10.00/11.00R20(S)', date:'2026-02-28', priceType:'Wholesale', oldPrice:100_000, newPrice:110_000, changeReason:'Market price survey adjustment +10%', changedBy:'Dewi P.', fxRateAtChange:17_300, approvedBy:'Sales Manager' },
  { id:'ph9', productCode:'ASC-1100-20TR78', productDesc:'ASC 11.00-20 TR78', date:'2026-03-10', priceType:'Retail', oldPrice:390_000, newPrice:420_000, changeReason:'Raw material cost increase', changedBy:'Dewi P.', fxRateAtChange:17_580, approvedBy:'Division Head' },
];

// ─── Sales Analysis Data ─────────────────────────────────────────────────────
export const monthlySalesTrend = [
  { month:'Oct', sales:8_124_000_000, margin:852_000_000, marginPct:10.5 },
  { month:'Nov', sales:9_234_000_000, margin:924_000_000, marginPct:10.0 },
  { month:'Dec', sales:11_450_000_000, margin:1_201_000_000, marginPct:10.5 },
  { month:'Jan', sales:7_820_000_000, margin:820_000_000, marginPct:10.5 },
  { month:'Feb', sales:8_980_000_000, margin:940_000_000, marginPct:10.5 },
  { month:'Mar', sales:9_741_000_000, margin:1_021_000_000, marginPct:10.5 },
];

export const salesByRep = [
  { rep:'Budi S.', sales:132_240_000, margin:30_172_000, marginPct:22.8, orders:5, customers:3 },
  { rep:'Ahmad R.', sales:93_040_000, margin:21_310_000, marginPct:22.9, orders:4, customers:3 },
  { rep:'Sari W.', sales:26_580_000, margin:5_634_000, marginPct:21.2, orders:4, customers:3 },
  { rep:'Dewi P.', sales:20_700_000, margin:4_422_000, marginPct:21.4, orders:4, customers:4 },
];

export const marginByProductType = [
  { name:'TIRE TB_R', qty:3_347, sales:9_145_621_995, margin:1_134_447_630, marginPct:12.4 },
  { name:'TIRE IND', qty:1_511, sales:2_560_444_814, margin:305_483_605, marginPct:11.9 },
  { name:'TIRE AGR', qty:403, sales:880_566_491, margin:257_957_955, marginPct:29.3 },
  { name:'TUBE TB', qty:34_595, sales:6_743_641_696, margin:476_786_099, marginPct:7.1 },
  { name:'TUBE OTR', qty:4_000, sales:1_566_958_364, margin:231_884_713, marginPct:14.8 },
  { name:'FLAP TB', qty:19_606, sales:1_122_425_681, margin:248_953_241, marginPct:22.2 },
  { name:'TIRE OTR', qty:27, sales:139_955_942, margin:29_675_527, marginPct:21.2 },
  { name:'TIRE TB_B', qty:1_225, sales:2_191_229_304, margin:154_368_297, marginPct:7.0 },
];
