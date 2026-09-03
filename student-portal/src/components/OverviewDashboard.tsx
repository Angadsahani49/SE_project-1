import React, { useState } from 'react';
import {
  CalendarCheck2,
  Award,
  Clock,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Check,
  Send
} from 'lucide-react';
import {
  StudentProfile,
  Subject,
  AttendanceRecord,
  Note,
  Assignment,
  AssessmentGrade
} from '../types';
import {
  calculateOverallAttendance,
  calculateCourseGrades,
  formatDeadlineCountdown
} from '../utils/studentCalculations';

interface OverviewDashboardProps {
  profile: StudentProfile;
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  notes: Note[];
  assignments: Assignment[];
  assessments: AssessmentGrade[];
  onNavigate: (tab: string) => void;
  onQuickMarkToday: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  profile,
  subjects,
  attendanceRecords,
  notes,
  assignments,
  assessments,
  onNavigate,
  onQuickMarkToday
}) => {
  const attendanceStats = calculateOverallAttendance(subjects, attendanceRecords, profile.attendanceGoal);
  const gradeStats = calculateCourseGrades(subjects, assessments);

  // Quick Mini-Timer State for the Smart Study Timer card
  const [timerSeconds, setTimerSeconds] = useState(25 * 60 - 2); // 24:58 default from design
  const [timerActive, setTimerActive] = useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pending assignments sorted by due date
  const pendingAssignments = assignments
    .filter(a => a.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const mostUrgentAssignment = pendingAssignments[0];
  const mostUrgentSubject = mostUrgentAssignment ? subjects.find(s => s.id === mostUrgentAssignment.subjectId) : null;

  // Subjects with attendance risk
  const atRiskSubjects = attendanceStats.subjectStats.filter(s => !s.isSafe);

  // Today formatted in theme style
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8">
      {/* Top Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Student Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back, {profile.name} • {todayFormatted}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Updates Active Pill */}
          <div className="bg-white px-4 py-2 rounded-xl shadow-xs border border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-700">Live Updates Active</span>
          </div>

          {/* Quick Check-in Button */}
          <button
            onClick={onQuickMarkToday}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Check-in Today</span>
          </button>
        </div>
      </header>

      {/* KPI 4-Card Metrics Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Attendance</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-slate-900">
                {attendanceStats.overallPercentage}%
              </h2>
              <span
                className={`text-xs font-bold ${
                  attendanceStats.isSafe ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {attendanceStats.isSafe ? 'Safe (≥75%)' : 'Needs Attention'}
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                attendanceStats.isSafe ? 'bg-indigo-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, attendanceStats.overallPercentage)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: GPA Estimate */}
        <div
          onClick={() => onNavigate('grades')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">GPA Estimate</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-slate-900">
                {gradeStats.semesterGpa.toFixed(2)}
              </h2>
              <span className="text-slate-400 text-xs font-medium">Cumulative</span>
            </div>
          </div>
          {/* Segmented bar indicator */}
          <div className="flex gap-1 mt-4">
            <div className={`h-2 flex-1 rounded-sm ${gradeStats.semesterGpa >= 1.0 ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
            <div className={`h-2 flex-1 rounded-sm ${gradeStats.semesterGpa >= 2.0 ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
            <div className={`h-2 flex-1 rounded-sm ${gradeStats.semesterGpa >= 3.0 ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
            <div className={`h-2 flex-1 rounded-sm ${gradeStats.semesterGpa >= 3.8 ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
          </div>
        </div>

        {/* Card 3: Upcoming Deadlines */}
        <div
          onClick={() => onNavigate('assignments')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Upcoming Deadlines</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-slate-900">
                {String(pendingAssignments.length).padStart(2, '0')}
              </h2>
              <span className="text-orange-500 text-xs font-bold italic">
                {mostUrgentAssignment ? `Next: ${formatDeadlineCountdown(mostUrgentAssignment.dueDate).text}` : 'All done'}
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-4 uppercase tracking-wider font-semibold truncate">
            {mostUrgentAssignment ? `Urgent Task: ${mostUrgentSubject?.code}` : 'No Pending Deadlines'}
          </div>
        </div>

        {/* Card 4: Study Streak */}
        <div
          onClick={() => onNavigate('timetable')}
          className="bg-indigo-600 p-5 rounded-2xl shadow-lg shadow-indigo-200 text-white cursor-pointer hover:bg-indigo-700 transition flex flex-col justify-between"
        >
          <div>
            <p className="text-indigo-100 text-sm font-medium mb-1">Study Streak 🔥</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold">12 Days</h2>
            </div>
          </div>
          <p className="text-xs text-indigo-200 mt-4">
            Top 5% of class activity this week
          </p>
        </div>
      </section>

      {/* Main Grid: Assignment Timeline (7 cols) + Quick Notes & Study Timer (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Assignment Timeline Table & Attendance Watchlist */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Assignment Timeline Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Assignment Timeline</h3>
              <button
                onClick={() => onNavigate('assignments')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition"
              >
                View Calendar
              </button>
            </div>

            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3">Task Name</th>
                    <th className="px-6 py-3 text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {pendingAssignments.slice(0, 5).map((asg, idx) => {
                    const subj = subjects.find(s => s.id === asg.subjectId);
                    const countdown = formatDeadlineCountdown(asg.dueDate);
                    const isVeryUrgent = idx === 0;

                    // Alternating badge styles from theme
                    const badgeStyles = [
                      'bg-blue-100 text-blue-700',
                      'bg-purple-100 text-purple-700',
                      'bg-emerald-100 text-emerald-700',
                      'bg-indigo-100 text-indigo-700',
                      'bg-amber-100 text-amber-700'
                    ];
                    const badgeClass = badgeStyles[idx % badgeStyles.length];

                    return (
                      <tr
                        key={asg.id}
                        onClick={() => onNavigate('assignments')}
                        className="hover:bg-slate-50/70 transition cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <span className={`${badgeClass} px-2 py-1 rounded text-xs font-bold`}>
                            {subj?.code || 'GEN'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {asg.title}
                        </td>
                        <td className={`px-6 py-4 text-right font-bold ${isVeryUrgent ? 'text-orange-600' : 'text-slate-500'}`}>
                          {countdown.text}
                        </td>
                      </tr>
                    );
                  })}
                  {pendingAssignments.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-xs text-slate-400">
                        No pending assignment deadlines! You're completely up to date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Watchlist & Risk Forecast Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-indigo-600" />
                Attendance Watchlist & Target ({profile.attendanceGoal}% Threshold)
              </h3>
              <button
                onClick={() => onNavigate('attendance')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition"
              >
                Full Details
              </button>
            </div>

            {atRiskSubjects.length > 0 ? (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 mb-4">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Action Required: {atRiskSubjects.length} Course Below Minimum Requirement</span>
                </div>
                {atRiskSubjects.map(sub => (
                  <div key={sub.subject.id} className="mt-2 text-xs text-slate-700">
                    <strong className="text-rose-700">{sub.subject.code} ({sub.subject.name}):</strong> Currently at{' '}
                    <strong className="text-rose-700">{sub.percentage}%</strong>. Must attend the next{' '}
                    <strong className="text-slate-900 underline font-semibold">{sub.needToAttendCount} consecutive classes</strong> to restore compliance.
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 mb-4 flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All course attendances are currently meeting or exceeding the {profile.attendanceGoal}% university threshold!</span>
              </div>
            )}

            {/* Subject Attendance mini-bars */}
            <div className="space-y-3">
              {attendanceStats.subjectStats.map(s => (
                <div key={s.subject.id} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">{s.subject.code} - {s.subject.name}</span>
                    <span className={`font-bold ${s.isSafe ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {s.percentage}% ({s.attendedClasses}/{s.totalClasses})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.isSafe ? 'bg-indigo-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(100, s.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Notes Repository + Smart Study Timer */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Quick Notes Repository Card (with Left Color Accent Bars) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Quick Notes Repository</h3>
              <button
                onClick={() => onNavigate('notes')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition"
              >
                All Notes
              </button>
            </div>

            <div className="space-y-3">
              {notes.slice(0, 3).map((note, idx) => {
                const subject = subjects.find(s => s.id === note.subjectId);
                // Cycle between theme colors (amber, indigo, emerald)
                const noteTheme = idx === 0
                  ? { bg: 'bg-amber-50', border: 'border-amber-100', bar: 'bg-amber-400', title: 'text-amber-800', desc: 'text-amber-700' }
                  : idx === 1
                  ? { bg: 'bg-indigo-50', border: 'border-indigo-100', bar: 'bg-indigo-400', title: 'text-indigo-800', desc: 'text-indigo-700' }
                  : { bg: 'bg-emerald-50', border: 'border-emerald-100', bar: 'bg-emerald-400', title: 'text-emerald-800', desc: 'text-emerald-700' };

                return (
                  <div
                    key={note.id}
                    onClick={() => onNavigate('notes')}
                    className={`p-3.5 ${noteTheme.bg} rounded-xl border ${noteTheme.border} relative cursor-pointer hover:shadow-xs transition pl-4 overflow-hidden`}
                  >
                    <div className={`w-1.5 h-full ${noteTheme.bar} absolute left-0 top-0 rounded-l-xl`}></div>
                    <p className={`text-xs font-bold ${noteTheme.title} mb-1 flex items-center justify-between`}>
                      <span>{subject?.code || 'NOTE'} - {note.title}</span>
                    </p>
                    <p className={`text-xs ${noteTheme.desc} leading-relaxed line-clamp-2`}>
                      {note.content.replace(/#|\*|`|-/g, '')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart Study Timer Widget (Dark Card with Glowing Blur) */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-1">Smart Study Timer</h3>
              <p className="text-slate-400 text-xs mb-4">
                Deep work session for <strong>{subjects[0]?.code || 'CS302'}</strong>
              </p>

              <div className="flex items-center justify-between pt-2">
                <div className="text-4xl font-mono font-bold tracking-tighter text-white">
                  {formatTimer(timerSeconds)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    className="bg-indigo-500 hover:bg-indigo-400 text-white h-11 w-11 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-indigo-500/40"
                    title={timerActive ? 'Pause Session' : 'Start Focus Session'}
                  >
                    {timerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <button
                    onClick={() => {
                      setTimerActive(false);
                      setTimerSeconds(25 * 60);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                    title="Reset timer to 25 mins"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Pomodoro Focus Sprint</span>
                <button
                  onClick={() => onNavigate('timetable')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Open Study Room &rarr;
                </button>
              </div>
            </div>

            {/* Glowing blur backdrop effect */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
