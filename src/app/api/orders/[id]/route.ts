import { db } from "@/db";
import { orders, customers } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateOrderSchema = z.object({
  customerId: z.string().min(1),
  givenJars: z.string().min(1),
  returnedJars: z.string().min(1),
  date: z.string().min(1),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const body = await request.json();
    const result = updateOrderSchema.safeParse(body);

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

    const updatedOrder = await db
      .update(orders)
      .set({
        customerId: parseInt(customerId),
        givenJars: parseInt(givenJars),
        returnedJars: parseInt(returnedJars),
        date: date,
      })
      .where(eq(orders.id, id))
      .returning();

    return NextResponse.json(updatedOrder[0]);
  } catch (error) {
    console.error("Error updating order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    await db.delete(orders).where(eq(orders.id, id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 