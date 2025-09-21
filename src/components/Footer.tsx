import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-club-primary text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          {/* Club Info */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="font-bold text-lg">Rivervalley Rangers AFC</h3>
            <p className="text-gray-300 text-sm">Building Community Through Football</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/join" className="text-gray-300 hover:text-white transition-colors">
              Join Club
            </Link>
            <Link href="/teams" className="text-gray-300 hover:text-white transition-colors">
              Teams
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
              Privacy
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right text-gray-300 text-sm mt-4 md:mt-0">
            <p>© {currentYear} RVR AFC</p>
          </div>
        </div>
      </div>
    </footer>
  );
}