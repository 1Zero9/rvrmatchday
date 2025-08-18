import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  currentSection?: string;
}

export default function Layout({ children, currentSection = "public" }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header currentSection={currentSection} />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  );
}
