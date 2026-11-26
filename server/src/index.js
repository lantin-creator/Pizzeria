import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db.js";
import { requireAuth } from "./auth.js";
import products from "./routes/products.js";
import cart from "./routes/cart.js";
import wallet from "./routes/wallet.js";
import orders from "./routes/orders.js";
import promo from "./routes/promo.js";

BigInt.prototype.toJSON = function () {
  return Number(this);
};

process.on("uncaughtException", (e) => console.error("uncaught:", e.message));
process.on("unhandledRejection", (e) => console.error("unhandled:", e));

const app = express();

const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",");
app.use(cors({ origin: origins }));
app.use((req, res, next) => {
  const t = Date.now();
  console.log("->", req.method, req.url);
  res.on("finish", () => {
    console.log("<-", req.method, req.url, res.statusCode, `${Date.now() - t}ms`);
  });
  next();
});
app.use(express.json());
app.use((req, _res, next) => {
  req.body ??= {};
  next();
});

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`select 1`;
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

app.use("/products", products);
app.use("/cart", requireAuth, cart);
app.use("/wallet", requireAuth, wallet);
app.use("/orders", requireAuth, orders);
app.use("/promo", requireAuth, promo);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "SERVER_ERROR" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API on http://localhost:${port}`));