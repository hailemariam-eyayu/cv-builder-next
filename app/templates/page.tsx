"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Template {
  _id: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  thumbnail: string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const useTemplate = async (templateId: string) => {
    try {
      // First, get the template details
      const template = templates.find(t => t._id === templateId);
      if (!template) {
        console.error("Template not found");
        return;
      }

      // Fetch full template with structure
      const templateRes = await fetch(`/api/templates/${templateId}`);
      const templateData = await templateRes.json();
      
      // Create CV with template structure
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${template.name} - My CV`,
          templateId,
          content: templateData.template?.structure || { components: [] },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/builder/${data.cv._id}`);
      }
    } catch (error) {
      console.error("Failed to create CV:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading templates...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Choose a Template</h1>
        <p className="text-gray-600 mb-8">Select a professional template and customize it with your information</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template._id} className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-sm text-gray-600">{template.category}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                  {template.isPremium && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <Button
                  className="w-full"
                  onClick={() => useTemplate(template._id)}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No templates available</p>
          </div>
        )}
      </main>
    </div>
  );
}
