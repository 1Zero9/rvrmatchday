/**
 * Debug script to check what roles are working in the database
 * Run with: node debug-roles.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function checkRoles() {
  try {
    console.log('🔍 Checking existing roles in tracker_users...');
    
    // Get all users and their roles
    const { data: users, error } = await supabase
      .from('tracker_users')
      .select('id, email, username, full_name, role')
      .limit(10);

    if (error) {
      console.error('❌ Error fetching users:', error.message);
      return;
    }

    if (!users || users.length === 0) {
      console.log('⚠️  No users found in database');
      return;
    }

    console.log('✅ Found users:');
    users.forEach(user => {
      console.log(`   ${user.full_name} (${user.email}) - Role: "${user.role}"`);
    });

    // Get unique roles
    const uniqueRoles = [...new Set(users.map(u => u.role))];
    console.log('\n📊 Unique roles currently in database:', uniqueRoles);

    // Test role constraints by trying common role values
    console.log('\n🧪 Testing role constraints...');
    const testRoles = ['admin', 'parent', 'coach', 'editor', 'manager', 'volunteer'];
    
    for (const testRole of testRoles) {
      const isUsed = uniqueRoles.includes(testRole);
      console.log(`   ${testRole}: ${isUsed ? '✅ Currently used' : '❓ Untested'}`);
    }

    console.log('\n💡 Recommendation: Use roles that are currently used and working');

  } catch (error) {
    console.error('❌ Script error:', error.message);
  }
}

// Check if we're in the right environment
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('⚠️  Please make sure you\'re in the project directory with .env.local file');
  process.exit(1);
}

checkRoles();