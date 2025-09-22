/**
 * Test Data Creation for Homepage
 * Creates sample matches and news for testing the dynamic home page
 */

import { supabase } from './supabase';

export async function createSampleData() {
  try {
    // First, let's check if we have teams
    const { data: teams } = await supabase
      .from('teams')
      .select('id, name')
      .limit(5);

    console.log('Existing teams:', teams);

    // Create some teams if none exist
    if (!teams || teams.length === 0) {
      const { data: newTeams, error: teamsError } = await supabase
        .from('teams')
        .insert([
          {
            name: 'RVR FC Senior',
            short_name: 'RVR',
            season: '2024/25',
            is_active: true,
            is_public: true
          },
          {
            name: 'Millbrook FC',
            short_name: 'MFC',
            season: '2024/25',
            is_active: true,
            is_public: true
          },
          {
            name: 'Oakwood United',
            short_name: 'OAK',
            season: '2024/25',
            is_active: true,
            is_public: true
          }
        ])
        .select();

      if (teamsError) {
        console.error('Error creating teams:', teamsError);
        return;
      }

      console.log('Created teams:', newTeams);
    }

    // Get teams for matches
    const { data: allTeams } = await supabase
      .from('teams')
      .select('id, name')
      .limit(10);

    if (!allTeams || allTeams.length < 2) {
      console.error('Need at least 2 teams to create matches');
      return;
    }

    // Use existing teams - treat first team as "home" team (RVR substitute)
    const homeTeam = allTeams[0];
    const awayTeam1 = allTeams[1] || allTeams[0];
    const awayTeam2 = allTeams[2] || allTeams[1] || allTeams[0];

    console.log(`Using teams: ${homeTeam.name} vs opponents`);

    // Create a completed match (latest result)
    const { data: completedMatch, error: matchError } = await supabase
      .from('matches')
      .insert({
        home_team: homeTeam.id,
        away_team: awayTeam1.id,
        home_score: 3,
        away_score: 1,
        match_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
        match_time: '15:00',
        venue: 'Home Ground',
        status: 'completed'
      })
      .select();

    if (matchError) {
      console.error('Error creating completed match:', matchError);
    } else {
      console.log('Created completed match:', completedMatch);
    }

    // Create an upcoming match (next fixture)
    const { data: upcomingMatch, error: fixtureError } = await supabase
      .from('matches')
      .insert({
        home_team: homeTeam.id,
        away_team: awayTeam2.id,
        match_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
        match_time: '15:00',
        venue: 'Home Ground',
        status: 'scheduled'
      })
      .select();

    if (fixtureError) {
      console.error('Error creating upcoming match:', fixtureError);
    } else {
      console.log('Created upcoming match:', upcomingMatch);
    }

    // Create a news article
    const { data: newsArticle, error: newsError } = await supabase
      .from('news_articles')
      .insert({
        title: 'U16 Boys Reach County Cup Final',
        excerpt: 'Historic achievement for our youth team as they secure their place in the county cup final.',
        content: 'Our U16 Boys team has made club history by reaching the County Cup Final after a thrilling 3-2 victory over local rivals. The team showed tremendous character coming from behind to secure their place in the final.',
        author: 'RVR FC',
        category: 'Youth Football',
        status: 'published',
        publish_date: new Date().toISOString(),
        featured: true
      })
      .select();

    if (newsError) {
      console.error('Error creating news article:', newsError);
    } else {
      console.log('Created news article:', newsArticle);
    }

    console.log('Sample data creation completed!');

  } catch (error) {
    console.error('Error creating sample data:', error);
  }
}

// Function to check what tables exist
export async function checkTables() {
  const tables = ['teams', 'matches', 'news_articles'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`Table ${table} error:`, error);
      } else {
        console.log(`Table ${table} exists and has ${data?.length || 0} sample records`);
      }
    } catch (error) {
      console.error(`Error checking table ${table}:`, error);
    }
  }
}