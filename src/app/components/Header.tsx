import { Plus, Settings, Menu, Download, Upload, X, Database, Save } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  logoSrc: string;
  svgPaths: any;
  onCreateGoalProject: () => void;
  onManageGoalsProjects: () => void;
  onExportData: () => void;
  onImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadSampleData: () => void;
  onSave: () => void;
}

export function Header({ 
  logoSrc, 
  svgPaths, 
  onCreateGoalProject, 
  onManageGoalsProjects,
  onExportData,
  onImportData,
  onLoadSampleData,
  onSave
}: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white border-b border-[#dbe4ed] shadow-[0px_3px_20px_0px_rgba(11,76,105,0.1)]">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */} 
          <div className="h-8 w-[82px]">
            <img src={logoSrc} alt="CFC" className="h-full w-full object-contain" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onManageGoalsProjects}
              className="bg-white border border-[#0083BD] text-[#0083BD] px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-50 transition-all"
            >
              <Settings className="w-5 h-5" />
              Manage Parents
            </button>
            <button
              onClick={onCreateGoalProject}
              className="bg-gradient-to-r from-[#0083BD] to-[#149BD7] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              New Goal
            </button>
            
            {/* Hamburger Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="bg-white border border-[#0083BD] text-[#0083BD] p-3 rounded-xl hover:bg-blue-50 transition-all"
                aria-label="Menu"
              >
                {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowMenu(false)}
                  />
                  
                  {/* Menu Content */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-[#dbe4ed] z-50 overflow-hidden">
                    <div className="py-2">
                      {/* Export Button */}
                      <button
                        onClick={() => {
                          onExportData();
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-blue-50 transition-colors text-[#01416d]"
                      >
                        <Download className="w-5 h-5 text-[#00A63E]" />
                        <div>
                          <div className="font-medium">Export Data</div>
                          <div className="text-xs text-[#575756]">Download backup</div>
                        </div>
                      </button>

                      {/* Import Button */}
                      <label className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-[#01416d] cursor-pointer">
                        <Upload className="w-5 h-5 text-[#FF9500]" />
                        <div>
                          <div className="font-medium">Import Data</div>
                          <div className="text-xs text-[#575756]">Restore backup</div>
                        </div>
                        <input
                          type="file"
                          accept=".json"
                          onChange={(e) => {
                            onImportData(e);
                            setShowMenu(false);
                          }}
                          className="hidden"
                        />
                      </label>

                      {/* Load Sample Data Button */}
                      <button
                        onClick={() => {
                          onLoadSampleData();
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-blue-50 transition-colors text-[#01416d]"
                      >
                        <Database className="w-5 h-5 text-[#0083BD]" />
                        <div>
                          <div className="font-medium">Load Sample Data</div>
                          <div className="text-xs text-[#575756]">Add CFC tasks</div>
                        </div>
                      </button>

                      {/* Save Button */}
                      <button
                        onClick={() => {
                          onSave();
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-blue-50 transition-colors text-[#01416d]"
                      >
                        <Save className="w-5 h-5 text-[#0083BD]" />
                        <div>
                          <div className="font-medium">Save</div>
                          <div className="text-xs text-[#575756]">Save current state</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
