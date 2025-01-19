import { db } from "@/db";
import { customers } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const createCustomerSchema = z.object({
    name: z.string().min(1),
    phone: z.string()
      .regex(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/, 'Invalid Indian phone number format')
      .transform(val => val.replace(/[\s\-]/g, '')), // Clean up the format
    address: z.string().optional(),
    pricePerJar: z.string().or(z.number()).transform(val => val.toString()),
});


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

    await db.delete(customers).where(eq(customers.id, id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

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
    const result = createCustomerSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const { name, phone, address, pricePerJar } = result.data;

    const updatedCustomer = await db
      .update(customers)
      .set({
        name,
        phone,
        address,
        pricePerJar,
      })
      .where(eq(customers.id, id))
      .returning();

    return NextResponse.json(updatedCustomer[0]);
  } catch (error) {
    console.error("Error updating customer:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 