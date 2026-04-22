#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🔧 Initializing database schema...');

    // Run prisma db push to create/update schema
    console.log('Running: npx prisma db push --skip-generate');
    execSync('npx prisma db push --skip-generate', {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.warn('⚠️  Database initialization warning:', error.message);
    console.log('Continuing anyway...');
    // Don't exit, just continue
  }
}

initializeDatabase();
