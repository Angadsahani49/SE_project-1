import React, { useState } from 'react';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Send,
  Plus,
  ArrowUpDown,
  FileCheck2,
  ExternalLink,
  Award,
  Sparkles,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Assignment, Subject, AssignmentPriority, AssignmentStatus } from '../types';
import { formatDeadlineCountdown } from '../utils/studentCalculations';

interface AssignmentsViewProps {
  assignments: Assignment[];
  subjects: Subject[];
  onAddAssignment: (asg: Omit<Assignment, 'id'>) => void;
  onSubmitAssignment: (id: string, notes: string, attachment?: string) => void;
  onDeleteAssignment: (id: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  subjects,
  onAddAssignment,
  onSubmitAssignment,
  onDeleteAssignment
}) => {
  const [activeTab, setActiveTab] = useState<AssignmentStatus | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [submittingModalId, setSubmittingModalId] = useState<string | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDueTime, setNewDueTime] = useState('23:59');
  const [newPriority, setNewPriority] = useState<AssignmentPriority>('medium');
  const [newPoints, setNewPoints] = useState(100);
  const [newWeight, setNewWeight] = useState(15);
  const [newInstructions, setNewInstructions] = useState('');

  // Filtering
  const filtered = assignments.filter(asg => {
    if (activeTab !== 'all' && asg.status !== activeTab) return false;
    if (selectedSubject !== 'all' && asg.subjectId !== selectedSubject) return false;
    return true;
  });

  // Sorting: Pending earliest due first, then submitted/graded
  const sorted = [...filtered].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Metrics
  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const urgentCount = assignments.filter(a => {
    if (a.status !== 'pending') return false;
    const diffDays = (new Date(a.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return diffDays <= 3;
  }).length;
  const completedCount = assignments.filter(a => a.status !== 'pending').length;

  const handleSubmitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingModalId) return;

    onSubmitAssignment(submittingModalId, submissionNotes, submissionLink);
    setSubmittingModalId(null);
    setSubmissionNotes('');
    setSubmissionLink('');

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) return;

    const fullDueDate = `${newDueDate}T${newDueTime || '23:59'}:00Z`;

    onAddAssignment({
      title: newTitle.trim(),
      subjectId: newSubjectId,
      dueDate: fullDueDate,
      priority: newPriority,
      points: Number(newPoints) || 100,
      weightPercentage: Number(newWeight) || 10,
      status: 'pending',
      instructions: newInstructions.trim()
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewInstructions('');
  };

  const getPriorityBadge = (priority: AssignmentPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{pendingCount}</div>
            <div className="text-xs text-slate-500 font-medium">Pending Deadlines</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{urgentCount}</div>
            <div className="text-xs text-slate-500 font-medium">Urgent (Due ≤ 3 days)</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{completedCount}</div>
            <div className="text-xs text-slate-500 font-medium">Completed / Graded</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Add Button */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['all', 'pending', 'submitted', 'graded'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'all' ? 'All Deadlines' : tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
          >
            <option value="all">All Courses</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.code}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Assignment</span>
          </button>
        </div>
      </div>

      {/* Assignment List Cards */}
      <div className="space-y-3.5">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No assignments match your view</h3>
            <p className="text-xs text-slate-500 mt-1">
              You are all caught up! Switch filters or add a new assignment task.
            </p>
          </div>
        ) : (
          sorted.map(asg => {
            const subject = subjects.find(s => s.id === asg.subjectId);
            const countdown = formatDeadlineCountdown(asg.dueDate);
            const isPending = asg.status === 'pending';

            return (
              <div
                key={asg.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition hover:shadow-md ${
                  countdown.isOverdue && isPending
                    ? 'border-rose-300 bg-rose-50/20'
                    : countdown.isUrgent && isPending
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left: Course info & Title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {subject?.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {subject?.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getPriorityBadge(asg.priority)}`}>
                        {asg.priority} Priority
                      </span>
                      <span className="text-xs text-slate-400">
                        {asg.points} pts ({asg.weightPercentage}% final grade)
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {asg.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {asg.instructions}
                    </p>

                    {/* Graded Feedback note if available */}
                    {asg.feedback && (
                      <div className="mt-2.5 flex items-start gap-2 text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200">
                        <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Instructor Feedback: </span>
                          <span>{asg.feedback}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Deadline Countdown & Action */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <div className="flex items-center gap-1.5 lg:justify-end">
                        <Clock className={`w-3.5 h-3.5 ${countdown.isUrgent && isPending ? 'text-rose-500' : 'text-slate-400'}`} />
                        <span
                          className={`text-xs font-bold ${
                            asg.status === 'graded'
                              ? 'text-emerald-600'
                              : asg.status === 'submitted'
                              ? 'text-indigo-600'
                              : countdown.isOverdue
                              ? 'text-rose-600'
                              : countdown.isUrgent
                              ? 'text-amber-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {asg.status === 'graded'
                            ? `Graded: ${asg.score}/${asg.points}`
                            : asg.status === 'submitted'
                            ? 'Submitted (In Review)'
                            : countdown.text}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Due: {new Date(asg.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isPending ? (
                        <button
                          onClick={() => setSubmittingModalId(asg.id)}
                          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Turn In Assignment</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{asg.status === 'graded' ? 'Completed' : 'Turned In'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Assignment Modal */}
      {submittingModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600" />
                Submit Assignment Solution
              </h3>
              <button
                onClick={() => setSubmittingModalId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submission Link / GitHub Repository
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/alexrivera/cs304-lab-philosophers"
                  value={submissionLink}
                  onChange={e => setSubmissionLink(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Comments & Execution Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Mention instructions for the TA to run your code, dependencies, or benchmark notes..."
                  value={submissionNotes}
                  onChange={e => setSubmissionNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubmittingModalId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Confirm Turn In</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Assignment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                Add Upcoming Assignment
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course</label>
                  <select
                    value={newSubjectId}
                    onChange={e => setNewSubjectId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                    required
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as AssignmentPriority)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus Raft Algorithm Implementation"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Time</label>
                  <input
                    type="time"
                    value={newDueTime}
                    onChange={e => setNewDueTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Points</label>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={e => setNewPoints(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                    min={1}
                    max={1000}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weightage (% of Grade)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={e => setNewWeight(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                    min={1}
                    max={100}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  placeholder="Outline key deliverables, rubric, and submission requirements..."
                  value={newInstructions}
                  onChange={e => setNewInstructions(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-xs"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
