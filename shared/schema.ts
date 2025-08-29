import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // vegetables, fruits
  unit: varchar("unit", { length: 20 }).notNull().default("كيلوغرام"),
  icon: varchar("icon", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wilayas = pgTable("wilayas", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
});

export const prices = pgTable("prices", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: uuid("product_id").notNull(),
  wilayaId: uuid("wilaya_id").notNull(),
  marketType: varchar("market_type", { length: 20 }).notNull(), // wholesale, retail
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  previousPrice: decimal("previous_price", { precision: 10, scale: 2 }),
  changePercentage: decimal("change_percentage", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertWilayaSchema = createInsertSchema(wilayas).omit({
  id: true,
});

export const insertPriceSchema = createInsertSchema(prices).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const updatePriceSchema = insertPriceSchema.extend({
  id: z.string().uuid(),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertWilaya = z.infer<typeof insertWilayaSchema>;
export type InsertPrice = z.infer<typeof insertPriceSchema>;
export type UpdatePrice = z.infer<typeof updatePriceSchema>;

export type Product = typeof products.$inferSelect;
export type Wilaya = typeof wilayas.$inferSelect;
export type Price = typeof prices.$inferSelect;

export type PriceWithDetails = Price & {
  product: Product;
  wilaya: Wilaya;
};

export type ProductStats = {
  totalProducts: number;
  activeWilayas: number;
  lastUpdate: string;
  averagePrice: number;
};
