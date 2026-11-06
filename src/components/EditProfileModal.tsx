import React, { useState, useEffect, useRef } from 'react';
import { X, Check, User, School as SchoolIcon, BookOpen, MapPin, Hash, Sparkles, ShieldCheck, Trash2, AlertTriangle } from 'lucide-react';
import { StudentUser, authService } from '../services/authService';
import { CLASSES_LIST } from '../data/quizData';
import { POPULAR_SCHOOLS, SCHOOL_BOARDS, School } from '../data/schoolsData';

interface EditProfileModalProps {
  isOpen: boolean;
  currentUser: StudentUser;
  onClose: () => void;
  onUpdate: (updatedUser: StudentUser) => void;
  onDeleteAccount?: (email: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUpdate,
  onDeleteAccount,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [classLevel, setClassLevel] = useState(currentUser.classLevel || 'Class 10');
  const [schoolName, setSchoolName] = useState(currentUser.schoolName || '');
  const [schoolBoard, setSchoolBoard] = useState(currentUser.schoolBoard || 'CBSE');
  const [schoolCity, setSchoolCity] = useState(currentUser.schoolCity || 'New Delhi');
  const [rollNumber, setRollNumber] = useState(currentUser.rollNumber || '18');

  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState(currentUser.schoolName || '');
  const schoolDropdownRef = useRef<HTMLDivElement>(null);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Account deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setClassLevel(currentUser.classLevel || 'Class 10');
      setSchoolName(currentUser.schoolName || '');
      setSchoolBoard(currentUser.schoolBoard || 'CBSE');
      setSchoolCity(currentUser.schoolCity || 'New Delhi');
      setRollNumber(currentUser.rollNumber || '18');
      setSchoolSearchQuery(currentUser.schoolName || '');
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(event.target as Node)) {
        setIsSchoolDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const filteredSchools = POPULAR_SCHOOLS.filter(
    (s) =>
      s.name.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(schoolSearchQuery.toLowerCase())
  );

  const handleSelectSchool = (school: School) => {
    setSchoolName(school.name);
    setSchoolSearchQuery(school.name);
    setSchoolBoard(school.board);
    setSchoolCity(school.city);
    setIsSchoolDropdownOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = authService.updateUserProfile({
      name: name.trim(),
      classLevel,
      schoolName: schoolName.trim() || schoolSearchQuery.trim() || 'Delhi Public School',
      schoolBoard,
      schoolCity: schoolCity.trim() || 'New Delhi',
      rollNumber: rollNumber.trim() || '01',
    });

    if (updated) {
      setIsSavedToast(true);
      onUpdate(updated);
      setTimeout(() => {
        setIsSavedToast(false);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0c140e] border border-[#a3e635]/35 p-5 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.85)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#142316] border border-[#a3e635]/30 text-[11px] text-[#bef264] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>Student Credentials & ID Card</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Edit Student Profile
          </h2>
          <p className="text-xs text-neutral-300 mt-1">
            Update your official student name, class, school board, city, and roll number.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-left">
          {/* Student Full Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-200 mb-1">
              Student Full Name <span className="text-[#a3e635]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arpita Ghosh"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
              />
            </div>
          </div>

          {/* Academic Class & Roll Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-200 mb-1">
                Academic Class <span className="text-[#a3e635]">*</span>
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3 pointer-events-none" />
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635] appearance-none cursor-pointer"
                >
                  {CLASSES_LIST.map((c) => (
                    <option key={c} value={c} className="bg-[#0c140e] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-200 mb-1">
                Class Roll Number <span className="text-[#a3e635]">*</span>
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 18"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                />
              </div>
            </div>
          </div>

          {/* School Name with Search Dropdown */}
          <div className="relative" ref={schoolDropdownRef}>
            <label className="block text-xs font-semibold text-neutral-200 mb-1">
              School Name <span className="text-[#a3e635]">*</span>
            </label>
            <div className="relative">
              <SchoolIcon className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={schoolSearchQuery}
                onFocus={() => setIsSchoolDropdownOpen(true)}
                onChange={(e) => {
                  setSchoolSearchQuery(e.target.value);
                  setSchoolName(e.target.value);
                  setIsSchoolDropdownOpen(true);
                }}
                placeholder="Search or enter your school"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
              />
            </div>

            {/* School Dropdown Suggestions */}
            {isSchoolDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-[#080d09] border border-[#a3e635]/40 shadow-2xl max-h-48 overflow-y-auto">
                {filteredSchools.length > 0 ? (
                  filteredSchools.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectSchool(s)}
                      className="w-full p-2.5 text-left hover:bg-[#142316] text-xs flex items-center justify-between border-b border-white/5 last:border-0 cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-white">{s.name}</div>
                        <div className="text-[11px] text-neutral-400">
                          {s.city} · {s.board}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#a3e635]/20 text-[#bef264]">
                        {s.board}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-xs text-neutral-400">
                    Custom school: &quot;{schoolSearchQuery}&quot; will be saved.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* School Board & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-200 mb-1">
                School Education Board <span className="text-[#a3e635]">*</span>
              </label>
              <select
                value={schoolBoard}
                onChange={(e) => setSchoolBoard(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635] cursor-pointer"
              >
                {SCHOOL_BOARDS.map((b) => (
                  <option key={b} value={b} className="bg-[#0c140e] text-white">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-200 mb-1">
                City / Location <span className="text-[#a3e635]">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={schoolCity}
                  onChange={(e) => setSchoolCity(e.target.value)}
                  placeholder="e.g. New Delhi, Kolkata, Mumbai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Snippet */}
          <div className="p-3 rounded-2xl bg-[#142316]/80 border border-[#a3e635]/30 text-xs">
            <div className="flex items-center gap-2 text-[#bef264] font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#a3e635]" />
              <span>Card Preview: {name || 'Student'}</span>
            </div>
            <div className="text-[11px] text-neutral-300">
              {classLevel} · {schoolBoard} · {schoolName || 'School'} ({schoolCity}) · Roll #{rollNumber || '01'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 aurix-pill-button py-2.5 rounded-xl text-xs font-bold text-[#040604] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)] cursor-pointer"
            >
              {isSavedToast ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>

          {/* Account Deletion Danger Zone */}
          {onDeleteAccount && (
            <div className="pt-4 mt-2 border-t border-red-500/20">
              {!showDeleteConfirm ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-red-950/20 border border-red-500/20">
                  <div>
                    <div className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Account Deletion</span>
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Permanently delete this student account from database
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Account</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Permanently Delete Account?</h4>
                      <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                        Are you sure you want to permanently delete{' '}
                        <strong className="text-white">{currentUser.name}</strong> (
                        <span className="text-red-300 font-mono">{currentUser.email}</span>)?
                        This will permanently erase all student credentials, digital verification, and quiz scores from the persistent database.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold border border-white/10 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => {
                        setIsDeleting(true);
                        setTimeout(() => {
                          setIsDeleting(false);
                          onDeleteAccount(currentUser.email);
                          onClose();
                        }, 500);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Account'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
