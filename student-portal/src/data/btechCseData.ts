import { TeacherProfile, ClassStudent, DailyAttendanceSession, Note } from '../types';

export const initialTeachers: TeacherProfile[] = [
  {
    id: 'teach_1',
    teacherId: 'FAC-CSE-101',
    name: 'Dr. David Chen',
    email: 'd.chen@faculty.mit.edu',
    department: 'Department of Computer Science & Engineering',
    designation: 'Professor & Systems Lab Head',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    assignedSubjectIds: ['subj_cs304'] // Operating Systems
  },
  {
    id: 'teach_2',
    teacherId: 'FAC-CSE-102',
    name: 'Prof. Sarah Lin',
    email: 's.lin@faculty.mit.edu',
    department: 'Department of Computer Science & Engineering',
    designation: 'Associate Professor (Algorithms)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    assignedSubjectIds: ['subj_cs301'] // Data Structures & Algorithms
  },
  {
    id: 'teach_3',
    teacherId: 'FAC-CSE-103',
    name: 'Prof. Priya Sharma',
    email: 'p.sharma@faculty.mit.edu',
    department: 'Department of Computer Science & Engineering',
    designation: 'Assistant Professor (Databases)',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    assignedSubjectIds: ['subj_cs307'] // DBMS
  },
  {
    id: 'teach_4',
    teacherId: 'FAC-CSE-104',
    name: 'Dr. Robert Hayes',
    email: 'r.hayes@faculty.mit.edu',
    department: 'Department of Computer Science & Engineering',
    designation: 'Associate Professor (Networks & Security)',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    assignedSubjectIds: ['subj_cs312'] // Computer Networks
  },
  {
    id: 'teach_5',
    teacherId: 'FAC-CSE-105',
    name: 'Dr. Elena Rostova',
    email: 'e.rostova@faculty.mit.edu',
    department: 'Department of Computer Science & Engineering',
    designation: 'Professor (AI & Neural Networks)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    assignedSubjectIds: ['subj_cs315'] // Machine Learning
  }
];

// Class Roster for B.Tech CSE (3rd Year, Section A)
export const initialClassStudents: ClassStudent[] = [
  {
    id: 'usr_1028',
    rollNumber: 'CS-2024-8842',
    name: 'Alex Rivera (You)',
    email: 'alex.rivera@cs.university.edu',
    batch: 'B.Tech CSE - 3rd Year (Sec A)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'std_101',
    rollNumber: 'CS-2024-8843',
    name: 'Priya Patel',
    email: 'priya.patel@cs.university.edu',
    batch: 'B.Tech CSE - 3rd Year (Sec A)',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'std_102',
    rollNumber: 'CS-2024-8844',
    name: 'Rahul Sharma',
    email: 'rahul.s@cs.university.edu',
    batch: 'B.Tech CSE - 3rd Year (Sec A)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'std_103',
    rollNumber: 'CS-2024-8845',
    name: 'Rohan Verma',
    email: 'rohan.v@cs.university.edu',
    batch: 'B.Tech CSE - 3rd Year (Sec A)',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'std_104',
    rollNumber: 'CS-2024-8846',
    name: 'Sneha Gupta',
    email: 'sneha.g@cs.university.edu',
    batch: 'B.Tech CSE - 3rd Year (Sec A)',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'std_105',
    rollNumber: 'CS-2024-8847',
    name: 'Amit Kumar',
    email: 'amit.k@cs.university.edu',
    batch: 'B.Tech CSE - 3rd Year (Sec A)',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'std_106',
    rollNumber: 'CS-2024-8848',
    name: 'Ananya Roy',
    email: 'ananya.r@cs.university.edu',
    batch: 'B.Tech CSE - 3rd Year (Sec A)',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'std_107',
    rollNumber: 'CS-2024-8849',
    name: 'Kabir Mehta',
    email: 'kabir.m@cs.university.edu',
    batch: 'B.Tech CSE - 3rd Year (Sec A)',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'std_108',
    rollNumber: 'CS-2024-8850',
    name: 'Divya Singh',
    email: 'divya.s@cs.university.edu',
    batch: 'B.Tech CSE - 3rd Year (Sec A)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'std_109',
    rollNumber: 'CS-2024-8851',
    name: 'Varun Nair',
    email: 'varun.n@cs.university.edu',
    batch: 'B.Tech CSE - 3rd Year (Sec A)',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'
  }
];

// Additional rich B.Tech CSE Notes
export const additionalBtechCseNotes: Note[] = [
  {
    id: 'note_btech_1',
    title: 'Graph Algorithms: Dijkstra vs Bellman-Ford vs Floyd-Warshall',
    subjectId: 'subj_cs301',
    tags: ['Graph Theory', 'Shortest Path', 'B.Tech Core', 'Dynamic Programming'],
    lastModified: '2026-09-02T08:30:00Z',
    isPinned: true,
    author: 'Prof. Sarah Lin (Faculty Verified)',
    content: `## Shortest Path Algorithms Comparison

### 1. Dijkstra's Algorithm
* **Approach**: Greedy with Min-Priority Queue (Fibonacci or Binary Heap).
* **Time Complexity**: \`O((V + E) log V)\` using Min-Heap.
* **Limitation**: **Fails on negative weight edges** (assumes once a vertex is visited, its distance is optimal).
* **Use case**: Single-Source Shortest Path (SSSP) in networks, GPS route planning (OSPF routing).

### 2. Bellman-Ford Algorithm
* **Approach**: Dynamic Programming (edge relaxation \`V - 1\` times).
* **Time Complexity**: \`O(V * E)\`.
* **Superpower**: Handles negative weights and **detects negative weight cycles** (if distance decreases in the \`V\`th relaxation iteration).
* **Recurrence**: \`dist[v] = min(dist[v], dist[u] + weight(u, v))\`.

### 3. Floyd-Warshall Algorithm
* **Approach**: All-Pairs Shortest Path (APSP) using 3-nested loops.
* **Time Complexity**: \`O(V^3)\` with space \`O(V^2)\`.
* **State Transition**:
\`\`\`c
for (int k = 0; k < V; k++) {
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (dist[i][k] + dist[k][j] < dist[i][j])
                dist[i][j] = dist[i][k] + dist[k][j];
        }
    }
}
\`\`\``
  },
  {
    id: 'note_btech_2',
    title: "Deadlock Avoidance: Banker's Safety & Resource-Request Algorithm",
    subjectId: 'subj_cs304',
    tags: ['Operating Systems', 'Concurrency', 'Deadlock', 'B.Tech Core'],
    lastModified: '2026-09-01T14:20:00Z',
    isPinned: true,
    author: 'Dr. David Chen (Faculty Verified)',
    content: `## Banker's Algorithm (Dijkstra's Banking Protocol)

Avoids deadlocks by verifying if granting a resource request leaves the system in a **Safe State**.

### Key Matrices:
1. **Available[m]**: Quantity of each resource type currently unallocated.
2. **Max[n][m]**: Maximum demand of each process.
3. **Allocation[n][m]**: Currently allocated instances of each resource.
4. **Need[n][m] = Max[i][j] - Allocation[i][j]**: Remaining resources required to finish.

### Safety Algorithm Steps:
1. Initialize \`Work = Available\` and \`Finish[i] = false\` for all \`i = 0...n-1\`.
2. Find an index \`i\` such that:
   * \`Finish[i] == false\`
   * \`Need[i] <= Work\`
3. If such \`i\` exists:
   * \`Work = Work + Allocation[i]\`
   * \`Finish[i] = true\`
   * Go back to Step 2.
4. If \`Finish[i] == true\` for all \`i\`, the system is in a **SAFE STATE** (Safe Sequence found: e.g. \`<P1, P3, P0, P2, P4>\`).

### Resource-Request Algorithm:
When Process \`Pi\` requests vector \`Request_i\`:
1. If \`Request_i <= Need_i\`, proceed; else raise error (exceeded max claim).
2. If \`Request_i <= Available\`, proceed; else \`Pi\` must wait (resources not available).
3. Pretend to allocate:
   * \`Available = Available - Request_i\`
   * \`Allocation_i = Allocation_i + Request_i\`
   * \`Need_i = Need_i - Request_i\`
4. Run Safety Check. If safe -> grant resources. If unsafe -> roll back and \`Pi\` must wait.`
  },
  {
    id: 'note_btech_3',
    title: 'ACID Properties, Isolation Levels & Strict Two-Phase Locking (2PL)',
    subjectId: 'subj_cs307',
    tags: ['DBMS', 'Transactions', 'Concurrency Control', 'SQL'],
    lastModified: '2026-08-31T11:45:00Z',
    isPinned: false,
    author: 'Prof. Priya Sharma (Faculty Verified)',
    content: `## DBMS Transaction Fundamentals

### The ACID Guarantee:
* **Atomicity**: All operations succeed, or transaction is rolled back (Undo logging via Write-Ahead Log).
* **Consistency**: Database transitions from one valid state to another satisfying all integrity constraints.
* **Isolation**: Concurrent executions yield results identical to serial executions.
* **Durability**: Committed updates survive crashes (Redo logging).

### ANSI SQL Transaction Isolation Levels:
1. **Read Uncommitted**: Suffers from Dirty Reads, Non-repeatable Reads, Phantom Reads.
2. **Read Committed**: No Dirty Reads. Still prone to Non-repeatable Reads & Phantoms. (Default in PostgreSQL/Oracle).
3. **Repeatable Read**: Snapshot-based. No Dirty or Non-repeatable Reads. (Default in MySQL InnoDB via MVCC).
4. **Serializable**: Full isolation. Prevents all anomalies including Write Skew.

### Two-Phase Locking (2PL) Protocol:
* **Growing Phase**: Locks may be acquired, but NO locks can be released.
* **Shrinking Phase**: Locks may be released, but NO new locks can be acquired.
* **Strict 2PL**: Holds all Exclusive (X) locks until transaction commits/aborts (prevents cascading aborts).
* **Rigorous 2PL**: Holds BOTH Shared (S) and Exclusive (X) locks until commit.`
  },
  {
    id: 'note_btech_4',
    title: 'CIDR Subnet Masking & IPv4 Packet Header Breakdown',
    subjectId: 'subj_cs312',
    tags: ['Computer Networks', 'IP Addressing', 'Subnetting', 'B.Tech Core'],
    lastModified: '2026-08-30T16:10:00Z',
    isPinned: false,
    author: 'Dr. Robert Hayes (Faculty Verified)',
    content: `## Subnetting & CIDR (Classless Inter-Domain Routing)

### Subnet Calculation Formula:
Given an IP prefix \`192.168.10.0/27\`:
* **Subnet Mask**: \`255.255.255.224\` (27 bits of 1s, 5 bits of 0s).
* **Total IP Addresses**: \`2^(32 - 27) = 2^5 = 32\` addresses.
* **Usable Host Addresses**: \`2^5 - 2 = 30\` hosts (Network ID and Broadcast ID reserved).
* **Network Address**: \`192.168.10.0\`
* **Broadcast Address**: \`192.168.10.31\`
* **Usable Host Range**: \`192.168.10.1\` to \`192.168.10.30\`.

### IPv4 Header Structure (20 to 60 Bytes):
1. **Version (4 bits)**: Typically \`0100\` (IPv4).
2. **IHL (4 bits)**: Internet Header Length in 32-bit words (min 5 = 20 bytes).
3. **Type of Service / DSCP (8 bits)**: QoS classification.
4. **Total Length (16 bits)**: Header + Data payload (max 65,535 bytes).
5. **Identification, Flags, Fragment Offset (32 bits)**: MTU fragmentation control (DF=Don't Fragment, MF=More Fragments).
6. **TTL (Time to Live, 8 bits)**: Decremented by 1 at each router hop; prevents routing loops.
7. **Protocol (8 bits)**: 6 for TCP, 17 for UDP, 1 for ICMP.
8. **Header Checksum (16 bits)**: Detects bit errors in the IP header only.`
  },
  {
    id: 'note_btech_5',
    title: 'Theory of Computation: Finite Automata, DFA Minimization & Pumping Lemma',
    subjectId: 'subj_cs301',
    tags: ['Automata Theory', 'Formal Languages', 'TOC', 'Compiler Design'],
    lastModified: '2026-08-29T14:00:00Z',
    isPinned: false,
    author: 'Alex Rivera',
    content: `## Regular Languages & Automata

### DFA vs NFA:
* **Deterministic Finite Automata (DFA)**:
  * 5-tuple: \`(Q, Sigma, delta, q_0, F)\`.
  * Transition function: \`delta: Q x Sigma -> Q\` (exactly one deterministic next state).
* **Non-deterministic Finite Automata (NFA)**:
  * Transition function: \`delta: Q x (Sigma U {epsilon}) -> 2^Q\` (power set of states).
  * **Equivalence**: Every NFA can be converted to an equivalent DFA using Subset Construction (power set algorithm, worst-case \`2^|Q|\` states).

### The Pumping Lemma for Regular Languages:
If \`L\` is regular, there exists pumping length \`p\` such that every string \`s in L\` with \`|s| >= p\` can be divided into \`s = xyz\` satisfying:
1. \`|y| > 0\`
2. \`|xy| <= p\`
3. For all \`i >= 0\`, \`x(y^i)z in L\`.

* **Classical Proof Example**: Proving \`L = {a^n b^n | n >= 0}\` is NOT regular.
  * Pick \`s = a^p b^p\`. Since \`|xy| <= p\`, \`y\` consists solely of \`a\`'s.
  * Pumping \`i = 2\` produces \`a^(p + |y|) b^p\` which has more \`a\`'s than \`b\`'s, contradiction! Hence not regular.`
  }
];

// Initial pre-recorded attendance sessions
export const initialDailyAttendanceSessions: DailyAttendanceSession[] = [
  {
    id: 'session_1',
    date: '2026-09-02',
    subjectId: 'subj_cs301',
    teacherId: 'FAC-CSE-102',
    teacherName: 'Prof. Sarah Lin',
    topicCovered: 'Binary Heaps & Priority Queues implementation in C++',
    timestamp: '2026-09-02T10:30:00Z',
    records: [
      { studentId: 'usr_1028', rollNumber: 'CS-2024-8842', studentName: 'Alex Rivera (You)', status: 'present', remarks: 'Active participation' },
      { studentId: 'std_101', rollNumber: 'CS-2024-8843', studentName: 'Priya Patel', status: 'present' },
      { studentId: 'std_102', rollNumber: 'CS-2024-8844', studentName: 'Rahul Sharma', status: 'present' },
      { studentId: 'std_103', rollNumber: 'CS-2024-8845', studentName: 'Rohan Verma', status: 'present' },
      { studentId: 'std_104', rollNumber: 'CS-2024-8846', studentName: 'Sneha Gupta', status: 'present' },
      { studentId: 'std_105', rollNumber: 'CS-2024-8847', studentName: 'Amit Kumar', status: 'present' },
      { studentId: 'std_106', rollNumber: 'CS-2024-8848', studentName: 'Ananya Roy', status: 'late', remarks: 'Joined at 9:15 AM' },
      { studentId: 'std_107', rollNumber: 'CS-2024-8849', studentName: 'Kabir Mehta', status: 'absent', remarks: 'Sports tournament' },
      { studentId: 'std_108', rollNumber: 'CS-2024-8850', studentName: 'Divya Singh', status: 'present' },
      { studentId: 'std_109', rollNumber: 'CS-2024-8851', studentName: 'Varun Nair', status: 'present' }
    ]
  },
  {
    id: 'session_2',
    date: '2026-09-01',
    subjectId: 'subj_cs304',
    teacherId: 'FAC-CSE-101',
    teacherName: 'Dr. David Chen',
    topicCovered: 'Process Synchronization & Mutex locks vs Semaphores',
    timestamp: '2026-09-01T12:15:00Z',
    records: [
      { studentId: 'usr_1028', rollNumber: 'CS-2024-8842', studentName: 'Alex Rivera (You)', status: 'absent', remarks: 'Doctor appointment' },
      { studentId: 'std_101', rollNumber: 'CS-2024-8843', studentName: 'Priya Patel', status: 'present' },
      { studentId: 'std_102', rollNumber: 'CS-2024-8844', studentName: 'Rahul Sharma', status: 'present' },
      { studentId: 'std_103', rollNumber: 'CS-2024-8845', studentName: 'Rohan Verma', status: 'present' },
      { studentId: 'std_104', rollNumber: 'CS-2024-8846', studentName: 'Sneha Gupta', status: 'present' },
      { studentId: 'std_105', rollNumber: 'CS-2024-8847', studentName: 'Amit Kumar', status: 'absent' },
      { studentId: 'std_106', rollNumber: 'CS-2024-8848', studentName: 'Ananya Roy', status: 'present' },
      { studentId: 'std_107', rollNumber: 'CS-2024-8849', studentName: 'Kabir Mehta', status: 'present' },
      { studentId: 'std_108', rollNumber: 'CS-2024-8850', studentName: 'Divya Singh', status: 'present' },
      { studentId: 'std_109', rollNumber: 'CS-2024-8851', studentName: 'Varun Nair', status: 'present' }
    ]
  }
];
