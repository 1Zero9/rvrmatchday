export default function Footer() {
  return (
    <footer className="bg-[#001f3f] text-white py-4 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} RVR Football Club. All rights reserved.</p>
      </div>
    </footer>
  );
}
