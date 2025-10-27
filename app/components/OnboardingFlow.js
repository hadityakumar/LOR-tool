"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function OnboardingFlow({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    duration: "",
    institution: "",
    targetProgram: "",
    targetInstitution: "",
    field: "",
    achievements: "",
    anecdote: "",
    referrer: "",
    tone: "",
    lorType: "",
    strength: "",
  });

  const steps = [
    {
      title: "Personal Information",
      fields: [
        { name: "name", label: "Candidate Name", type: "text", placeholder: "Enter candidate's name" },
        { name: "relationship", label: "Your Relationship", type: "text", placeholder: "e.g., Professor, Supervisor" },
        { name: "duration", label: "Duration of Association", type: "text", placeholder: "e.g., 2 years" },
        { name: "institution", label: "Current Institution", type: "text", placeholder: "Enter institution name" },
      ],
    },
    {
      title: "Target Information",
      fields: [
        { name: "targetProgram", label: "Target Program", type: "text", placeholder: "e.g., PhD in Computer Science" },
        { name: "targetInstitution", label: "Target Institution", type: "text", placeholder: "e.g., MIT" },
        { name: "field", label: "Field of Study", type: "text", placeholder: "e.g., Artificial Intelligence" },
      ],
    },
    {
      title: "Achievements & Details",
      fields: [
        { name: "achievements", label: "Key Achievements", type: "textarea", placeholder: "List notable achievements..." },
        { name: "anecdote", label: "Memorable Anecdote", type: "textarea", placeholder: "Share a specific example..." },
      ],
    },
    {
      title: "Letter Preferences",
      fields: [
        { name: "referrer", label: "Referrer Name", type: "text", placeholder: "Your name" },
        { name: "tone", label: "Tone", type: "select", options: ["Professional", "Warm", "Formal", "Enthusiastic"] },
        { name: "lorType", label: "Letter Type", type: "select", options: ["Academic", "Professional", "Character"] },
        { name: "strength", label: "Strength Level", type: "select", options: ["Strong", "Very Strong", "Exceptional"] },
      ],
    },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden">

      <div className="w-full h-2 bg-gray-200">
        <div
          className="h-full bg-black transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>


      <button
        onClick={onSkip}
        className="absolute top-6 right-6 text-gray-400 hover:text-black transition z-10"
      >
        <X size={24} />
      </button>

      <div className="flex-1 flex items-center justify-center p-8 pb-16">
        <div className="w-full max-w-2xl flex flex-col" style={{ minHeight: '550px' }}>
          <h2 className="text-4xl font-light text-black mb-2">{steps[currentStep].title}</h2>
          <p className="text-gray-500 mb-8">Step {currentStep + 1} of {steps.length}</p>

          <div className="space-y-6 flex-1" style={{ minHeight: '350px' }}>
            {steps[currentStep].fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-black mb-2">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    rows={4}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>

    
          <div className="flex items-center justify-between mt-auto pt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition min-w-[100px] ${
                currentStep === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              Back
            </button>

            <div className="flex gap-4">
              <button
                onClick={onSkip}
                className="px-6 py-3 rounded-lg font-medium text-gray-500 hover:text-black transition min-w-[100px]"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition min-w-[120px]"
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
