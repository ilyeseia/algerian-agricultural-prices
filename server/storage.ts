import { 
  type Product, 
  type Wilaya, 
  type Price, 
  type PriceWithDetails,
  type ProductStats,
  type InsertProduct, 
  type InsertWilaya, 
  type InsertPrice,
  type UpdatePrice
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Wilayas
  getWilayas(): Promise<Wilaya[]>;
  getWilaya(id: string): Promise<Wilaya | undefined>;
  createWilaya(wilaya: InsertWilaya): Promise<Wilaya>;

  // Prices
  getPrices(filters?: {
    productId?: string;
    wilayaId?: string;
    marketType?: string;
    search?: string;
  }): Promise<PriceWithDetails[]>;
  getPrice(id: string): Promise<PriceWithDetails | undefined>;
  createPrice(price: InsertPrice): Promise<Price>;
  updatePrice(id: string, price: Partial<UpdatePrice>): Promise<Price | undefined>;
  deletePrice(id: string): Promise<boolean>;

  // Statistics
  getProductStats(): Promise<ProductStats>;
  getTopProducts(limit?: number): Promise<(Product & { avgPrice: number; changePercentage: number; marketCount: number })[]>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product> = new Map();
  private wilayas: Map<string, Wilaya> = new Map();
  private prices: Map<string, Price> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize Wilayas
    const wilayasData = [
      { code: "01", name: "Adrar", nameAr: "أدرار" },
      { code: "02", name: "Chlef", nameAr: "الشلف" },
      { code: "03", name: "Laghouat", nameAr: "الأغواط" },
      { code: "04", name: "Oum El Bouaghi", nameAr: "أم البواقي" },
      { code: "05", name: "Batna", nameAr: "باتنة" },
      { code: "06", name: "Béjaïa", nameAr: "بجاية" },
      { code: "07", name: "Biskra", nameAr: "بسكرة" },
      { code: "08", name: "Béchar", nameAr: "بشار" },
      { code: "09", name: "Blida", nameAr: "البليدة" },
      { code: "10", name: "Bouira", nameAr: "البويرة" },
      { code: "11", name: "Tamanrasset", nameAr: "تمنراست" },
      { code: "12", name: "Tébessa", nameAr: "تبسة" },
      { code: "13", name: "Tlemcen", nameAr: "تلمسان" },
      { code: "14", name: "Tiaret", nameAr: "تيارت" },
      { code: "15", name: "Tizi Ouzou", nameAr: "تيزي وزو" },
      { code: "16", name: "Algiers", nameAr: "الجزائر العاصمة" },
      { code: "17", name: "Djelfa", nameAr: "الجلفة" },
      { code: "18", name: "Jijel", nameAr: "جيجل" },
      { code: "19", name: "Sétif", nameAr: "سطيف" },
      { code: "20", name: "Saïda", nameAr: "سعيدة" },
      { code: "21", name: "Skikda", nameAr: "سكيكدة" },
      { code: "22", name: "Sidi Bel Abbès", nameAr: "سيدي بلعباس" },
      { code: "23", name: "Annaba", nameAr: "عنابة" },
      { code: "24", name: "Guelma", nameAr: "قالمة" },
      { code: "25", name: "Constantine", nameAr: "قسنطينة" },
      { code: "26", name: "Médéa", nameAr: "المدية" },
      { code: "27", name: "Mostaganem", nameAr: "مستغانم" },
      { code: "28", name: "M'Sila", nameAr: "المسيلة" },
      { code: "29", name: "Mascara", nameAr: "معسكر" },
      { code: "30", name: "Ouargla", nameAr: "ورقلة" },
      { code: "31", name: "Oran", nameAr: "وهران" },
      { code: "32", name: "El Bayadh", nameAr: "البيض" },
      { code: "33", name: "Illizi", nameAr: "إليزي" },
      { code: "34", name: "Bordj Bou Arréridj", nameAr: "برج بوعريريج" },
      { code: "35", name: "Boumerdès", nameAr: "بومرداس" },
      { code: "36", name: "El Tarf", nameAr: "الطارف" },
      { code: "37", name: "Tindouf", nameAr: "تندوف" },
      { code: "38", name: "Tissemsilt", nameAr: "تيسمسيلت" },
      { code: "39", name: "El Oued", nameAr: "الوادي" },
      { code: "40", name: "Khenchela", nameAr: "خنشلة" },
      { code: "41", name: "Souk Ahras", nameAr: "سوق أهراس" },
      { code: "42", name: "Tipaza", nameAr: "تيبازة" },
      { code: "43", name: "Mila", nameAr: "ميلة" },
      { code: "44", name: "Aïn Defla", nameAr: "عين الدفلى" },
      { code: "45", name: "Naâma", nameAr: "النعامة" },
      { code: "46", name: "Aïn Témouchent", nameAr: "عين تموشنت" },
      { code: "47", name: "Ghardaïa", nameAr: "غرداية" },
      { code: "48", name: "Relizane", nameAr: "غليزان" },
      { code: "49", name: "Timimoun", nameAr: "تيميمون" },
      { code: "50", name: "Bordj Badji Mokhtar", nameAr: "برج باجي مختار" },
      { code: "51", name: "Ouled Djellal", nameAr: "أولاد جلال" },
      { code: "52", name: "Béni Abbès", nameAr: "بني عباس" },
      { code: "53", name: "In Salah", nameAr: "عين صالح" },
      { code: "54", name: "In Guezzam", nameAr: "عين قزام" },
      { code: "55", name: "Touggourt", nameAr: "تقرت" },
      { code: "56", name: "Djanet", nameAr: "جانت" },
      { code: "57", name: "El M'Ghair", nameAr: "المغير" },
      { code: "58", name: "El Meniaa", nameAr: "المنيعة" }
    ];

    wilayasData.forEach(w => {
      const id = randomUUID();
      this.wilayas.set(id, { id, ...w });
    });

    // Initialize Products
    const productsData = [
      { name: "Carrot", nameAr: "جزر", category: "vegetables", icon: "fas fa-carrot" },
      { name: "Red Apple", nameAr: "تفاح أحمر", category: "fruits", icon: "fas fa-apple-alt" },
      { name: "Hot Pepper", nameAr: "فلفل حار", category: "vegetables", icon: "fas fa-pepper-hot" },
      { name: "Lemon", nameAr: "ليمون", category: "fruits", icon: "fas fa-lemon" },
      { name: "Tomato", nameAr: "طماطم", category: "vegetables", icon: "fas fa-seedling" },
      { name: "Orange", nameAr: "برتقال", category: "fruits", icon: "fas fa-circle" },
      { name: "Potato", nameAr: "بطاطا", category: "vegetables", icon: "fas fa-circle" },
      { name: "Banana", nameAr: "موز", category: "fruits", icon: "fas fa-circle" },
      { name: "Onion", nameAr: "بصل", category: "vegetables", icon: "fas fa-circle" },
      { name: "Grapes", nameAr: "عنب", category: "fruits", icon: "fas fa-circle" }
    ];

    productsData.forEach(p => {
      const id = randomUUID();
      this.products.set(id, { id, ...p, unit: "كيلوغرام", createdAt: new Date() });
    });

    // Initialize some sample prices
    this.initializeSamplePrices();
  }

  private initializeSamplePrices() {
    const productIds = Array.from(this.products.keys());
    const wilayaIds = Array.from(this.wilayas.keys()).slice(0, 10); // Use first 10 wilayas
    const marketTypes = ["wholesale", "retail"];

    productIds.forEach(productId => {
      wilayaIds.forEach(wilayaId => {
        marketTypes.forEach(marketType => {
          const basePrice = Math.floor(Math.random() * 400) + 50;
          const previousPrice = basePrice + (Math.random() - 0.5) * 50;
          const changePercentage = ((basePrice - previousPrice) / previousPrice) * 100;
          
          const id = randomUUID();
          this.prices.set(id, {
            id,
            productId,
            wilayaId,
            marketType,
            price: basePrice.toString(),
            previousPrice: previousPrice.toString(),
            changePercentage: changePercentage.toFixed(2),
            isActive: true,
            lastUpdated: new Date(),
            createdAt: new Date()
          });
        });
      });
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const newProduct: Product = {
      id,
      ...product,
      unit: product.unit || "كيلوغرام",
      createdAt: new Date()
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getWilayas(): Promise<Wilaya[]> {
    return Array.from(this.wilayas.values());
  }

  async getWilaya(id: string): Promise<Wilaya | undefined> {
    return this.wilayas.get(id);
  }

  async createWilaya(wilaya: InsertWilaya): Promise<Wilaya> {
    const id = randomUUID();
    const newWilaya: Wilaya = { id, ...wilaya };
    this.wilayas.set(id, newWilaya);
    return newWilaya;
  }

  async getPrices(filters?: {
    productId?: string;
    wilayaId?: string;
    marketType?: string;
    search?: string;
  }): Promise<PriceWithDetails[]> {
    let pricesArray = Array.from(this.prices.values());

    if (filters) {
      if (filters.productId) {
        pricesArray = pricesArray.filter(p => p.productId === filters.productId);
      }
      if (filters.wilayaId) {
        pricesArray = pricesArray.filter(p => p.wilayaId === filters.wilayaId);
      }
      if (filters.marketType) {
        pricesArray = pricesArray.filter(p => p.marketType === filters.marketType);
      }
    }

    return pricesArray.map(price => ({
      ...price,
      product: this.products.get(price.productId)!,
      wilaya: this.wilayas.get(price.wilayaId)!
    })).filter(p => p.product && p.wilaya);
  }

  async getPrice(id: string): Promise<PriceWithDetails | undefined> {
    const price = this.prices.get(id);
    if (!price) return undefined;

    const product = this.products.get(price.productId);
    const wilaya = this.wilayas.get(price.wilayaId);
    
    if (!product || !wilaya) return undefined;

    return { ...price, product, wilaya };
  }

  async createPrice(price: InsertPrice): Promise<Price> {
    const id = randomUUID();
    const newPrice: Price = {
      id,
      ...price,
      previousPrice: price.previousPrice || null,
      changePercentage: price.changePercentage || null,
      isActive: price.isActive ?? true,
      lastUpdated: new Date(),
      createdAt: new Date()
    };
    this.prices.set(id, newPrice);
    return newPrice;
  }

  async updatePrice(id: string, priceData: Partial<UpdatePrice>): Promise<Price | undefined> {
    const existing = this.prices.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...priceData, 
      lastUpdated: new Date() 
    };
    this.prices.set(id, updated);
    return updated;
  }

  async deletePrice(id: string): Promise<boolean> {
    return this.prices.delete(id);
  }

  async getProductStats(): Promise<ProductStats> {
    const prices = Array.from(this.prices.values());
    const totalProducts = this.products.size;
    const activeWilayas = new Set(prices.map(p => p.wilayaId)).size;
    const totalPrices = prices.reduce((sum, p) => sum + parseFloat(p.price), 0);
    const averagePrice = prices.length > 0 ? totalPrices / prices.length : 0;
    
    return {
      totalProducts,
      activeWilayas,
      lastUpdate: "قبل 15 دقيقة",
      averagePrice: Math.round(averagePrice)
    };
  }

  async getTopProducts(limit = 5): Promise<(Product & { avgPrice: number; changePercentage: number; marketCount: number })[]> {
    const products = Array.from(this.products.values());
    const prices = Array.from(this.prices.values());
    
    return products.slice(0, limit).map(product => {
      const productPrices = prices.filter(p => p.productId === product.id);
      const avgPrice = productPrices.length > 0 
        ? productPrices.reduce((sum, p) => sum + parseFloat(p.price), 0) / productPrices.length 
        : 0;
      const avgChange = productPrices.length > 0 
        ? productPrices.reduce((sum, p) => sum + parseFloat(p.changePercentage || "0"), 0) / productPrices.length 
        : 0;
      const marketCount = new Set(productPrices.map(p => p.wilayaId)).size;
      
      return {
        ...product,
        avgPrice: Math.round(avgPrice),
        changePercentage: Math.round(avgChange * 100) / 100,
        marketCount
      };
    });
  }
}

export const storage = new MemStorage();
