export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">RVR Matchday</h1>
          <p className="text-sm text-slate-600">If you can read this, React is mounted.</p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-slate-700">Tailwind classes will style this box if Tailwind is active.</p>
        </div>
      </main>
    </div>
  );
}
