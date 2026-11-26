import { Router } from "express";
import { prisma } from "../db.js";
import { toInt, mapDbError } from "../util.js";
import { getCart } from "./cart.js";

const router = Router();

async function checkout(userId, address, promo) {
  try {
    const [row] = await prisma.$queryRaw`
      select checkout_order(${userId}::uuid, ${address}::text, ${promo}::text) as id`;
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    return { ok: true, orderId: Number(row.id), balance: wallet?.balance ?? 0 };
  } catch (e) {
    const m = mapDbError(e);
    if (m) return { ok: false, ...m };
    throw e;
  }
}

const cleanAddress = (a) => (typeof a === "string" && a.trim() ? a.trim().slice(0, 300) : null);
const cleanPromo = (p) => (typeof p === "string" && p.trim() ? p.trim().slice(0, 40) : null);

router.post("/checkout", async (req, res) => {
  const result = await checkout(req.userId, cleanAddress(req.body.address), cleanPromo(req.body.promo));
  if (!result.ok) return res.status(result.status).json({ error: result.error });
  res.json({ orderId: result.orderId, balance: result.balance });
});

router.get("/last", async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { userId: req.userId, status: "PAID" },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  res.json({ order });
});

router.post("/:id/repeat", async (req, res) => {
  const orderId = toInt(req.params.id);
  const mode = req.body.mode === "pay" ? "pay" : "cart";
  if (!(orderId > 0)) return res.status(400).json({ error: "BAD_INPUT" });

  const [{ n }] = await prisma.$queryRaw`
    select count(*)::int as n
    from order_items oi
    join orders o on o.id = oi.order_id
    join product_variants v on v.id = oi.variant_id
    join products p on p.id = v.product_id and p.is_active
    where oi.order_id = ${orderId}::bigint and o.user_id = ${req.userId}::uuid`;
  if (n === 0) return res.status(404).json({ error: "ORDER_NOT_FOUND_OR_UNAVAILABLE" });

  await prisma.cartItem.deleteMany({ where: { userId: req.userId } });
  await prisma.$executeRaw`
    insert into cart_items (user_id, variant_id, quantity)
    select o.user_id, oi.variant_id, oi.quantity
    from order_items oi
    join orders o on o.id = oi.order_id
    join product_variants v on v.id = oi.variant_id
    join products p on p.id = v.product_id and p.is_active
    where oi.order_id = ${orderId}::bigint and o.user_id = ${req.userId}::uuid
    on conflict (user_id, variant_id)
    do update set quantity = least(cart_items.quantity + excluded.quantity, 50)`;

  if (mode === "cart") return res.json(await getCart(req.userId));

  const result = await checkout(req.userId, cleanAddress(req.body.address), null);
  if (!result.ok) return res.status(result.status).json({ error: result.error });
  res.json({ orderId: result.orderId, balance: result.balance });
});

export default router;