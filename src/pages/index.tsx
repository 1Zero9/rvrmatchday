import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RedirectToHome() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to home page
    router.push('/home');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="text-4xl mb-4">⚽</div>
        <p>Redirecting to home...</p>
      </div>
    </div>
  );
}