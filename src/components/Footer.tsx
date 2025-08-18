import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-gray-800 text-white border-t border-gray-700 relative"
      style={{
        backgroundImage: 'url(/images/footer_grass.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-gray-900/80"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left side - Logo and name */}
          <div className="flex items-center space-x-3 mb-3 md:mb-0">
            <Image src="/images/logo.png" alt="Club Logo" width={32} height={32} />
            <div>
              <h3 className="font-bold text-base">Rivervalley Rangers AFC</h3>
              <p className="text-gray-200 text-xs">Building Community Through Football</p>
            </div>
          </div>
          
          {/* Center - Quick Links */}
          <div className="flex space-x-4 mb-3 md:mb-0">
            <Link href="/about" className="text-gray-200 hover:text-white transition-colors text-sm">About</Link>
            <Link href="/join" className="text-gray-200 hover:text-white transition-colors text-sm">Join</Link>
            <Link href="/contact" className="text-gray-200 hover:text-white transition-colors text-sm">Contact</Link>
          </div>
          
          {/* Right side - Copyright */}
          <p className="text-gray-300 text-xs text-center md:text-right">
            © {currentYear} Rivervalley Rangers AFC
          </p>
        </div>
      </div>
    </footer>
  );
}
