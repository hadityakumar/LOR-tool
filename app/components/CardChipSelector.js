import React, { useState } from "react";
import { X } from "lucide-react";

export default function CardChipSelector({ label, options, chips, onAdd, onRemove }) {
  const [inputValue, setInputValue] = useState("");
  
  return (
    <div className="border border-gray-100 rounded-lg p-3 bg-white">
      <div className="flex flex-wrap gap-2 mb-2 w-full">
        {chips && chips.length ? (
          chips.map((c) => (
            <div key={c} className="inline-flex items-center gap-1.5 bg-gray-100 text-black px-3 py-1.5 rounded-full text-sm whitespace-nowrap max-w-full">
              <span className="truncate">{c}</span>
              <X size={14} className="cursor-pointer text-gray-600 shrink-0" onClick={() => onRemove(c)} />
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm">No selections yet</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none placeholder-gray-400 text-black"
          placeholder="Type and press Enter or Add"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (inputValue.trim()) {
                onAdd(inputValue.trim());
                setInputValue("");
              }
            }
          }}
          list={`${label}-list`}
        />
        <button
          className="px-3 py-1 border border-gray-200 rounded-md bg-white hover:bg-gray-50 text-sm"
          onClick={() => {
            if (inputValue.trim()) {
              onAdd(inputValue.trim());
              setInputValue("");
            }
          }}
        >
          Add
        </button>
      </div>

      <datalist id={`${label}-list`}>
        {options.map((opt) => <option key={opt} value={opt} />)}
      </datalist>
    </div>
  );
}