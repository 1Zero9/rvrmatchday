import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Fixed header */}
      <Header />

      {/* Page content with padding to avoid overlap */}
      <main className="flex-grow pt-16 pb-16">{children}</main>

      {/* Fixed footer */}
      <Footer />
    </div>
  );
}
