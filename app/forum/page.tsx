"use client";
import RoomListingForm, { RoomFormData } from "../../components/RoomListingForm";
import { useRouter } from "next/navigation";

export default function ForumPage() {
  const router = useRouter();

  function handleCreate(data: RoomFormData) {
    router.push("/explore");
  }

  return (
    <main className="min-h-screen bg-[#F5EEE6] py-14 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-[#356859] mb-4">Create a Post</h1>
      <RoomListingForm
        onCreate={handleCreate}
        communities={[
          "Looking For a Roommate",
          "Station Residents",
          "Auden Buffalo",
          "Chestnut Place",
          "Move-In Help",
          "Cheap Housing Deals"
        ]}
      />
      <button
        onClick={() => router.push("/explore")}
        className="mt-6 px-6 py-2 rounded-full bg-[#A87C5F] text-white font-semibold shadow hover:bg-[#6D4E2E]"
      >
        Back to Explore
      </button>
    </main>
  );
}
