import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prismaClient = new PrismaClient();

interface AdminUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

const DEFAULT_ADMIN: AdminUser = {
  name: 'علي محسن',
  email: 'admin@system.com',
  password: 'admin123',
  role: 'administrator'
};

async function createDefaultAdmin() {
  try {
    console.log('🔧 Creating default admin user...');
    
    // Check if admin already exists
    const existingAdmin = await prismaClient.user.findUnique({
      where: { email: DEFAULT_ADMIN.email }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', DEFAULT_ADMIN.email);
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      console.log('📅 Created:', existingAdmin.created_at);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 12);

    // Create the admin user
    const adminUser = await prismaClient.user.create({
      data: {
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        password_hash: hashedPassword,
        role: DEFAULT_ADMIN.role,
        phone: null,
      }
    });

    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Name:', adminUser.name);
    console.log('🔑 Role:', adminUser.role);
    console.log('🆔 User ID:', adminUser.user_id);
    console.log('📅 Created:', adminUser.created_at);
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('   Email: admin@system.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login for security!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

// Run the script
createDefaultAdmin()
  .then(() => {
    console.log('🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }); 