import db from "@/db/db"
import { NextResponse } from "next/server";

export const POST = async () => {
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
    orderBy: {
      name: "asc"
    }
  });

  return NextResponse.json(products, { status: 200 });
}