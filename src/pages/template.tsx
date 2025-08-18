interface PageProps {
  title: string;
  children: React.ReactNode;
}

export default function PageTemplate({ title, children }: PageProps) {
  return (
    <main className="min-h-screen bg-white text-black pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-[#001F3F] mb-6">{title}</h1>
        <div className="text-lg leading-relaxed">{children}</div>
      </div>
    </main>
  );
}
