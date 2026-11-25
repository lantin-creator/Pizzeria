import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get("/", async (_req, res) => {
  const products = await prisma.$queryRaw`
    select p.id::int as id, p.slug, p.name, p.category, p.image,
           p.is_popular as "isPopular",
           coalesce(
             json_agg(json_build_object('id', v.id, 'label', v.label, 'price', v.price)
                      order by v.price) filter (where v.id is not null),
             '[]'::json
           ) as variants
    from products p
    left join product_variants v on v.product_id = p.id
    where p.is_active
    group by p.id
    order by p.id`;
  res.json(products);
});

export default router;