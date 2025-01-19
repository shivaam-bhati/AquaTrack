import { db } from "@/db";
import { orders, customers } from "@/db/schema";
import { auth } from "@/lib/auth";
import { sql, and, eq, or, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define the schema for request body
const createOrderSchema = z.object({
  customerId: z.string().min(1),
  givenJars: z.string().min(1),
  returnedJars: z.string().min(1),
  date: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination with user filter
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .innerJoin(customers, eq(orders.customerId, customers.id))
      .where(
        and(
          eq(customers.userId, session.user.id),
          or(
            sql`LOWER(${customers.name}) LIKE LOWER(${`%${query}%`})`,
            sql`${customers.phone} LIKE ${`%${query}%`}`
          )
        )
      )
      .execute();

    const totalCount = totalCountResult[0].count;

    // Get orders with customer details
    const ordersList = await db
      .select({
        id: orders.id,
        customerId: orders.customerId,
        customerName: customers.name,
        givenJars: orders.givenJars,
        returnedJars: orders.returnedJars,
        date: orders.date,
        netAmount: sql<number>`${orders.givenJars} * ${customers.pricePerJar}::decimal`,
      })
      .from(orders)
      .innerJoin(customers, eq(orders.customerId, customers.id))
      .where(
        and(
          eq(customers.userId, session.user.id),
          or(
            sql`LOWER(${customers.name}) LIKE LOWER(${`%${query}%`})`,
            sql`${customers.phone} LIKE ${`%${query}%`}`
          )
        )
      )
      .orderBy(desc(orders.date))
      .limit(limit)
      .offset(offset)
      .execute();

    return NextResponse.json({
      orders: ordersList,
      pagination: {
        total: totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const { customerId, givenJars, returnedJars, date } = result.data;

    // Verify customer belongs to user
    const customer = await db
      .select()
      .from(customers)
      .where(
        and(
          eq(customers.id, parseInt(customerId)),
          eq(customers.userId, session.user.id)
        )
      )
      .execute();

    if (!customer.length) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    const newOrder = await db
      .insert(orders)
      .values({
        customerId: parseInt(customerId),
        givenJars: parseInt(givenJars),
        returnedJars: parseInt(returnedJars),
        date: date,
      })
      .returning();

    return NextResponse.json(newOrder[0]);
  } catch (error) {
    console.error("Error creating order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 