import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  MapPin,
  User,
  Sparkles,
  Flame,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TimetableSlot, Subject, StudyTask } from '../types';

interface TimetableAndStudyViewProps {
  timetableSlots: TimetableSlot[];
  subjects: Subject[];
  studyTasks: StudyTask[];
  onAddTask: (task: Omit<StudyTask, 'id' | 'createdAt'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TimetableAndStudyView: React.FC<TimetableAndStudyViewProps> = ({
  timetableSlots,
  subjects,
  studyTasks,
  onAddTask,
  onToggleTask,
  onDeleteTask
}) => {
  // Day selection (1 = Mon ... 5 = Fri)
  const [selectedDay, setSelectedDay] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Pomodoro Focus Timer State
  const [timerDuration, setTimerDuration] = useState<number>(25 * 60); // 25 min default
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // New Study Task Input
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubjectId, setNewTaskSubjectId] = useState<string>(subjects[0]?.id || '');

  // Timer Tick Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Toggle to break or focus
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(5 * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak]);

  const handleStartPause = () => {
    setIsRunning(prev => !prev);
  };

  const handleResetTimer = (minutes: number = 25, isBreakMode: boolean = false) => {
    setIsRunning(false);
    setIsBreak(isBreakMode);
    setTimerDuration(minutes * 60);
    setTimeLeft(minutes * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      title: newTaskTitle.trim(),
      subjectId: newTaskSubjectId || undefined,
      completed: false,
      pomodoroMinutes: 25
    });

    setNewTaskTitle('');
  };

  // Day Name Mapping
  const days = [
    { num: 1 as const, name: 'Monday', short: 'Mon' },
    { num: 2 as const, name: 'Tuesday', short: 'Tue' },
    { num: 3 as const, name: 'Wednesday', short: 'Wed' },
    { num: 4 as const, name: 'Thursday', short: 'Thu' },
    { num: 5 as const, name: 'Friday', short: 'Fri' }
  ];

  const slotsForDay = timetableSlots
    .filter(slot => slot.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const completedTaskCount = studyTasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Top Banner introducing the feature */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              Smart Class Schedule & Focus Study Hub
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Routine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Weekly lecture room coordinates with an integrated Pomodoro study sprint workspace.
          </p>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
          <div className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Current Next Class</div>
            <div className="text-[11px] text-slate-500">CS304 Operating Systems @ Hopper C12</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Weekly Class Timetable */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Class Timetable
              </h2>
              <span className="text-xs text-slate-500">Fall 2026 Academic Calendar</span>
            </div>

            {/* Day Selector Pills */}
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-xl mb-5">
              {days.map(d => (
                <button
                  key={d.num}
                  onClick={() => setSelectedDay(d.num)}
                  className={`py-2 text-xs font-bold rounded-lg transition text-center ${
                    selectedDay === d.num
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="block sm:hidden">{d.short}</span>
                  <span className="hidden sm:block">{d.name}</span>
                </button>
              ))}
            </div>

            {/* Slots for selected day */}
            <div className="space-y-3">
              {slotsForDay.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No scheduled lectures for this day. Free study day!
                </div>
              ) : (
                slotsForDay.map((slot, index) => {
                  const subject = subjects.find(s => s.id === slot.subjectId);

                  return (
                    <div
                      key={slot.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs shrink-0"
                          style={{
                            backgroundColor: `${subject?.color || '#4f46e5'}15`,
                            color: subject?.color || '#4f46e5'
                          }}
                        >
                          <span>{subject?.code}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">{subject?.name}</h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                slot.type === 'Lab'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : slot.type === 'Tutorial'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {slot.type}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {slot.room}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {slot.instructor}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Time Block */}
                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-xs font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                          {slot.startTime} – {slot.endTime}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Pomodoro Focus Hub & Study Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pomodoro Timer Card (Professional Polish Dark Slate Card) */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  {isBreak ? 'Short Break' : 'Deep Study Focus'}
                </span>

                <button
                  onClick={() => setSoundEnabled(prev => !prev)}
                  className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
                  title="Toggle ambient chime"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Big Timer Digits */}
              <div className="my-5 text-center">
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tight font-mono">
                  {formatTimer(timeLeft)}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {isBreak ? 'Take a breath, stretch, and grab water' : '25-minute sprint: No distractions'}
                </p>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleStartPause}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white transition shadow-sm ${
                    isRunning
                      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40'
                      : 'bg-indigo-500 hover:bg-indigo-400 shadow-indigo-900/50'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 ml-0.5" /> Start Focus
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleResetTimer(25, false)}
                  className="p-3 rounded-xl border border-slate-700/80 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  title="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Presets */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-800 text-xs">
                <button
                  onClick={() => handleResetTimer(25, false)}
                  className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium text-slate-300 hover:text-white transition"
                >
                  25m Focus
                </button>
                <button
                  onClick={() => handleResetTimer(50, false)}
                  className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium text-slate-300 hover:text-white transition"
                >
                  50m Intense
                </button>
                <button
                  onClick={() => handleResetTimer(5, true)}
                  className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium text-slate-300 hover:text-white transition"
                >
                  5m Break
                </button>
              </div>
            </div>

            {/* Glowing blur backdrop effect */}
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* Study Focus Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today's Study Goals</h3>
                <span className="text-xs text-slate-500">
                  {completedTaskCount} of {studyTasks.length} tasks completed
                </span>
              </div>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>

            {/* Quick Add Task Input */}
            <form onSubmit={handleCreateTask} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add study objective..."
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0"
              >
                Add
              </button>
            </form>

            {/* Task Items */}
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {studyTasks.map(task => {
                const subject = subjects.find(s => s.id === task.subjectId);

                return (
                  <div
                    key={task.id}
                    className={`p-2.5 rounded-xl border transition flex items-center justify-between text-xs ${
                      task.completed
                        ? 'bg-slate-50/60 border-slate-100 text-slate-400 line-through'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-200'
                    }`}
                  >
                    <div
                      onClick={() => onToggleTask(task.id)}
                      className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span className="truncate">{task.title}</span>
                      {subject && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 shrink-0">
                          {subject.code}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 transition ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
