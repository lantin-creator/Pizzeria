import { Router } from "express";
import { prisma } from "../db.js";
import { mapDbError } from "../util.js";
import { getCart } from "./cart.js";

const router = Router();

router.post("/check", async (req, res) => {
  const code = typeof req.body.code === "string" ? req.body.code.trim().slice(0, 40) : "";
  if (!code) return res.status(400).json({ error: "BAD_INPUT" });

  const cart = await getCart(req.userId);
  if (cart.items.length === 0) return res.status(400).json({ error: "CART_EMPTY" });

  try {
    const [row] = await prisma.$queryRaw`
      select o_discount as discount
      from promo_discount(${req.userId}::uuid, ${code}::text, ${cart.total}::int)`;
    res.json({
      code: code.toUpperCase(),
      discount: row.discount,
      total: cart.total,
      finalTotal: cart.total - row.discount,
    });
  } catch (e) {
    const m = mapDbError(e);
    if (m) return res.status(m.status).json({ error: m.error });
    throw e;
  }
});

export default router;