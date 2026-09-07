import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  AlertTriangle,
  Plus,
  ShieldCheck,
  Sparkles,
  Sliders,
  Calendar,
  Filter,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Subject, AttendanceRecord, AttendanceStatus } from '../types';
import { calculateOverallAttendance, calculateSubjectAttendance } from '../utils/studentCalculations';

interface AttendanceViewProps {
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  attendanceGoal: number;
  onUpdateGoal: (newGoal: number) => void;
  onAddRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  onDeleteRecord: (id: string) => void;
  onNavigateToTeacherPortal?: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  subjects,
  attendanceRecords,
  attendanceGoal,
  onUpdateGoal,
  onAddRecord,
  onDeleteRecord,
  onNavigateToTeacherPortal
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form state for adding record
  const [newSubjectId, setNewSubjectId] = useState<string>(subjects[0]?.id || '');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newStatus, setNewStatus] = useState<AttendanceStatus>('present');
  const [newRemarks, setNewRemarks] = useState<string>('');

  const stats = calculateOverallAttendance(subjects, attendanceRecords, attendanceGoal);

  // Quick mark today for a specific subject
  const handleQuickMark = (subjectId: string, status: AttendanceStatus) => {
    const todayStr = new Date().toISOString().split('T')[0];
    onAddRecord({
      subjectId,
      date: todayStr,
      status,
      remarks: `Marked from Attendance Hub`
    });

    if (status === 'present') {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  // Quick Mark All Present for Today
  const handleMarkAllToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    subjects.forEach(subject => {
      onAddRecord({
        subjectId: subject.id,
        date: todayStr,
        status: 'present',
        remarks: 'Batch daily check-in'
      });
    });

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectId) return;

    onAddRecord({
      subjectId: newSubjectId,
      date: newDate,
      status: newStatus,
      remarks: newRemarks.trim() || undefined
    });

    setIsLogModalOpen(false);
    setNewRemarks('');
  };

  // Filtered attendance log list
  const filteredRecords = attendanceRecords
    .filter(r => {
      if (selectedSubjectFilter !== 'all' && r.subjectId !== selectedSubjectFilter) return false;
      if (selectedStatusFilter !== 'all' && r.status !== selectedStatusFilter) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Top Banner Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 ${
                stats.overallPercentage >= attendanceGoal
                  ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-2 border-rose-200'
              }`}
            >
              {stats.overallPercentage}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Daily Attendance Tracker</h1>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    stats.overallPercentage >= attendanceGoal
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {stats.overallPercentage >= attendanceGoal ? 'Attendance Status: Safe' : 'Attendance Risk: Below Target'}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                You have attended <span className="font-semibold text-slate-900">{stats.totalAttended}</span> out of{' '}
                <span className="font-semibold text-slate-900">{stats.totalClasses}</span> total scheduled lectures. Minimum
                requirement is {attendanceGoal}%.
              </p>
            </div>
          </div>

          {/* Quick Actions & Goal Setter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-600 font-medium">Goal Target:</span>
              <select
                value={attendanceGoal}
                onChange={e => onUpdateGoal(Number(e.target.value))}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value={70}>70%</option>
                <option value={75}>75% (Standard)</option>
                <option value={80}>80%</option>
                <option value={85}>85%</option>
                <option value={90}>90%</option>
              </select>
            </div>

            <button
              onClick={handleMarkAllToday}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mark All Present Today</span>
            </button>

            <button
              onClick={() => setIsLogModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Attendance Entry</span>
            </button>

            {onNavigateToTeacherPortal && (
              <button
                onClick={onNavigateToTeacherPortal}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs border border-slate-700"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Teacher Register</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subject-by-Subject Attendance Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Subject-wise Attendance Breakdown
          </h2>
          <span className="text-xs text-slate-500">Live calculating safe skips & mandatory attendances</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.subjectStats.map(subStat => {
            const subject = subStat.subject;
            const isSafe = subStat.isSafe;

            return (
              <div
                key={subject.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {subject.code}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1.5 line-clamp-1">{subject.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{subject.professor}</p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xl font-black ${
                          isSafe ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {subStat.percentage}%
                      </span>
                      <div className="text-[11px] text-slate-500">
                        {subStat.attendedClasses}/{subStat.totalClasses} classes
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                      {/* 75% benchmark line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                        style={{ left: `${attendanceGoal}%` }}
                        title={`Target: ${attendanceGoal}%`}
                      />
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSafe ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, subStat.percentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Forecast Intelligence */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100">
                    {isSafe ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>
                          Safe zone: Can miss up to{' '}
                          <strong className="font-bold">{subStat.canBunkCount}</strong> more classes.
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-rose-800 bg-rose-50/80 px-2.5 py-1.5 rounded-lg border border-rose-200">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>
                          Critical: Must attend next{' '}
                          <strong className="font-bold">{subStat.needToAttendCount}</strong> classes consecutively!
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Check-in for Today */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Today's Class:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleQuickMark(subject.id, 'present')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleQuickMark(subject.id, 'late')}
                      className="px-2 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition"
                    >
                      Late
                    </button>
                    <button
                      onClick={() => handleQuickMark(subject.id, 'absent')}
                      className="px-2 py-1 text-xs font-semibold rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                    >
                      Absent
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance History Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-indigo-600" />
              Attendance History & Class Logs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit log of all recorded lectures</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSubjectFilter}
                onChange={e => setSelectedSubjectFilter(e.target.value)}
                className="bg-transparent text-slate-700 font-medium outline-none cursor-pointer"
              >
                <option value="all">All Subjects</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
                className="bg-transparent text-slate-700 font-medium outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto mt-4 -mx-6">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Remarks / Topic</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-xs text-slate-400">
                    No attendance records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.slice(0, 15).map(record => {
                  const subject = subjects.find(s => s.id === record.subjectId);
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-3.5 font-medium text-slate-900 whitespace-nowrap text-xs">
                        {record.date}
                      </td>
                      <td className="px-6 py-3.5 text-xs">
                        <span className="font-bold text-slate-800">{subject?.code}</span>{' '}
                        <span className="text-slate-500 hidden sm:inline">({subject?.name})</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold capitalize ${
                            record.status === 'present'
                              ? 'bg-emerald-100 text-emerald-700'
                              : record.status === 'absent'
                              ? 'bg-rose-100 text-rose-700'
                              : record.status === 'late'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {record.status === 'present' && <CheckCircle2 className="w-3 h-3" />}
                          {record.status === 'absent' && <XCircle className="w-3 h-3" />}
                          {record.status === 'late' && <Clock3 className="w-3 h-3" />}
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-600 max-w-xs truncate">
                        {record.remarks || <span className="text-slate-400 italic">No notes</span>}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => onDeleteRecord(record.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-1"
                          title="Remove record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log New Attendance Entry */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Log Attendance Entry
            </h3>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={newSubjectId}
                  onChange={e => setNewSubjectId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                  required
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as AttendanceStatus)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="absent">Absent</option>
                    <option value="excused">Excused Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topic / Remark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dijkstra algorithm lab demo"
                  value={newRemarks}
                  onChange={e => setNewRemarks(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
