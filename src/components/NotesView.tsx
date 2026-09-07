import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Pin,
  Tag,
  Calendar,
  Copy,
  Download,
  Trash2,
  Check,
  FileText,
  Sparkles,
  X
} from 'lucide-react';
import { Note, Subject } from '../types';

interface NotesViewProps {
  notes: Note[];
  subjects: Subject[];
  onAddNote: (note: Omit<Note, 'id' | 'lastModified'>) => void;
  onUpdateNote: (id: string, updated: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  subjects,
  onAddNote,
  onUpdateNote,
  onDeleteNote
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeNoteModal, setActiveNoteModal] = useState<Note | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Note Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newTags, setNewTags] = useState('');
  const [newContent, setNewContent] = useState('');

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSubject = selectedSubject === 'all' || note.subjectId === selectedSubject;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.some(t => t.toLowerCase().includes(query));
    return matchesSubject && matchesQuery;
  });

  // Sort: Pinned first, then latest modified
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
  });

  const handleCopyNote = (note: Note) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadNote = (note: Note) => {
    const element = document.createElement('a');
    const file = new Blob([`${note.title}\nSubject: ${note.subjectId}\nDate: ${note.lastModified}\n\n${note.content}`], {
      type: 'text/plain;charset=utf-8'
    });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleTogglePin = (note: Note) => {
    onUpdateNote(note.id, { isPinned: !note.isPinned });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onAddNote({
      title: newTitle.trim(),
      subjectId: newSubjectId,
      content: newContent.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['General'],
      author: 'Alex Rivera',
      isPinned: false
    });

    setNewTitle('');
    setNewTags('');
    setNewContent('');
    setIsCreateModalOpen(false);
  };

  const insertTemplate = () => {
    setNewContent(
`## Lecture Topic Overview

### Key Concepts & Definitions
- 

### Core Formulas & Algorithms
\`\`\`text
// Add syntax or step-by-step logic here
\`\`\`

### Exam Questions & Practice Problems
1. 
2. `
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Course Notes Repository
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {notes.length} Documents
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Browse lecture summaries, algorithm walkthroughs, and revision cheatsheets
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search & Subject Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes by topic, keyword, or tag..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none shadow-xs"
          />
        </div>

        {/* Subject Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedSubject === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Courses
          </button>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedSubject === s.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s.code}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No notes found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Try adjusting your search query or subject filter, or create a brand new note to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedNotes.map(note => {
            const subject = subjects.find(s => s.id === note.subjectId);
            const isCopied = copiedId === note.id;

            return (
              <div
                key={note.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div>
                  {/* Top Bar with Subject & Pin */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md border"
                      style={{
                        backgroundColor: `${subject?.color || '#4f46e5'}15`,
                        color: subject?.color || '#4f46e5',
                        borderColor: `${subject?.color || '#4f46e5'}30`
                      }}
                    >
                      {subject?.code || 'CS'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTogglePin(note)}
                        title={note.isPinned ? 'Unpin note' : 'Pin to top'}
                        className={`p-1.5 rounded-lg transition ${
                          note.isPinned
                            ? 'text-amber-500 bg-amber-50'
                            : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={() => onDeleteNote(note.id)}
                        title="Delete note"
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Preview */}
                  <h3
                    onClick={() => setActiveNoteModal(note)}
                    className="text-base font-bold text-slate-900 mt-2.5 cursor-pointer hover:text-indigo-600 line-clamp-2 transition"
                  >
                    {note.title}
                  </h3>

                  <p
                    onClick={() => setActiveNoteModal(note)}
                    className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed cursor-pointer font-normal"
                  >
                    {note.content.replace(/#|\*|`|-/g, '')}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer with Date & Quick Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{new Date(note.lastModified).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyNote(note)}
                      title="Copy note text"
                      className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700 transition"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDownloadNote(note)}
                      title="Download as text file"
                      className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Note Reader Modal */}
      {activeNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-slate-200 shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {subjects.find(s => s.id === activeNoteModal.subjectId)?.code}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(activeNoteModal.lastModified).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{activeNoteModal.title}</h2>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopyNote(activeNoteModal)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition"
                  title="Copy content"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownloadNote(activeNoteModal)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition"
                  title="Download note"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveNoteModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {activeNoteModal.content}
            </div>

            {/* Modal Footer with tags */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {activeNoteModal.tags.map((t, idx) => (
                  <span key={idx} className="text-xs text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    #{t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setActiveNoteModal(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Note Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Create New Study Note
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Heuristics, Graphs, Midterm"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Note Title</label>
                <input
                  type="text"
                  placeholder="e.g. Red-Black Tree Rotation Cases & Theorems"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none font-semibold"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Note Content</label>
                  <button
                    type="button"
                    onClick={insertTemplate}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Insert Lecture Template
                  </button>
                </div>
                <textarea
                  rows={8}
                  placeholder="Write formulas, algorithms, lecture takeaways, and questions here..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none font-mono leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-xs"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
