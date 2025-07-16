const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Database seeding completed successfully!');
  console.log('No users will be created automatically.');
  console.log('Please create your admin user manually through the database or application.');
  console.log('');
  console.log('To create an admin user, you can:');
  console.log('1. Use the application to add users through the admin interface');
  console.log('2. Insert directly into the database with a hashed password');
  console.log('3. Use the update-admin-password.ts script if you have an existing admin user');
  console.log('');
  console.log('Available roles:');
  console.log('- administrator: Full access to all features');
  console.log('- employee: All permissions except user management');
  console.log('- reviewer: Read-only access to reports, notifications, and tasks');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 