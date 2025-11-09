import AuthGate from "../components/AuthGate";
import Image from "next/image";

export default function Home() {
  return (
    <AuthGate>
      <div className="min-h-screen bg-white">
        <main className="mx-auto w-full max-w-6xl px-6 pt-8 pb-20">
          {/* Page Title */}
          <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#356859' }}>Home</h1>
          <section className="w-full">
            {/* Homepage should only show recent forum posts; none exist, so this is intentionally left empty. */}
          </section>
        </main>
      </div>
    </AuthGate>
  );
}
