import React, { useState } from 'react';

const CvTemplate = () => {
  // Sidebar width percentage (user can adjust)
  const [sidebarWidth, setSidebarWidth] = useState(30);

  return (
    <div className="flex min-h-screen bg-gray-100 p-8">
      {/* CV Container */}
      <div className="mx-auto flex w-[210mm] min-h-[297mm] bg-white shadow-xl overflow-hidden">
        
        {/* Sidebar Column */}
        <aside 
          style={{ width: `${sidebarWidth}%` }} 
          className="bg-slate-800 text-white p-6 transition-all"
        >
          <div className="border-2 border-dashed border-slate-600 p-4 min-h-[100px] hover:border-blue-400">
            <h2 className="font-bold uppercase tracking-wide">Contact</h2>
            <p className="text-sm opacity-80">Drag contact info here...</p>
          </div>
        </aside>

        {/* Main Body Column */}
        <main 
          style={{ width: `${100 - sidebarWidth}%` }} 
          className="p-10 text-slate-900 transition-all"
        >
          <div className="border-2 border-dashed border-gray-200 p-4 mb-6 min-h-[150px] hover:border-blue-400">
            <h1 className="text-4xl font-bold">Your Name</h1>
            <p className="text-lg text-gray-500">Professional Title</p>
          </div>

          <div className="border-2 border-dashed border-gray-200 p-4 min-h-[300px] hover:border-blue-400">
            <h3 className="font-bold border-b-2 border-slate-900 mb-2">Work Experience</h3>
            <p className="text-sm text-gray-400 italic">Drop experience blocks here...</p>
          </div>
        </main>
      </div>

      {/* Basic Width Control UI */}
      <div className="fixed bottom-5 right-5 bg-white p-4 shadow-lg rounded-lg border">
        <label className="block text-xs font-bold mb-2">Adjust Sidebar Width</label>
        <input 
          type="range" 
          min="20" 
          max="50" 
          value={sidebarWidth} 
          onChange={(e) => setSidebarWidth(Number(e.target.value))}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default CvTemplate;