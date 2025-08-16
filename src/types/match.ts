export type Player = {
  id: string;
  name: string;
  shirt?: number;
  position?: string;
};

export type GoalEvent = {
  id: string;
  minute: number;
  scorerId: string;
  assistId?: string;
};

export type Match = {
  id: string;
  date: string;
  team_id: string;
  opponent_id: string | null;
  home_away: "Home" | "Away";
  our_score: number;
  their_score: number;
  notes?: string;
  opponents?: { name: string };
};
