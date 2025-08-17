import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

interface Opponent {
  id: string;
  name: string;
}
interface Venue {
  id: string;
  name: string;
}

export default function NewMatch() {
  const router = useRouter();
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  const [opponentId, setOpponentId] = useState("");
  const [venueId, setVenueId] = useState("");
  const [date, setDate] = useState("");
  const [homeAway, setHomeAway] = useState("Home");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: opps } = await supabase.from("opponents").select("*");
      if (opps) setOpponents(opps);

      const { data: vens } = await supabase.from("venues").select("*");
      if (vens) setVenues(vens);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("matches").insert([
      {
        opponent_id: opponentId,
        venue_id: venueId || null,
        date,
        home_away: homeAway,
        notes,
        our_score: 0,
        their_score: 0,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error saving match");
    } else {
      alert("Match saved!");
      router.push("/app/matches");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Record New Match</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow p-6 rounded-lg"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Opponent
          </label>
          <select
            value={opponentId}
            onChange={(e) => setOpponentId(e.target.value)}
            required
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="">Select opponent</option>
            {opponents.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Venue</label>
          <select
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="">Select venue</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Home / Away
          </label>
          <select
            value={homeAway}
            onChange={(e) => setHomeAway(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option>Home</option>
            <option>Away</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Match"}
        </button>
      </form>
    </div>
  );
}
