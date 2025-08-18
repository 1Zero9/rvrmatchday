export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#001F3F] text-white py-4 text-center text-base shadow-inner">
      <div className="max-w-6xl mx-auto px-4">
        <p className="font-medium">
          © {new Date().getFullYear()} RVR Football Club · All rights reserved
        </p>
      </div>
    </footer>
  );
}
