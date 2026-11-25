import { Router } from "express";
import { prisma } from "../db.js";
import { toInt, errText } from "../util.js";

const router = Router();

router.get("/", async (req, res) => {
  const wallet = await prisma.wallet.findUnique({ where: { userId: req.userId } });
  if (!wallet) return res.status(404).json({ error: "WALLET_NOT_FOUND" });
  res.json({ balance: wallet.balance });
});

router.post("/topup", async (req, res) => {
  const amount = toInt(req.body.amount);
  if (!(amount >= 1 && amount <= 100000)) {
    return res.status(400).json({ error: "BAD_AMOUNT" });
  }
  try {
    const [row] = await prisma.$queryRaw`
      select topup_wallet(${req.userId}::uuid, ${amount}::int) as balance`;
    res.json({ balance: row.balance });
  } catch (e) {
    if (errText(e).includes("WALLET_NOT_FOUND")) {
      return res.status(404).json({ error: "WALLET_NOT_FOUND" });
    }
    throw e;
  }
});

export default router;