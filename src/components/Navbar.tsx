import React, { useState } from 'react';
import {
  GraduationCap,
  CalendarCheck2,
  BookOpen,
  Clock,
  Award,
  CalendarDays,
  LayoutDashboard,
  Download,
  RotateCcw,
  Menu,
  X,
  Sparkles,
  UserCheck,
  ShieldCheck,
  ArrowLeftRight
} from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  profile: StudentProfile;
  overallAttendancePct: number;
  currentGpa: number;
  pendingAssignmentsCount: number;
  onExportData: () => void;
  onResetData: () => void;
  userRole?: 'student' | 'teacher';
  onToggleRole?: () => void;
  activeTeacherName?: string;
  activeTeacherId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  profile,
  overallAttendancePct,
  currentGpa,
  pendingAssignmentsCount,
  onExportData,
  onResetData,
  userRole = 'student',
  onToggleRole,
  activeTeacherName,
  activeTeacherId
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarCheck2,
      badge: `${overallAttendancePct}%`,
      badgeColor: overallAttendancePct >= profile.attendanceGoal ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    },
    { id: 'notes', label: 'B.Tech CSE Notes', icon: BookOpen },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: Clock,
      badge: pendingAssignmentsCount > 0 ? `${pendingAssignmentsCount}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    {
      id: 'grades',
      label: 'Grades',
      icon: Award,
      badge: `${currentGpa.toFixed(2)}`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
    },
    {
      id: 'timetable',
      label: 'Schedule & Study',
      icon: CalendarDays
    },
    {
      id: 'teacher_portal',
      label: 'Teacher Portal',
      icon: UserCheck,
      badge: 'Faculty',
      badgeColor: 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40',
      isSpecial: true
    }
  ];

  const handleSelectTab = (id: string) => {
    setCurrentTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header (only visible on small screens) */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelectTab('overview')}>
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-sm shadow-indigo-500/30">
            S
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block leading-tight">ScholarFlow</span>
            <span className="text-[10px] text-indigo-400 font-semibold">B.Tech CSE Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectTab('teacher_portal')}
            className="px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-[11px] font-bold text-white rounded-lg transition flex items-center gap-1"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty</span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Aside (Permanent on lg+, slide-over drawer on mobile) */}
      <aside
        className={`
          w-64 bg-slate-900 text-white flex flex-col shrink-0 z-50
          fixed lg:sticky top-0 h-screen transition-transform duration-200 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          border-r border-slate-800/80
        `}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleSelectTab('overview')}
          >
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-sm shadow-indigo-500/40">
              S
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-tight">
                ScholarFlow
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                B.Tech CSE Portal
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}

                {item.isSpecial && !item.badge && (
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Data Persistence Action Controls in Sidebar */}
        <div className="px-4 py-3 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={onExportData}
              title="Export Portal Data as JSON backup"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 py-2 px-2.5 rounded-lg border border-slate-700/60 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Backup</span>
            </button>

            <button
              onClick={onResetData}
              title="Reset to sample data"
              className="p-2 text-slate-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* User Profile Card in Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          {currentTab === 'teacher_portal' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center text-white shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">
                    {activeTeacherName || 'Faculty Member'}
                  </span>
                  <span className="text-[11px] text-indigo-400 font-mono truncate">
                    ID: {activeTeacherId || 'FAC-CSE-101'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleSelectTab('overview')}
                className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Switch to Student View</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-9 h-9 rounded-full bg-indigo-200 border-2 border-indigo-400 object-cover shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate">
                    {profile.name}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono truncate">
                    Roll: {profile.studentId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleSelectTab('teacher_portal')}
                className="w-full py-1.5 px-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-200 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Open Teacher Portal</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
