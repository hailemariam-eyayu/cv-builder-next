import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Download, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">CV Builder Pro</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build Your Perfect CV in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional drag-and-drop CV builder with beautiful templates. Create, customize, and export your resume with ease.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8">
                Start Building Free
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Templates
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Sparkles className="w-8 h-8 text-blue-600" />}
            title="Drag & Drop Editor"
            description="Intuitive interface with real-time preview. Build your CV exactly how you want it."
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8 text-purple-600" />}
            title="Professional Templates"
            description="Choose from dozens of ATS-friendly templates designed by experts."
          />
          <FeatureCard
            icon={<Download className="w-8 h-8 text-green-600" />}
            title="Export Anywhere"
            description="Download as PDF, PNG, or share with a unique link."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
