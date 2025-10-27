import React, { useRef, useState } from "react";
import { Mic, Upload } from "lucide-react";
import CardChipSelector from "./CardChipSelector";
import { 
  qualitiesList, 
  softTraitsList, 
  tones, 
  lorTypes, 
  strengths,
  relationships,
  durations,
  targetPrograms,
  targetInstitutions,
  referrerIdentities
} from "../constants/options";

export default function LeftPanel({ formData, onChange, onMic, qualities, softTraits, onAddChip, onRemoveChip, onCVUpload, onGenerate, isGenerating }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("cv", file);

      const response = await fetch("/api/extract-cv", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success && onCVUpload) {
        onCVUpload(result.data);
      } else {
        alert("Failed to extract CV: " + result.error);
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("Failed to upload CV. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <section className="card-3d bg-white rounded-2xl p-5 text-black h-full flex flex-col overflow-hidden w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Fill details</h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all ${
            isUploading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 hover:scale-105 active:scale-95"
          }`}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Extracting...
            </>
          ) : (
            <>
              <Upload size={14} />
              Upload CV
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar w-full">
        {/* Row 1: Name and Relationship */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div>
            <label className="block text-sm font-medium mb-1">Candidate Name</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="Enter name"
                className="flex-1 bg-transparent outline-none text-black placeholder-gray-500"
              />
              <Mic
                size={18}
                className="ml-2 text-gray-600 cursor-pointer hover:text-black"
                onClick={() => onMic("name")}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Relationship</label>
            <select 
              className="w-full border border-gray-200 rounded-lg px-3 py-2" 
              value={formData.relationship || ""} 
              onChange={(e) => onChange("relationship", e.target.value)}
            >
              <option value="">Select...</option>
              {relationships.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Duration and Institution */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Duration Known</label>
            <select 
              className="w-full border border-gray-200 rounded-lg px-3 py-2" 
              value={formData.duration || ""} 
              onChange={(e) => onChange("duration", e.target.value)}
            >
              <option value="">Select...</option>
              {durations.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Institution/Company</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <input
                type="text"
                value={formData.institution || ""}
                onChange={(e) => onChange("institution", e.target.value)}
                placeholder="Enter institution"
                className="flex-1 bg-transparent outline-none text-black placeholder-gray-500"
              />
              <Mic
                size={18}
                className="ml-2 text-gray-600 cursor-pointer hover:text-black"
                onClick={() => onMic("institution")}
              />
            </div>
          </div>
        </div>

        {/* Row 3: Target Program and Target Institution */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Target Program/Role</label>
            <select 
              className="w-full border border-gray-200 rounded-lg px-3 py-2" 
              value={formData.targetProgram || ""} 
              onChange={(e) => onChange("targetProgram", e.target.value)}
            >
              <option value="">Select...</option>
              {targetPrograms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Target Institution</label>
            <select 
              className="w-full border border-gray-200 rounded-lg px-3 py-2" 
              value={formData.targetInstitution || ""} 
              onChange={(e) => onChange("targetInstitution", e.target.value)}
            >
              <option value="">Select...</option>
              {targetInstitutions.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Field and Referrer Identity */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Field of Interest</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <input
                type="text"
                value={formData.field || ""}
                onChange={(e) => onChange("field", e.target.value)}
                placeholder="Enter field"
                className="flex-1 bg-transparent outline-none text-black placeholder-gray-500"
              />
              <Mic
                size={18}
                className="ml-2 text-gray-600 cursor-pointer hover:text-black"
                onClick={() => onMic("field")}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Referrer Identity</label>
            <select 
              className="w-full border border-gray-200 rounded-lg px-3 py-2" 
              value={formData.referrer || ""} 
              onChange={(e) => onChange("referrer", e.target.value)}
            >
              <option value="">Select...</option>
              {referrerIdentities.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <label className="block text-sm font-medium mb-1">Specific Achievements</label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <input
              type="text"
              value={formData.achievements || ""}
              onChange={(e) => onChange("achievements", e.target.value)}
              placeholder="Enter achievements"
              className="flex-1 bg-transparent outline-none text-black placeholder-gray-500"
            />
            <Mic
              size={18}
              className="ml-2 text-gray-600 cursor-pointer hover:text-black"
              onClick={() => onMic("achievements")}
            />
          </div>
        </div>

        {/* Anecdote */}
        <div>
          <label className="block text-sm font-medium mb-1">Specific Anecdote</label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <input
              type="text"
              value={formData.anecdote || ""}
              onChange={(e) => onChange("anecdote", e.target.value)}
              placeholder="Enter anecdote"
              className="flex-1 bg-transparent outline-none text-black placeholder-gray-500"
            />
            <Mic
              size={18}
              className="ml-2 text-gray-600 cursor-pointer hover:text-black"
              onClick={() => onMic("anecdote")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observed Qualities</label>
          <CardChipSelector
            label="Observed Qualities"
            options={qualitiesList}
            chips={qualities}
            onAdd={(v) => onAddChip("qualities", v)}
            onRemove={(v) => onRemoveChip("qualities", v)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Soft Traits</label>
          <CardChipSelector
            label="Soft Traits"
            options={softTraitsList}
            chips={softTraits}
            onAdd={(v) => onAddChip("softTraits", v)}
            onRemove={(v) => onRemoveChip("softTraits", v)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tone</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2" value={formData.tone || ""} onChange={(e) => onChange("tone", e.target.value)}>
              <option value="">Select...</option>
              {tones.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LOR Type</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2" value={formData.lorType || ""} onChange={(e) => onChange("lorType", e.target.value)}>
              <option value="">Select...</option>
              {lorTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Recommendation Strength</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2" value={formData.strength || ""} onChange={(e) => onChange("strength", e.target.value)}>
              <option value="">Select...</option>
              {strengths.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Generate Button at Bottom */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`w-full rounded-lg px-4 py-3 font-medium whitespace-nowrap transition-all duration-300 ${
            isGenerating
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 hover:shadow-xl hover:scale-105 active:scale-95"
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate"
          )}
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </section>
  );
}