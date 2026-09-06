import "dotenv/config";

import { eq } from "drizzle-orm";

import { PasswordService } from "../src/auth/password.service";
import { db, pool } from "../src/db";
import {
  establishments,
  users,
} from "../src/db/schema";

function requireEnv(name: string) {
  const value =
    process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `${name} is required`
    );
  }

  return value;
}

async function main() {
  const establishmentName =
    requireEnv(
      "BOOTSTRAP_ESTABLISHMENT_NAME"
    );

  const establishmentSlug =
    requireEnv(
      "BOOTSTRAP_ESTABLISHMENT_SLUG"
    ).toLowerCase();

  const adminName =
    requireEnv(
      "BOOTSTRAP_ADMIN_NAME"
    );

  const adminEmail =
    requireEnv(
      "BOOTSTRAP_ADMIN_EMAIL"
    ).toLowerCase();

  const adminPassword =
    requireEnv(
      "BOOTSTRAP_ADMIN_PASSWORD"
    );

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
      establishmentSlug
    )
  ) {
    throw new Error(
      "BOOTSTRAP_ESTABLISHMENT_SLUG must contain only lowercase letters, numbers and hyphens"
    );
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      adminEmail
    )
  ) {
    throw new Error(
      "BOOTSTRAP_ADMIN_EMAIL is invalid"
    );
  }

  if (
    adminPassword.length < 12
  ) {
    throw new Error(
      "BOOTSTRAP_ADMIN_PASSWORD must contain at least 12 characters"
    );
  }

  const result =
    await db.transaction(
      async (tx) => {
        const [existingEstablishment] =
          await tx
            .select({
              id: establishments.id,
              name: establishments.name,
              slug: establishments.slug,
            })
            .from(establishments)
            .where(
              eq(
                establishments.slug,
                establishmentSlug
              )
            )
            .limit(1);

        const [existingAdmin] =
          await tx
            .select({
              id: users.id,
              establishmentId:
                users.establishmentId,
              email: users.email,
              role: users.role,
            })
            .from(users)
            .where(
              eq(
                users.email,
                adminEmail
              )
            )
            .limit(1);

        if (
          existingAdmin &&
          !existingEstablishment
        ) {
          throw new Error(
            "BOOTSTRAP_CONFLICT: admin email already exists but establishment slug does not"
          );
        }

        if (
          existingAdmin &&
          existingEstablishment &&
          existingAdmin.establishmentId !==
            existingEstablishment.id
        ) {
          throw new Error(
            "BOOTSTRAP_CONFLICT: admin belongs to another establishment"
          );
        }

        if (
          existingAdmin &&
          existingAdmin.role !== "admin"
        ) {
          throw new Error(
            "BOOTSTRAP_CONFLICT: existing user is not an admin"
          );
        }

        if (
          existingEstablishment &&
          existingAdmin
        ) {
          return {
            alreadyExists: true,
            establishment:
              existingEstablishment,
            admin: {
              id: existingAdmin.id,
              email:
                existingAdmin.email,
              role:
                existingAdmin.role,
            },
          };
        }

        let establishment =
          existingEstablishment;

        if (!establishment) {
          [establishment] =
            await tx
              .insert(
                establishments
              )
              .values({
                name:
                  establishmentName,
                slug:
                  establishmentSlug,
                defaultLanguage:
                  "es",
                enabledLanguages: [
                  "es",
                  "en",
                  "fr",
                ],
                currency: "EUR",
                timezone:
                  "Europe/Madrid",
                active: true,
                updatedAt:
                  new Date(),
              })
              .returning({
                id: establishments.id,
                name:
                  establishments.name,
                slug:
                  establishments.slug,
              });
        }

        if (!establishment) {
          throw new Error(
            "ESTABLISHMENT_CREATION_FAILED"
          );
        }

        const hashedPassword =
          await PasswordService.hash(
            adminPassword
          );

        const [admin] =
          await tx
            .insert(users)
            .values({
              establishmentId:
                establishment.id,
              email: adminEmail,
              password:
                hashedPassword,
              name: adminName,
              role: "admin",
              active: true,
              updatedAt:
                new Date(),
            })
            .returning({
              id: users.id,
              establishmentId:
                users.establishmentId,
              email: users.email,
              name: users.name,
              role: users.role,
              active: users.active,
            });

        if (!admin) {
          throw new Error(
            "ADMIN_CREATION_FAILED"
          );
        }

        return {
          alreadyExists: false,
          establishment,
          admin,
        };
      }
    );

  if (result.alreadyExists) {
    console.log(
      "BOOTSTRAP_ALREADY_COMPLETED"
    );
  } else {
    console.log(
      "BOOTSTRAP_COMPLETED_SUCCESSFULLY"
    );
  }

  console.log(
    `Establishment ID: ${result.establishment.id}`
  );

  console.log(
    `Establishment slug: ${result.establishment.slug}`
  );

  console.log(
    `Admin ID: ${result.admin.id}`
  );

  console.log(
    `Admin email: ${result.admin.email}`
  );
}

main()
  .catch((error) => {
    console.error(
      "BOOTSTRAP_FAILED"
    );

    console.error(
      error instanceof Error
        ? error.message
        : error
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });