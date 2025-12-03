"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Trash2, Edit, Share2 } from "lucide-react";

interface CV {
  _id: string;
  title: string;
  updatedAt: string;
  isPublic: boolean;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCVs();
    }
  }, [status]);

  const fetchCVs = async () => {
    try {
      const res = await fetch("/api/cv");
      const data = await res.json();
      setCvs(data.cvs || []);
    } catch (error) {
      console.error("Failed to fetch CVs:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCV = async (id: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;

    try {
      await fetch(`/api/cv/${id}`, { method: "DELETE" });
      setCvs(cvs.filter((cv) => cv._id !== id));
    } catch (error) {
      console.error("Failed to delete CV:", error);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            CV Builder Pro
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {session?.user?.name}</span>
            {session?.user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin Panel
                </Button>
              </Link>
            )}
            <Button variant="outline" size="sm" onClick={() => router.push("/api/auth/signout")}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My CVs</h1>
          <div className="flex gap-3">
            <Link href="/templates">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </Link>
            <Link href="/builder/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New CV
              </Button>
            </Link>
          </div>
        </div>

        {cvs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No CVs yet</h2>
            <p className="text-gray-600 mb-6">Create your first CV to get started</p>
            <Link href="/builder/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create CV
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <div key={cv._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  {cv.isPublic && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      Public
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{cv.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Updated {new Date(cv.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Link href={`/builder/${cv._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCV(cv._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
