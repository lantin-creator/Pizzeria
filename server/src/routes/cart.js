import { Router } from "express";
import { prisma } from "../db.js";
import { toInt } from "../util.js";

const router = Router();

export async function getCart(userId) {
  const items = await prisma.$queryRaw`
    select c.quantity, v.id::int as "variantId", v.label, v.price,
           p.name, p.image, p.category
    from cart_items c
    join product_variants v on v.id = c.variant_id
    join products p on p.id = v.product_id
    where c.user_id = ${userId}::uuid
    order by c.id`;
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return { items, total };
}

router.get("/", async (req, res) => {
  res.json(await getCart(req.userId));
});

router.post("/items", async (req, res) => {
  const variantId = toInt(req.body.variantId);
  const quantity = toInt(req.body.quantity ?? 1);

  if (!(variantId > 0) || !(quantity >= 1 && quantity <= 50)) {
    return res.status(400).json({ error: "BAD_INPUT" });
  }

  try {
    console.log("[CART] 1. Before INSERT");

    const added = await prisma.$executeRaw`
      insert into cart_items (user_id, variant_id, quantity)
      select ${req.userId}::uuid, v.id, ${quantity}::int
      from product_variants v
      join products p on p.id = v.product_id
      where v.id = ${variantId}::bigint and p.is_active
      on conflict (user_id, variant_id)
      do update set quantity = least(cart_items.quantity + excluded.quantity, 50)
    `;

    console.log("[CART] 2. INSERT completed:", added);

    if (added === 0) {
      return res.status(404).json({ error: "VARIANT_NOT_FOUND" });
    }

    console.log("[CART] 3. Before getCart");

    const cart = await getCart(req.userId);

    console.log("[CART] 4. getCart completed");

    res.json(cart);
  } catch (error) {
    console.error("[CART] FAILED:", error);
    res.status(500).json({ error: "CART_OPERATION_FAILED" });
  }
});

router.patch("/items/:variantId", async (req, res) => {
  const variantId = toInt(req.params.variantId);
  const quantity = toInt(req.body.quantity);
  if (!(variantId > 0) || !(quantity >= 0 && quantity <= 50)) {
    return res.status(400).json({ error: "BAD_INPUT" });
  }
  const where = { userId: req.userId, variantId: BigInt(variantId) };
  if (quantity === 0) await prisma.cartItem.deleteMany({ where });
  else await prisma.cartItem.updateMany({ where, data: { quantity } });
  res.json(await getCart(req.userId));
});

router.delete("/items/:variantId", async (req, res) => {
  const variantId = toInt(req.params.variantId);
  if (!(variantId > 0)) return res.status(400).json({ error: "BAD_INPUT" });
  await prisma.cartItem.deleteMany({
    where: { userId: req.userId, variantId: BigInt(variantId) },
  });
  res.json(await getCart(req.userId));
});

router.delete("/", async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.userId } });
  res.json({ items: [], total: 0 });
});

export default router;