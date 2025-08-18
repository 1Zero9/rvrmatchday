export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-4 text-[#800000]">Contact Us</h1>
      <p className="max-w-xl text-center">
        Got questions about the club? Reach out and we’ll get back to you.
      </p>
      <p className="mt-4">📧 Email: <a href="mailto:info@rvrfc.com" className="text-blue-600">info@rvrfc.com</a></p>
      <p>📍 Location: Rivervalley, Dublin</p>
    </main>
  );
}
