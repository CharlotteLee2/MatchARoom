import AuthGate from "../components/AuthGate";
import Image from "next/image";

export default function Home() {
  return (
    <AuthGate>
      <div className="min-h-screen bg-white">
        <main className="mx-auto w-full max-w-6xl px-6 py-8">
          <section className="w-full">
            {/* Homepage should only show recent forum posts; none exist, so this is intentionally left empty. */}
          </section>
        </main>
      </div>
    </AuthGate>
  );
}
