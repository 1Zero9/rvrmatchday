import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#001f3f] text-white py-6 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src="/images/logo.png" alt="Club Logo" width={40} height={40} />
          <span className="font-semibold text-lg">RVR FC</span>
        </div>
        <p className="text-sm mt-2 md:mt-0">
          © {new Date().getFullYear()} RVR Football Club. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
