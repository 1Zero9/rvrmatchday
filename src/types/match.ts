export interface Player {
  id: string;
  team_id: string;
  name: string;
  number?: number;
  position?: string;
}

export interface GoalEvent {
  id: string;
  match_id: string;
  team_id: string;          // ✅ required for score & flash logic
  player_id: string;        // scorer ID
  assist_id?: string | null;
  minute: number;

  // These come from Supabase joins when you select scorer:players(*), assist:players(*)
  scorer?: Player;
  assist?: Player;
}

export interface Match {
  id: string;
  team_id: string;
  date: string;
  opponent_id: string;
  home_away: "Home" | "Away";
  venue_id?: string | null;
  league_id?: string | null;
  is_friendly?: boolean;
  team_size?: number;
  our_score: number;
  their_score: number;
  notes?: string | null;

  // Optional joined objects
  opponents?: { name: string }[];
  leagues?: { name: string }[];
  venues?: { name: string }[];
}
