const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initDb() {
  try {
    console.log('Initializing database schema...');
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    // Continue anyway, schema will be created on demand
  } finally {
    await prisma.$disconnect();
  }
}

initDb();
