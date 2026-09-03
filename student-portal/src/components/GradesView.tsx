import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  Plus,
  ChevronDown,
  ChevronUp,
  Calculator,
  HelpCircle,
  BarChart2,
  Trash2,
  Sparkles,
  CheckCircle,
  X
} from 'lucide-react';
import { Subject, AssessmentGrade, GradeCategory } from '../types';
import { calculateCourseGrades, percentageToGrade } from '../utils/studentCalculations';

interface GradesViewProps {
  subjects: Subject[];
  assessments: AssessmentGrade[];
  onAddAssessment: (item: Omit<AssessmentGrade, 'id'>) => void;
  onDeleteAssessment: (id: string) => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  subjects,
  assessments,
  onAddAssessment,
  onDeleteAssessment
}) => {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(subjects[0]?.id || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Target Grade Simulator State
  const [simSubjectId, setSimSubjectId] = useState<string>(subjects[0]?.id || '');
  const [targetLetter, setTargetLetter] = useState<string>('A');
  const [finalWeight, setFinalWeight] = useState<number>(35);

  // New assessment form state
  const [newSubjectId, setNewSubjectId] = useState<string>(subjects[0]?.id || '');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<GradeCategory>('quiz');
  const [newScore, setNewScore] = useState<number>(90);
  const [newMaxScore, setNewMaxScore] = useState<number>(100);
  const [newWeight, setNewWeight] = useState<number>(10);
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const { courseSummaries, semesterGpa, totalCredits, averagePercentage } = calculateCourseGrades(
    subjects,
    assessments
  );

  const toggleCourseExpand = (subjectId: string) => {
    setExpandedCourse(prev => (prev === subjectId ? null : subjectId));
  };

  const handleAddAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddAssessment({
      subjectId: newSubjectId,
      name: newName.trim(),
      category: newCategory,
      score: Number(newScore),
      maxScore: Number(newMaxScore),
      weightPercentage: Number(newWeight),
      date: newDate
    });

    setIsAddModalOpen(false);
    setNewName('');
  };

  // Grade Simulation Logic
  const getSimResult = () => {
    const targetThresholds: Record<string, number> = {
      'A': 93,
      'A-': 90,
      'B+': 87,
      'B': 83,
      'B-': 80,
      'C+': 77,
      'C': 73
    };

    const targetMinPct = targetThresholds[targetLetter] || 90;
    const currentSummary = courseSummaries.find(c => c.subject.id === simSubjectId);
    if (!currentSummary) return null;

    const currentPct = currentSummary.currentPercentage;
    const currentWeightRatio = (100 - finalWeight) / 100;
    const finalWeightRatio = finalWeight / 100;

    // targetMinPct = currentPct * currentWeightRatio + neededScore * finalWeightRatio
    const needed = (targetMinPct - (currentPct * currentWeightRatio)) / finalWeightRatio;
    return {
      needed: Math.round(needed * 10) / 10,
      currentPct,
      targetMinPct,
      isPossible: needed <= 100,
      isGuaranteed: needed <= 0
    };
  };

  const simResult = getSimResult();

  return (
    <div className="space-y-6">
      {/* Top GPA & Standing Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex flex-col items-center justify-center shadow-md shadow-indigo-100 shrink-0">
              <span className="text-2xl font-black tracking-tight">{semesterGpa.toFixed(2)}</span>
              <span className="text-[10px] font-semibold text-indigo-200 uppercase tracking-widest">GPA / 4.0</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Real-Time Academic Performance</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Dean's Honor Standing
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Semester average score: <strong className="text-slate-900">{averagePercentage}%</strong> across{' '}
                <strong className="text-slate-900">{totalCredits} total credits</strong>. Updates dynamically upon assessment input.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Grade</span>
            </button>
          </div>
        </div>

        {/* Grade Distribution Badges */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 mr-2">Grade Distribution:</span>
          {courseSummaries.map(c => (
            <span
              key={c.subject.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-700"
            >
              <span className="font-bold text-slate-900">{c.subject.code}:</span>
              <span className="font-black text-indigo-600">{c.letterGrade}</span>
              <span className="text-slate-400 text-[11px]">({c.currentPercentage}%)</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Course Grade Breakdown Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              Course Grade Breakdown
            </h2>
            <span className="text-xs text-slate-500">Click any course to inspect individual assessments</span>
          </div>

          {courseSummaries.map(cs => {
            const isExpanded = expandedCourse === cs.subject.id;

            return (
              <div
                key={cs.subject.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition hover:border-indigo-200"
              >
                {/* Course Header Bar */}
                <div
                  onClick={() => toggleCourseExpand(cs.subject.id)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{
                        backgroundColor: `${cs.subject.color}15`,
                        color: cs.subject.color
                      }}
                    >
                      {cs.subject.code}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{cs.subject.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{cs.subject.credits} Credits</span>
                        <span>•</span>
                        <span>{cs.assessments.length} Recorded Assessments</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="text-lg font-black text-slate-900">{cs.letterGrade}</span>
                        <span className="text-xs font-semibold text-slate-500">({cs.currentPercentage}%)</span>
                      </div>
                      <span className="text-[11px] text-indigo-600 font-semibold">{cs.gradePoint.toFixed(1)} Grade Pts</span>
                    </div>

                    <button className="p-1 text-slate-400 hover:text-slate-600 transition">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Assessment Items */}
                {isExpanded && (
                  <div className="bg-slate-50/60 border-t border-slate-100 p-5">
                    {cs.assessments.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-2">
                        No graded assessments logged yet for this subject.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 pb-1">
                          <span>Assessment</span>
                          <div className="flex items-center gap-8">
                            <span>Weight</span>
                            <span>Score</span>
                          </div>
                        </div>

                        {cs.assessments.map(item => {
                          const pct = Math.round((item.score / item.maxScore) * 100);
                          return (
                            <div
                              key={item.id}
                              className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs hover:border-slate-300 transition"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="capitalize text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                  {item.category}
                                </span>
                                <div>
                                  <div className="font-semibold text-slate-900">{item.name}</div>
                                  <div className="text-[11px] text-slate-400">{item.date}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <span className="text-slate-500 text-xs font-medium">{item.weightPercentage}%</span>

                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900">
                                    {item.score}/{item.maxScore}
                                  </span>
                                  <span
                                    className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                                      pct >= 90
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : pct >= 80
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'bg-amber-50 text-amber-700'
                                    }`}
                                  >
                                    {pct}%
                                  </span>

                                  <button
                                    onClick={() => onDeleteAssessment(item.id)}
                                    className="p-1 text-slate-300 hover:text-rose-600 transition"
                                    title="Delete assessment"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Col: Target Final Grade Simulator */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-indigo-600" />
              Final Exam Target Simulator
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Calculate exact score needed on your final exam to lock in your desired letter grade.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Course</label>
                <select
                  value={simSubjectId}
                  onChange={e => setSimSubjectId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Grade</label>
                  <select
                    value={targetLetter}
                    onChange={e => setTargetLetter(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none font-bold"
                  >
                    <option value="A">A (93%+)</option>
                    <option value="A-">A- (90%+)</option>
                    <option value="B+">B+ (87%+)</option>
                    <option value="B">B (83%+)</option>
                    <option value="B-">B- (80%+)</option>
                    <option value="C+">C+ (77%+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Final Weight (%)</label>
                  <input
                    type="number"
                    value={finalWeight}
                    onChange={e => setFinalWeight(Number(e.target.value))}
                    min={10}
                    max={70}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Simulation Result Card */}
              {simResult && (
                <div className="mt-5 p-4 rounded-xl border bg-slate-50/80 border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Predicted Requirement:</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span
                      className={`text-3xl font-black ${
                        !simResult.isPossible
                          ? 'text-rose-600'
                          : simResult.needed > 85
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {simResult.isGuaranteed ? '0% (Safe)' : `${simResult.needed}%`}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      needed on Final Exam
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {simResult.isGuaranteed
                      ? `Your current standing of ${simResult.currentPct}% already secures an ${targetLetter} grade!`
                      : simResult.isPossible
                      ? `Scoring ${simResult.needed}% on the remaining ${finalWeight}% final component will secure an ${targetLetter}.`
                      : `Target of ${targetLetter} requires >100% on the final. Consider aiming for a slightly adjusted grade target.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Record Assessment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                Record Assessment Score
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAssessmentSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as GradeCategory)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none capitalize"
                  >
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                    <option value="midterm">Midterm Exam</option>
                    <option value="project">Project</option>
                    <option value="final">Final Exam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Quiz 2: Graph Connectivity & Spanning Trees"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Score</label>
                  <input
                    type="number"
                    value={newScore}
                    onChange={e => setNewScore(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    value={newMaxScore}
                    onChange={e => setNewMaxScore(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (%)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={e => setNewWeight(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                  required
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
                  Save & Update GPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
