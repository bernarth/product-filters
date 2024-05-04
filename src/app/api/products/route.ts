import db from "@/db/db"
import { ProductFilterValidator } from "@/lib/validators/product-validator";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {

  const body = await req.json();

  const { color, price, size, sort } = ProductFilterValidator.parse(body.filter);

  const whereClause = {
    AND: [
      {
        OR: color.map(value => ({
          color: {
            equals: value
          }
        }))
      },
      {
        OR: size.map(value => ({
          size: {
            equals: value
          }
        }))
      },
      {
        price: {
          gte: price[0] * 100,
          lte: price[1] * 100
        }
      }
    ]
  }

  const products = await db.product.findMany({
    skip: 0,
    take: 12,
    select: {
      id: true,
      imageId: true,
      color: true,
      name: true,
      size: true, 
      price: true
    },
    orderBy: sort === "none" ? undefined : sort === 'price-asc' ? [
      {
        price: "asc"
      },
      {
        size: "asc"
      }
    ] : [
      {
        price: "desc"
      },
      {
        size: "desc"
      }
    ],
    where: whereClause
  });

  return NextResponse.json(products, { status: 200 });
}