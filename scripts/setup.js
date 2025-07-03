const { execSync } = require("child_process")

console.log("🚀 Setting up StokIn Lite...")

try {
  console.log("📦 Generating Prisma client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  console.log("🗄️ Pushing database schema...")
  execSync("npx prisma db push", { stdio: "inherit" })

  console.log("🌱 Seeding database...")
  execSync(
    "node -e \"const { execSync } = require('child_process'); execSync('psql $DATABASE_URL -f scripts/seed-data.sql', { stdio: 'inherit' });\"",
    { stdio: "inherit" },
  )

  console.log("✅ Setup completed successfully!")
  console.log("🎉 StokIn Lite is ready to deploy!")
} catch (error) {
  console.error("❌ Setup failed:", error.message)
  process.exit(1)
}
