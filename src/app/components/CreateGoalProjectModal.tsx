import { useState } from 'react';
import { X, Target } from 'lucide-react';

interface CreateGoalProjectModalProps {
  onClose: () => void;
  onAddGoal: (name: string) => void;
}

export function CreateGoalProjectModal({ 
  onClose, 
  onAddGoal
}: CreateGoalProjectModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddGoal(name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#9ca3af] hover:text-[#01416d] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="w-6 h-6 text-[#0083BD]" />
          </div>
          <h2 className="text-[22px] font-bold text-[#01416d]">
            Create New Goal
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-[#01416d] font-medium mb-2">
              Goal Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter goal name..."
              className="w-full px-4 py-3 border border-[rgba(219,228,237,0.4)] rounded-xl focus:outline-none focus:border-[#0083BD] focus:ring-2 focus:ring-[rgba(0,131,189,0.1)] transition-all"
              autoFocus
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[rgba(219,228,237,0.4)] text-[#575756] rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0083BD] to-[#149BD7] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
