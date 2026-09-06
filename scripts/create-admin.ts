import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { PasswordService } from "@/auth/password.service";

const ADMIN_EMAIL = "admin@demo-restaurant.com";
const ADMIN_PASSWORD = "Admin123!";
const ESTABLISHMENT_ID = 1;

async function main() {
  const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();

  const [existingUser] = await db
    .select({
      id: users.id,
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existingUser) {
    console.log(
      `El usuario ${existingUser.email} ya existe.`
    );
    return;
  }

  const passwordHash =
    await PasswordService.hash(ADMIN_PASSWORD);

  const [createdUser] = await db
    .insert(users)
    .values({
      establishmentId: ESTABLISHMENT_ID,
      email: normalizedEmail,
      password: passwordHash,
      name: "Administrador",
      role: "admin",
      active: true,
    })
    .returning({
      id: users.id,
      establishmentId: users.establishmentId,
      email: users.email,
      name: users.name,
      role: users.role,
      active: users.active,
    });

  console.log("Administrador creado correctamente:");
  console.log(createdUser);
  console.log("");
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(
      "Error creando administrador:",
      error
    );
    process.exit(1);
  });