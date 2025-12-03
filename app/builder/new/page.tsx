"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DragDropEditor } from "@/components/cv-builder/DragDropEditor";

export default function NewCV() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleSave = async (components: any[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled CV",
          content: { components },
          isPublic: false,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/builder/${data.cv._id}`);
      }
    } catch (error) {
      console.error("Failed to save CV:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-white border-b px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold">New CV</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Back to Dashboard
        </button>
      </nav>
      <div className="flex-1 overflow-hidden">
        <DragDropEditor onSave={handleSave} />
      </div>
    </div>
  );
}
