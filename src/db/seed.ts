import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";
import {users, customers, orders, sessions, accounts, verificationTokens} from "./schema"

async function main() {
  console.log("🌱 Starting database seeding...");

  const db = drizzle(process.env.DATABASE_URL!);
  await seed(db, { customers, orders, users,sessions,accounts,verificationTokens });

  console.log("✅ Seeding completed!");

}

main();
