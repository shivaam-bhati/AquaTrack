import { db } from "@/db";
import { customers } from "@/db/schema";
import { auth } from "@/lib/auth";
import { sql, and, eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define the schema for request body
const createCustomerSchema = z.object({
  name: z.string().min(1),
  phone: z.string()
    .regex(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/, 'Invalid Indian phone number format')
    .transform(val => val.replace(/[\s\-]/g, '')), // Clean up the format
  address: z.string().optional(),
  pricePerJar: z.string().or(z.number()).transform(val => val.toString()),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;

    const isDropdown = searchParams.get("dropdown") === "true";
    
    if (isDropdown) {
      const customersList = await db
        .select({ id: customers.id, name: customers.name })
        .from(customers)
        .where(eq(customers.userId, session.user.id))
        .execute();

      return NextResponse.json({
        customers: customersList,
      });
    }

    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination with user filter
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(
        and(
          eq(customers.userId, session.user.id),
          or(
            sql`LOWER(name) LIKE LOWER(${`%${query}%`})`,
            sql`phone LIKE ${`%${query}%`}`
          )
        )
      )
      .execute();

    const totalCount = totalCountResult[0].count;

    // Get customers with pagination and user filter
    const customersList = await db
      .select()
      .from(customers)
      .where(
        and(
          eq(customers.userId, session.user.id),
          or(
            sql`LOWER(name) LIKE LOWER(${`%${query}%`})`,
            sql`phone LIKE ${`%${query}%`}`
          )
        )
      )
      .limit(limit)
      .offset(offset)
      .execute();

    return NextResponse.json({
      customers: customersList,
      pagination: {
        total: totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
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
    const result = createCustomerSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const { name, phone, address, pricePerJar } = result.data;

    const newCustomer = await db
      .insert(customers)
      .values({
        name,
        phone,
        address,
        userId: session.user.id as string,
        pricePerJar,
      })
      .returning();

    return NextResponse.json(newCustomer[0]);
  } catch (error) {
    console.error("Error creating customer:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 