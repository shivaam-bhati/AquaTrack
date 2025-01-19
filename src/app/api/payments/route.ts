import { db } from "@/db";
import { payments } from "@/db/schema";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createPaymentSchema = z.object({
  customerId: z.number(),
  amount: z.string().min(1),
  date: z.string().min(1),
  note: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const result = createPaymentSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const { customerId, amount, date, note } = result.data;

    const payment = await db
      .insert(payments)
      .values({
        customer_id: customerId,
        amount: parseFloat(amount),
        date: new Date(date),
        note: note || null,
        user_id: session.user.id,
      })
      .returning();

    return NextResponse.json(payment[0]);
  } catch (error) {
    console.error("Error creating payment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 