export default function Footer() {
  return (
    <footer className="bg-[#001f3f] text-white fixed bottom-0 left-0 w-full py-4">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-3">
        <img src="/images/logo.png" alt="Club Logo" className="h-6 w-6" />
        <p>&copy; {new Date().getFullYear()} RVR Football Club</p>
      </div>
    </footer>
  );
}
