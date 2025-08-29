import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertPriceSchema, updatePriceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب المنتجات" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: "خطأ في إنشاء المنتج" });
      }
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      
      if (!product) {
        return res.status(404).json({ message: "المنتج غير موجود" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: "خطأ في تحديث المنتج" });
      }
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "المنتج غير موجود" });
      }
      
      res.json({ message: "تم حذف المنتج بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف المنتج" });
    }
  });

  // Wilayas routes
  app.get("/api/wilayas", async (req, res) => {
    try {
      const wilayas = await storage.getWilayas();
      res.json(wilayas);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب الولايات" });
    }
  });

  // Prices routes
  app.get("/api/prices", async (req, res) => {
    try {
      const { productId, wilayaId, marketType, search } = req.query;
      const prices = await storage.getPrices({
        productId: productId as string,
        wilayaId: wilayaId as string,
        marketType: marketType as string,
        search: search as string
      });
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب الأسعار" });
    }
  });

  app.post("/api/prices", async (req, res) => {
    try {
      const validatedData = insertPriceSchema.parse(req.body);
      const price = await storage.createPrice(validatedData);
      res.status(201).json(price);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: "خطأ في إنشاء السعر" });
      }
    }
  });

  app.put("/api/prices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updatePriceSchema.partial().parse({ ...req.body, id });
      const price = await storage.updatePrice(id, validatedData);
      
      if (!price) {
        return res.status(404).json({ message: "السعر غير موجود" });
      }
      
      res.json(price);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: "خطأ في تحديث السعر" });
      }
    }
  });

  app.delete("/api/prices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePrice(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "السعر غير موجود" });
      }
      
      res.json({ message: "تم حذف السعر بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف السعر" });
    }
  });

  // Statistics routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getProductStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب الإحصائيات" });
    }
  });

  app.get("/api/top-products", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const topProducts = await storage.getTopProducts(limit);
      res.json(topProducts);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب المنتجات الأكثر تداولاً" });
    }
  });

  // Export data route
  app.get("/api/export", async (req, res) => {
    try {
      const { format = 'json' } = req.query;
      const prices = await storage.getPrices();
      
      if (format === 'csv') {
        const csvData = prices.map(p => 
          `${p.product.nameAr},${p.wilaya.nameAr},${p.marketType},${p.price},${p.changePercentage || 0}`
        ).join('\n');
        
        const csvHeader = 'المنتج,الولاية,نوع السوق,السعر,نسبة التغيير\n';
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=prices.csv');
        res.send('\ufeff' + csvHeader + csvData); // BOM for proper Arabic display
      } else {
        res.json(prices);
      }
    } catch (error) {
      res.status(500).json({ message: "خطأ في تصدير البيانات" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
