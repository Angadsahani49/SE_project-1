import {
  StudentProfile,
  Subject,
  AttendanceRecord,
  Note,
  Assignment,
  AssessmentGrade,
  TimetableSlot,
  StudyTask
} from '../types';
import { additionalBtechCseNotes } from './btechCseData';

export const initialProfile: StudentProfile = {
  id: 'usr_1028',
  name: 'Alex Rivera',
  studentId: 'CS-2024-8842',
  email: 'alex.rivera@cs.university.edu',
  degree: 'B.Tech',
  major: 'Computer Science & Engineering (CSE)',
  semester: 'Semester 5 (3rd Year)',
  section: 'Section A',
  university: 'Metropolitan Institute of Technology',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  academicYear: '2026 - 2027',
  attendanceGoal: 75
};

export const initialSubjects: Subject[] = [
  {
    id: 'subj_cs301',
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    professor: 'Prof. Sarah Lin',
    credits: 4,
    color: '#059669', // Emerald
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    room: 'Turing Hall 302',
    attendanceGoal: 75
  },
  {
    id: 'subj_cs304',
    code: 'CS304',
    name: 'Operating Systems & Concurrency',
    professor: 'Dr. David Chen',
    credits: 4,
    color: '#d97706', // Amber
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    room: 'Hopper Science C12',
    attendanceGoal: 75
  },
  {
    id: 'subj_cs307',
    code: 'CS307',
    name: 'Database Management Systems',
    professor: 'Prof. Priya Sharma',
    credits: 3,
    color: '#4f46e5', // Indigo
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    room: 'Knuth Lab 104',
    attendanceGoal: 75
  },
  {
    id: 'subj_cs312',
    code: 'CS312',
    name: 'Computer Networks & Security',
    professor: 'Dr. Robert Hayes',
    credits: 3,
    color: '#0284c7', // Sky
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    room: 'Shannon Wing 201',
    attendanceGoal: 75
  },
  {
    id: 'subj_cs315',
    code: 'CS315',
    name: 'Machine Learning & Neural Nets',
    professor: 'Dr. Elena Rostova',
    credits: 4,
    color: '#7c3aed', // Violet
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    room: 'Neumann Complex 405',
    attendanceGoal: 75
  }
];

// Helper to generate recent attendance records
export const initialAttendanceRecords: AttendanceRecord[] = [
  // Today: Sep 2, 2026
  { id: 'att_101', subjectId: 'subj_cs301', date: '2026-09-02', status: 'present', remarks: 'Binary Heaps lecture' },
  { id: 'att_102', subjectId: 'subj_cs307', date: '2026-09-02', status: 'present', remarks: 'ACID properties lab' },
  { id: 'att_103', subjectId: 'subj_cs315', date: '2026-09-02', status: 'present', remarks: 'Backpropagation derivation' },

  // Yesterday: Sep 1, 2026
  { id: 'att_104', subjectId: 'subj_cs304', date: '2026-09-01', status: 'absent', remarks: 'Doctor appointment' },
  { id: 'att_105', subjectId: 'subj_cs312', date: '2026-09-01', status: 'present', remarks: 'Subnet masking' },

  // Aug 31, 2026
  { id: 'att_106', subjectId: 'subj_cs301', date: '2026-08-31', status: 'present' },
  { id: 'att_107', subjectId: 'subj_cs304', date: '2026-08-31', status: 'absent', remarks: 'Missed morning transit' },
  { id: 'att_108', subjectId: 'subj_cs307', date: '2026-08-31', status: 'present' },

  // Aug 28, 2026
  { id: 'att_109', subjectId: 'subj_cs315', date: '2026-08-28', status: 'present' },
  { id: 'att_110', subjectId: 'subj_cs312', date: '2026-08-28', status: 'late', remarks: 'Late by 10 mins' },
  { id: 'att_111', subjectId: 'subj_cs301', date: '2026-08-28', status: 'present' },

  // Aug 27, 2026
  { id: 'att_112', subjectId: 'subj_cs304', date: '2026-08-27', status: 'present' },
  { id: 'att_113', subjectId: 'subj_cs307', date: '2026-08-27', status: 'present' },

  // Aug 26, 2026
  { id: 'att_114', subjectId: 'subj_cs301', date: '2026-08-26', status: 'present' },
  { id: 'att_115', subjectId: 'subj_cs315', date: '2026-08-26', status: 'present' },
  { id: 'att_116', subjectId: 'subj_cs312', date: '2026-08-26', status: 'present' },

  // Aug 25, 2026
  { id: 'att_117', subjectId: 'subj_cs304', date: '2026-08-25', status: 'absent' },
  { id: 'att_118', subjectId: 'subj_cs307', date: '2026-08-25', status: 'present' },

  // Aug 24, 2026
  { id: 'att_119', subjectId: 'subj_cs301', date: '2026-08-24', status: 'present' },
  { id: 'att_120', subjectId: 'subj_cs312', date: '2026-08-24', status: 'present' },
  { id: 'att_121', subjectId: 'subj_cs315', date: '2026-08-24', status: 'late' },

  // Aug 21, 2026
  { id: 'att_122', subjectId: 'subj_cs304', date: '2026-08-21', status: 'present' },
  { id: 'att_123', subjectId: 'subj_cs307', date: '2026-08-21', status: 'present' },
  { id: 'att_124', subjectId: 'subj_cs301', date: '2026-08-21', status: 'present' },

  // Aug 20, 2026
  { id: 'att_125', subjectId: 'subj_cs312', date: '2026-08-20', status: 'present' },
  { id: 'att_126', subjectId: 'subj_cs315', date: '2026-08-20', status: 'present' },

  // Aug 19, 2026
  { id: 'att_127', subjectId: 'subj_cs304', date: '2026-08-19', status: 'absent', remarks: 'Flu sick leave' },
  { id: 'att_128', subjectId: 'subj_cs307', date: '2026-08-19', status: 'present' },
  { id: 'att_129', subjectId: 'subj_cs301', date: '2026-08-19', status: 'present' },

  // Aug 18, 2026
  { id: 'att_130', subjectId: 'subj_cs312', date: '2026-08-18', status: 'present' },
  { id: 'att_131', subjectId: 'subj_cs315', date: '2026-08-18', status: 'present' },

  // Aug 17, 2026
  { id: 'att_132', subjectId: 'subj_cs304', date: '2026-08-17', status: 'present' },
  { id: 'att_133', subjectId: 'subj_cs307', date: '2026-08-17', status: 'present' },
  { id: 'att_134', subjectId: 'subj_cs301', date: '2026-08-17', status: 'present' }
];

export const initialNotes: Note[] = [
  ...additionalBtechCseNotes,
  {
    id: 'note_1',
    title: 'Dijkstra & A* Shortest Path Algorithms',
    subjectId: 'subj_cs301',
    tags: ['Graph Theory', 'Heuristics', 'Greedy'],
    lastModified: '2026-09-01T14:30:00Z',
    isPinned: true,
    author: 'Alex Rivera',
    content: `## Shortest Path Algorithms Overview

### 1. Dijkstra's Algorithm
* **Time Complexity**: O((V + E) log V) using Fibonacci/Min-Heap.
* **Key Invariant**: Once a vertex is settled/visited, its shortest distance from the source is finalized.
* **Limitation**: Negative edge weights cause infinite loops or incorrect greedy steps.

\`\`\`python
import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        curr_dist, u = heapq.heappop(pq)
        if curr_dist > distances[u]:
            continue
        for v, weight in graph[u].items():
            if distances[u] + weight < distances[v]:
                distances[v] = distances[u] + weight
                heapq.heappush(pq, (distances[v], v))
    return distances
\`\`\`

### 2. A* Search
* Uses heuristic function: \`f(n) = g(n) + h(n)\`
* Admissible condition: \`h(n) <= true_cost(n, goal)\`
* Guaranteed optimal path if \`h(n)\` is consistent and admissible.`
  },
  {
    id: 'note_2',
    title: 'Process Synchronization: Mutex vs Counting Semaphores',
    subjectId: 'subj_cs304',
    tags: ['Concurrency', 'Deadlock', 'IPC'],
    lastModified: '2026-08-30T10:15:00Z',
    isPinned: true,
    author: 'Alex Rivera',
    content: `## Critical Section Problem & Synchronization

Three essential conditions to solve race conditions:
1. **Mutual Exclusion**: Only one process executes the critical section at any given time.
2. **Progress**: Selection of the next process cannot be postponed indefinitely.
3. **Bounded Waiting**: Bound exists on number of times other processes enter critical section.

### Mutex vs Semaphore Comparison:
* **Mutex (Mutual Exclusion Object)**:
  * Strict ownership (the thread that acquires must release).
  * Binary states (Locked / Unlocked).
* **Counting Semaphore**:
  * Integer value representing available resource count.
  * \`wait() / P()\` decrements value; blocks if value <= 0.
  * \`signal() / V()\` increments value; unblocks waiting threads.

### The 4 Coffman Deadlock Conditions:
1. Mutual Exclusion
2. Hold and Wait
3. No Preemption
4. Circular Wait`
  },
  {
    id: 'note_3',
    title: 'Relational Database Normalization (1NF through BCNF)',
    subjectId: 'subj_cs307',
    tags: ['SQL', 'Functional Dependencies', 'Schema Design'],
    lastModified: '2026-08-28T18:45:00Z',
    isPinned: false,
    author: 'Alex Rivera',
    content: `## Normal Forms Cheat Sheet

### 1NF (First Normal Form)
* Each column contains atomic (indivisible) values.
* No repeating groups or arrays stored in single cells.

### 2NF (Second Normal Form)
* Must be in 1NF.
* No **partial functional dependency**: Every non-prime attribute must be fully functionally dependent on the entire candidate key (only applies when composite keys exist).

### 3NF (Third Normal Form)
* Must be in 2NF.
* No **transitive dependencies**: If \`A -> B\` and \`B -> C\`, then \`A -> C\` must be broken into separate relations.
* Formally: For every non-trivial FD \`X -> Y\`, either \`X\` is a superkey OR \`Y\` is a prime attribute.

### BCNF (Boyce-Codd Normal Form)
* Stricter than 3NF.
* For every non-trivial FD \`X -> Y\`, \`X\` MUST be a superkey without exception.`
  },
  {
    id: 'note_4',
    title: 'TCP 3-Way Handshake & Congestion Control Mechanisms',
    subjectId: 'subj_cs312',
    tags: ['Transport Layer', 'Networking', 'TCP/IP'],
    lastModified: '2026-08-25T11:20:00Z',
    isPinned: false,
    author: 'Alex Rivera',
    content: `## TCP Reliable Transport

### 1. Connection Establishment (3-Way Handshake)
1. **Client -> Server**: \`SYN (seq = x)\`
2. **Server -> Client**: \`SYN-ACK (seq = y, ack = x + 1)\`
3. **Client -> Server**: \`ACK (seq = x + 1, ack = y + 1)\`

### 2. Congestion Window (cwnd) Phases:
* **Slow Start**: \`cwnd\` starts at 1 MSS, doubles every RTT (exponential growth) until \`ssthresh\`.
* **Congestion Avoidance**: When \`cwnd >= ssthresh\`, increments by 1 MSS per RTT (linear growth).
* **Fast Retransmit**: Triggered by 3 duplicate ACKs before timeout expires.
* **Fast Recovery**: Halves \`ssthresh\`, resets \`cwnd = ssthresh + 3 MSS\`.`
  },
  {
    id: 'note_5',
    title: 'Backpropagation & Neural Network Optimization Math',
    subjectId: 'subj_cs315',
    tags: ['Machine Learning', 'Deep Learning', 'Calculus'],
    lastModified: '2026-08-22T16:00:00Z',
    isPinned: false,
    author: 'Alex Rivera',
    content: `## Neural Network Gradients & Optimizers

### Chain Rule of Derivatives:
Given loss \`L\` and layer \`l\`:
\`\`\`
d(L)/d(W^[l]) = d(L)/d(Z^[l]) * (A^[l-1])^T
d(L)/d(B^[l]) = sum_over_examples( d(L)/d(Z^[l]) )
\`\`\`

### Adam Optimizer Update Rule:
Maintains exponentially decaying average of past gradients (\`m_t\`) and past squared gradients (\`v_t\`):
1. \`m_t = beta1 * m_{t-1} + (1 - beta1) * g_t\`
2. \`v_t = beta2 * v_{t-1} + (1 - beta2) * g_t^2\`
3. Bias correction: \`m_hat = m_t / (1 - beta1^t)\`, \`v_hat = v_t / (1 - beta2^t)\`
4. Parameter update: \`theta = theta - (lr / (sqrt(v_hat) + eps)) * m_hat\``
  }
];

export const initialAssignments: Assignment[] = [
  {
    id: 'asg_1',
    title: 'Distributed Concurrency & Dining Philosophers in C',
    subjectId: 'subj_cs304',
    dueDate: '2026-09-04T23:59:00Z', // In 2 days!
    priority: 'high',
    points: 100,
    weightPercentage: 15,
    status: 'pending',
    instructions: 'Implement deadlock-free solutions for the 5 philosophers problem using POSIX mutex locks and condition variables. Measure CPU context switches and provide throughput graphs.'
  },
  {
    id: 'asg_2',
    title: 'B+ Tree Index Implementation & Query Engine',
    subjectId: 'subj_cs307',
    dueDate: '2026-09-06T20:00:00Z', // In 4 days
    priority: 'medium',
    points: 100,
    weightPercentage: 20,
    status: 'pending',
    instructions: 'Create an in-memory B+ Tree with node splitting, merging on underflow, and range search queries for composite indexing. Include test harness passing 50,000 random key insertions.'
  },
  {
    id: 'asg_3',
    title: 'Convolutional Neural Net for Fashion-MNIST with PyTorch',
    subjectId: 'subj_cs315',
    dueDate: '2026-09-09T18:00:00Z', // In 7 days
    priority: 'high',
    points: 100,
    weightPercentage: 15,
    status: 'pending',
    instructions: 'Train a 4-layer CNN achieving >= 92.5% test accuracy. Implement Dropout (p=0.3) and Batch Normalization. Submit Jupyter notebook with loss convergence curves and confusion matrix.'
  },
  {
    id: 'asg_4',
    title: 'Packet Sniffer & TCP Stream Reassembly in Python',
    subjectId: 'subj_cs312',
    dueDate: '2026-09-12T23:59:00Z',
    priority: 'low',
    points: 50,
    weightPercentage: 10,
    status: 'pending',
    instructions: 'Capture raw Ethernet frames with sockets or Scapy. Reassemble fragmented TCP streams and extract transmitted HTTP payload text.'
  },
  {
    id: 'asg_5',
    title: 'Red-Black Tree Balancing & Interval Search Benchmark',
    subjectId: 'subj_cs301',
    dueDate: '2026-08-29T23:59:00Z',
    priority: 'high',
    points: 100,
    weightPercentage: 15,
    status: 'graded',
    score: 98,
    instructions: 'Self-balancing red-black tree with insertion rotations and deletion cases. Profile against standard library std::map.',
    submittedAt: '2026-08-28T19:30:00Z',
    submissionNotes: 'All unit tests passed with 0 memory leaks verified via Valgrind.',
    feedback: 'Exceptional test suite and clean rotation proofs. Minor formatting on docstrings.'
  },
  {
    id: 'asg_6',
    title: 'Relational Calculus to SQL Query Optimizer',
    subjectId: 'subj_cs307',
    dueDate: '2026-08-23T23:59:00Z',
    priority: 'medium',
    points: 50,
    weightPercentage: 10,
    status: 'graded',
    score: 47,
    instructions: 'Translate relational tuple calculus queries into equivalent ANSI SQL joins and group-by clauses.',
    submittedAt: '2026-08-22T21:10:00Z',
    feedback: 'Well-structured transformations. Good edge-case coverage on NULL values.'
  }
];

export const initialAssessments: AssessmentGrade[] = [
  // CS301 (DSA)
  { id: 'gr_1', subjectId: 'subj_cs301', name: 'Quiz 1: Asymptotic Analysis & Recurrences', category: 'quiz', score: 95, maxScore: 100, weightPercentage: 10, date: '2026-08-10' },
  { id: 'gr_2', subjectId: 'subj_cs301', name: 'Assignment 1: Red-Black Tree Implementation', category: 'assignment', score: 98, maxScore: 100, weightPercentage: 15, date: '2026-08-28' },
  { id: 'gr_3', subjectId: 'subj_cs301', name: 'Midterm Exam 1: Linear & Non-linear Data Structures', category: 'midterm', score: 92, maxScore: 100, weightPercentage: 25, date: '2026-08-22' },

  // CS304 (OS)
  { id: 'gr_4', subjectId: 'subj_cs304', name: 'Quiz 1: CPU Scheduling Algorithms', category: 'quiz', score: 82, maxScore: 100, weightPercentage: 10, date: '2026-08-14' },
  { id: 'gr_5', subjectId: 'subj_cs304', name: 'Midterm Exam: Memory Management & Paging', category: 'midterm', score: 84, maxScore: 100, weightPercentage: 25, date: '2026-08-25' },

  // CS307 (DBMS)
  { id: 'gr_6', subjectId: 'subj_cs307', name: 'Quiz 1: Relational Algebra & Calculus', category: 'quiz', score: 94, maxScore: 100, weightPercentage: 10, date: '2026-08-12' },
  { id: 'gr_7', subjectId: 'subj_cs307', name: 'Assignment 1: SQL Optimization', category: 'assignment', score: 94, maxScore: 100, weightPercentage: 10, date: '2026-08-22' },
  { id: 'gr_8', subjectId: 'subj_cs307', name: 'Midterm Exam: ER Modeling & Schema Design', category: 'midterm', score: 90, maxScore: 100, weightPercentage: 25, date: '2026-08-26' },

  // CS312 (Networks)
  { id: 'gr_9', subjectId: 'subj_cs312', name: 'Quiz 1: OSI & TCP/IP Model Layers', category: 'quiz', score: 88, maxScore: 100, weightPercentage: 10, date: '2026-08-15' },
  { id: 'gr_10', subjectId: 'subj_cs312', name: 'Midterm Exam: Link Layer & MAC Protocols', category: 'midterm', score: 86, maxScore: 100, weightPercentage: 25, date: '2026-08-24' },

  // CS315 (ML)
  { id: 'gr_11', subjectId: 'subj_cs315', name: 'Quiz 1: Linear Regression & Gradient Descent', category: 'quiz', score: 98, maxScore: 100, weightPercentage: 10, date: '2026-08-16' },
  { id: 'gr_12', subjectId: 'subj_cs315', name: 'Project Milestone 1: Data Preprocessing Pipeline', category: 'project', score: 96, maxScore: 100, weightPercentage: 15, date: '2026-08-27' }
];

export const initialTimetableSlots: TimetableSlot[] = [
  // Monday (1)
  { id: 'tt_1', subjectId: 'subj_cs301', dayOfWeek: 1, startTime: '09:00', endTime: '10:30', type: 'Lecture', room: 'Turing Hall 302', instructor: 'Prof. Sarah Lin' },
  { id: 'tt_2', subjectId: 'subj_cs304', dayOfWeek: 1, startTime: '10:45', endTime: '12:15', type: 'Lecture', room: 'Hopper Science C12', instructor: 'Dr. David Chen' },
  { id: 'tt_3', subjectId: 'subj_cs307', dayOfWeek: 1, startTime: '13:30', endTime: '15:30', type: 'Lab', room: 'Knuth Lab 104', instructor: 'Prof. Priya Sharma' },

  // Tuesday (2)
  { id: 'tt_4', subjectId: 'subj_cs312', dayOfWeek: 2, startTime: '09:30', endTime: '11:00', type: 'Lecture', room: 'Shannon Wing 201', instructor: 'Dr. Robert Hayes' },
  { id: 'tt_5', subjectId: 'subj_cs315', dayOfWeek: 2, startTime: '11:15', endTime: '12:45', type: 'Lecture', room: 'Neumann Complex 405', instructor: 'Dr. Elena Rostova' },
  { id: 'tt_6', subjectId: 'subj_cs304', dayOfWeek: 2, startTime: '14:00', endTime: '16:00', type: 'Lab', room: 'Systems Lab S02', instructor: 'Dr. David Chen' },

  // Wednesday (3)
  { id: 'tt_7', subjectId: 'subj_cs301', dayOfWeek: 3, startTime: '09:00', endTime: '10:30', type: 'Lecture', room: 'Turing Hall 302', instructor: 'Prof. Sarah Lin' },
  { id: 'tt_8', subjectId: 'subj_cs307', dayOfWeek: 3, startTime: '10:45', endTime: '12:15', type: 'Lecture', room: 'Knuth Lab 104', instructor: 'Prof. Priya Sharma' },
  { id: 'tt_9', subjectId: 'subj_cs315', dayOfWeek: 3, startTime: '13:30', endTime: '15:30', type: 'Lab', room: 'AI Cluster Lab 01', instructor: 'Dr. Elena Rostova' },

  // Thursday (4)
  { id: 'tt_10', subjectId: 'subj_cs304', dayOfWeek: 4, startTime: '09:30', endTime: '11:00', type: 'Lecture', room: 'Hopper Science C12', instructor: 'Dr. David Chen' },
  { id: 'tt_11', subjectId: 'subj_cs312', dayOfWeek: 4, startTime: '11:15', endTime: '12:45', type: 'Lecture', room: 'Shannon Wing 201', instructor: 'Dr. Robert Hayes' },
  { id: 'tt_12', subjectId: 'subj_cs301', dayOfWeek: 4, startTime: '14:00', endTime: '16:00', type: 'Tutorial', room: 'Turing Hall 302', instructor: 'Teaching Asst. Marcus' },

  // Friday (5)
  { id: 'tt_13', subjectId: 'subj_cs315', dayOfWeek: 5, startTime: '09:00', endTime: '10:30', type: 'Lecture', room: 'Neumann Complex 405', instructor: 'Dr. Elena Rostova' },
  { id: 'tt_14', subjectId: 'subj_cs307', dayOfWeek: 5, startTime: '10:45', endTime: '12:15', type: 'Lecture', room: 'Knuth Lab 104', instructor: 'Prof. Priya Sharma' },
  { id: 'tt_15', subjectId: 'subj_cs312', dayOfWeek: 5, startTime: '13:30', endTime: '15:30', type: 'Lab', room: 'Networks Lab 308', instructor: 'Dr. Robert Hayes' }
];

export const initialStudyTasks: StudyTask[] = [
  { id: 'task_1', title: 'Review Dining Philosophers mutex code & semaphore lock', subjectId: 'subj_cs304', completed: false, pomodoroMinutes: 50, createdAt: '2026-09-02' },
  { id: 'task_2', title: 'Implement B+ Tree node split tests', subjectId: 'subj_cs307', completed: false, pomodoroMinutes: 75, createdAt: '2026-09-02' },
  { id: 'task_3', title: 'Prepare notes for Friday Neural Networks seminar', subjectId: 'subj_cs315', completed: true, pomodoroMinutes: 25, createdAt: '2026-09-01' }
];
