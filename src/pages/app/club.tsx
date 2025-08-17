export default function Club() {
  const coach = "John Doe";
  const ground = "Riverside Park";
  const league = "U12 Premier";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Club Information</h1>
      <ul className="space-y-3">
        <li className="p-4 bg-white shadow rounded-lg">Coach: {coach}</li>
        <li className="p-4 bg-white shadow rounded-lg">Home Ground: {ground}</li>
        <li className="p-4 bg-white shadow rounded-lg">League: {league}</li>
      </ul>
    </div>
  );
}
