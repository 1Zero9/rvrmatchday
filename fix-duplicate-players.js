/**
 * Player Duplication Cleanup Script
 * Identifies and helps clean up duplicate players created by team editing bug
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-key'
);

async function findDuplicatePlayers() {
  console.log('🔍 Analyzing player duplicates...\n');
  
  try {
    // Get all players with team information
    const { data: players, error } = await supabase
      .from('players')
      .select(`
        id,
        team_id,
        first_name,
        last_name,
        position,
        is_captain,
        is_vice_captain,
        is_active,
        created_at,
        teams(name)
      `)
      .order('team_id')
      .order('first_name');

    if (error) {
      console.error('❌ Error fetching players:', error);
      return;
    }

    if (!players || players.length === 0) {
      console.log('ℹ️  No players found in database');
      return;
    }

    console.log(`📊 Found ${players.length} total players\n`);

    // Group players by team_id and name combination
    const playerGroups = {};
    
    players.forEach(player => {
      const key = `${player.team_id}_${player.first_name}_${player.last_name}`;
      if (!playerGroups[key]) {
        playerGroups[key] = [];
      }
      playerGroups[key].push(player);
    });

    // Find duplicates
    const duplicates = {};
    let totalDuplicates = 0;
    
    Object.entries(playerGroups).forEach(([key, playerList]) => {
      if (playerList.length > 1) {
        duplicates[key] = playerList;
        totalDuplicates += playerList.length - 1; // -1 because one should remain
      }
    });

    if (Object.keys(duplicates).length === 0) {
      console.log('✅ No duplicate players found! 🎉');
      return;
    }

    console.log(`⚠️  Found ${Object.keys(duplicates).length} sets of duplicate players`);
    console.log(`📈 Total duplicate records: ${totalDuplicates}\n`);

    // Display duplicates by team
    Object.entries(duplicates).forEach(([key, playerList]) => {
      const teamName = playerList[0].teams?.name || 'Unknown Team';
      const playerName = `${playerList[0].first_name} ${playerList[0].last_name}`.trim();
      
      console.log(`🏃‍♂️ ${playerName} (${teamName}) - ${playerList.length} duplicates:`);
      
      playerList.forEach((player, index) => {
        const captainInfo = player.is_captain ? ' [CAPTAIN]' : player.is_vice_captain ? ' [VICE-CAPTAIN]' : '';
        const createdAt = new Date(player.created_at).toLocaleString();
        console.log(`   ${index + 1}. ID: ${player.id} | Created: ${createdAt}${captainInfo}`);
      });
      console.log('');
    });

    // Generate cleanup recommendations
    console.log('🧹 CLEANUP RECOMMENDATIONS:\n');
    
    Object.entries(duplicates).forEach(([key, playerList]) => {
      const teamName = playerList[0].teams?.name || 'Unknown Team';
      const playerName = `${playerList[0].first_name} ${playerList[0].last_name}`.trim();
      
      // Sort by created_at to keep the oldest (original)
      const sortedPlayers = [...playerList].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      const keepPlayer = sortedPlayers[0]; // Keep the oldest
      const deletePlayerIds = sortedPlayers.slice(1).map(p => p.id);
      
      console.log(`${playerName} (${teamName}):`);
      console.log(`  ✅ KEEP: ${keepPlayer.id} (${new Date(keepPlayer.created_at).toLocaleString()})`);
      console.log(`  ❌ DELETE: ${deletePlayerIds.join(', ')}`);
      console.log('');
    });

    return duplicates;
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

async function cleanupDuplicates(dryRun = true) {
  console.log(dryRun ? '🧪 DRY RUN - No changes will be made' : '🚨 LIVE CLEANUP - Changes will be permanent');
  console.log('─'.repeat(50));
  
  const duplicates = await findDuplicatePlayers();
  
  if (!duplicates || Object.keys(duplicates).length === 0) {
    return;
  }

  let totalDeleted = 0;
  
  for (const [key, playerList] of Object.entries(duplicates)) {
    const teamName = playerList[0].teams?.name || 'Unknown Team';
    const playerName = `${playerList[0].first_name} ${playerList[0].last_name}`.trim();
    
    // Sort by created_at to keep the oldest (original)
    const sortedPlayers = [...playerList].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    const keepPlayer = sortedPlayers[0];
    const deletePlayerIds = sortedPlayers.slice(1).map(p => p.id);
    
    console.log(`\n🔧 Processing ${playerName} (${teamName}):`);
    console.log(`   Keeping: ${keepPlayer.id}`);
    console.log(`   Deleting: ${deletePlayerIds.length} duplicates`);
    
    if (!dryRun) {
      try {
        const { error } = await supabase
          .from('players')
          .delete()
          .in('id', deletePlayerIds);
          
        if (error) {
          console.error(`   ❌ Error deleting duplicates: ${error.message}`);
        } else {
          console.log(`   ✅ Successfully deleted ${deletePlayerIds.length} duplicates`);
          totalDeleted += deletePlayerIds.length;
        }
      } catch (error) {
        console.error(`   💥 Unexpected error deleting duplicates:`, error);
      }
    } else {
      console.log(`   🧪 Would delete ${deletePlayerIds.length} duplicates`);
      totalDeleted += deletePlayerIds.length;
    }
  }
  
  console.log(`\n📊 Summary: ${dryRun ? 'Would delete' : 'Deleted'} ${totalDeleted} duplicate players`);
  
  if (dryRun) {
    console.log('\n💡 To perform actual cleanup, run: node fix-duplicate-players.js --live');
  }
}

// Main execution
async function main() {
  const isLive = process.argv.includes('--live');
  const isAnalyzeOnly = process.argv.includes('--analyze');
  
  console.log('🛠️  Player Duplicate Cleanup Tool\n');
  
  if (isAnalyzeOnly) {
    await findDuplicatePlayers();
  } else {
    await cleanupDuplicates(!isLive);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { findDuplicatePlayers, cleanupDuplicates };