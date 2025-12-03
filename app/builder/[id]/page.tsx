"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { DragDropEditor } from "@/components/cv-builder/DragDropEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

export default function EditCV() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const cvId = params.id as string;
  
  const [cv, setCV] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && cvId) {
      fetchCV();
    }
  }, [status, cvId]);

  const fetchCV = async () => {
    try {
      const res = await fetch(`/api/cv/${cvId}`);
      const data = await res.json();
      if (res.ok) {
        setCV(data.cv);
      } else {
        console.error("Failed to fetch CV");
      }
    } catch (error) {
      console.error("Error fetching CV:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (components: any[]) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/cv/${cvId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cv?.title || "My CV",
          content: { components },
        }),
      });

      if (res.ok) {
        alert("CV saved successfully!");
      } else {
        alert("Failed to save CV");
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      alert("Error saving CV");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading CV...</p>
        </div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">CV not found</p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-white border-b px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">{cv.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {saving && <span className="text-sm text-gray-600">Saving...</span>}
        </div>
      </nav>
      <div className="flex-1 overflow-hidden">
        <DragDropEditor
          initialComponents={cv.content?.components || []}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
