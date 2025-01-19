import {
  pgTable,
  serial,
  varchar,
  date,
  integer,
  decimal,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";


export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const customers = pgTable("customer", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull().unique(),
  address: varchar("address", { length: 255 }),
  pricePerJar: decimal("price_per_jar", { precision: 10, scale: 2 }).notNull(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" })
});

export const orders = pgTable("order", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id, {onUpdate: "cascade", onDelete: "cascade"}),
  givenJars: integer("given_jars").notNull(),
  returnedJars: integer("returned_jars").notNull(),
  date: date("date").notNull(),
});

export const payments = pgTable("payment", {
  id: serial("id").primaryKey(),
  customer_id: integer("customer_id").notNull().references(() => customers.id, {
    onDelete: "cascade",
    onUpdate: "cascade"
  }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  note: varchar("note", { length: 255 }),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" })
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);
