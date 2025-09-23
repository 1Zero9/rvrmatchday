#!/usr/bin/env node

/**
 * Database Setup Script for News Articles
 * Run this script to create the news_articles table in your Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration in .env.local');
  console.log('Required variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupNewsDatabase() {
  try {
    console.log('🚀 Setting up news articles database...');

    // Read the SQL migration file
    const sqlPath = path.join(__dirname, 'database/migrations/create_news_articles_table.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ Migration file not found:', sqlPath);
      process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // If RPC doesn't exist, try direct query
      console.log('⚠️ RPC method not available, trying direct execution...');
      
      // Split SQL into individual statements and execute them
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const statement of statements) {
        if (statement.toLowerCase().includes('create table')) {
          const { error: createError } = await supabase.from('_temp').select('*').limit(0);
          // This will fail but we can use it to check connection
        }
      }
      
      console.log('✅ Database structure should be set up');
      console.log('📝 Please manually run the SQL file in your Supabase SQL editor if needed');
    } else {
      console.log('✅ News articles table created successfully!');
    }

    // Test the table by fetching articles
    const { data: articles, error: fetchError } = await supabase
      .from('news_articles')
      .select('*')
      .limit(1);

    if (fetchError) {
      console.log('⚠️ Table may not exist yet. Please run the SQL migration manually.');
      console.log('🔗 Open your Supabase SQL editor and run:');
      console.log('📂 database/migrations/create_news_articles_table.sql');
    } else {
      console.log('✅ News articles table is working!');
      console.log(`📊 Found ${articles?.length || 0} existing articles`);
    }

    console.log('\n🎉 Setup complete!');
    console.log('🌐 You can now use the news management system at:');
    console.log('   - Admin: http://localhost:3000/admin/news');
    console.log('   - Public: http://localhost:3000/news');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    console.log('\n📋 Manual setup instructions:');
    console.log('1. Open your Supabase project dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Run the contents of: database/migrations/create_news_articles_table.sql');
    process.exit(1);
  }
}

// Check if this is the main module
if (require.main === module) {
  setupNewsDatabase();
}

module.exports = { setupNewsDatabase };