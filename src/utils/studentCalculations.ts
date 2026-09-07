import {
  Subject,
  AttendanceRecord,
  SubjectAttendanceStats,
  AssessmentGrade,
  CourseGradeSummary
} from '../types';

export function calculateSubjectAttendance(
  subject: Subject,
  records: AttendanceRecord[],
  goalPercentage: number = 75
): SubjectAttendanceStats {
  const subjectRecords = records.filter(r => r.subjectId === subject.id);
  const totalClasses = subjectRecords.length;

  if (totalClasses === 0) {
    return {
      subject,
      totalClasses: 0,
      attendedClasses: 0,
      absentClasses: 0,
      lateClasses: 0,
      excusedClasses: 0,
      percentage: 100,
      isSafe: true,
      canBunkCount: 0,
      needToAttendCount: 0
    };
  }

  let attended = 0;
  let absent = 0;
  let late = 0;
  let excused = 0;

  subjectRecords.forEach(r => {
    if (r.status === 'present') attended += 1;
    else if (r.status === 'late') {
      late += 1;
      attended += 1; // Late is counted as present in most university portals
    } else if (r.status === 'absent') {
      absent += 1;
    } else if (r.status === 'excused') {
      excused += 1;
      attended += 1; // Excused leave is credited
    }
  });

  const percentage = Math.round((attended / totalClasses) * 1000) / 10;
  const isSafe = percentage >= goalPercentage;
  const goalRatio = goalPercentage / 100;

  let canBunkCount = 0;
  let needToAttendCount = 0;

  if (isSafe) {
    // How many more classes can we miss without dropping below goal?
    // (attended) / (total + x) >= goalRatio => total + x <= attended / goalRatio => x <= (attended / goalRatio) - total
    const maxTotalAllowed = attended / goalRatio;
    canBunkCount = Math.max(0, Math.floor(maxTotalAllowed - totalClasses));
  } else {
    // How many consecutive classes must be attended to reach goal?
    // (attended + y) / (total + y) >= goalRatio => attended + y >= goalRatio * total + goalRatio * y
    // y * (1 - goalRatio) >= goalRatio * total - attended => y >= (goalRatio * total - attended) / (1 - goalRatio)
    if (goalRatio < 1) {
      needToAttendCount = Math.max(1, Math.ceil((goalRatio * totalClasses - attended) / (1 - goalRatio)));
    } else {
      needToAttendCount = 1;
    }
  }

  return {
    subject,
    totalClasses,
    attendedClasses: attended,
    absentClasses: absent,
    lateClasses: late,
    excusedClasses: excused,
    percentage,
    isSafe,
    canBunkCount,
    needToAttendCount
  };
}

export function calculateOverallAttendance(
  subjects: Subject[],
  records: AttendanceRecord[],
  goalPercentage: number = 75
): {
  overallPercentage: number;
  totalClasses: number;
  totalAttended: number;
  isSafe: boolean;
  subjectStats: SubjectAttendanceStats[];
} {
  const subjectStats = subjects.map(s => calculateSubjectAttendance(s, records, goalPercentage));
  const totalClasses = subjectStats.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const totalAttended = subjectStats.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallPercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 1000) / 10 : 100;

  return {
    overallPercentage,
    totalClasses,
    totalAttended,
    isSafe: overallPercentage >= goalPercentage,
    subjectStats
  };
}

export function percentageToGrade(pct: number): { letter: string; gpaPoint: number } {
  if (pct >= 93) return { letter: 'A', gpaPoint: 4.0 };
  if (pct >= 90) return { letter: 'A-', gpaPoint: 3.7 };
  if (pct >= 87) return { letter: 'B+', gpaPoint: 3.3 };
  if (pct >= 83) return { letter: 'B', gpaPoint: 3.0 };
  if (pct >= 80) return { letter: 'B-', gpaPoint: 2.7 };
  if (pct >= 77) return { letter: 'C+', gpaPoint: 2.3 };
  if (pct >= 73) return { letter: 'C', gpaPoint: 2.0 };
  if (pct >= 70) return { letter: 'C-', gpaPoint: 1.7 };
  if (pct >= 65) return { letter: 'D', gpaPoint: 1.0 };
  return { letter: 'F', gpaPoint: 0.0 };
}

export function calculateCourseGrades(
  subjects: Subject[],
  assessments: AssessmentGrade[]
): {
  courseSummaries: CourseGradeSummary[];
  semesterGpa: number;
  totalCredits: number;
  averagePercentage: number;
} {
  let totalWeightedPoints = 0;
  let totalCredits = 0;
  let totalPctSum = 0;

  const courseSummaries: CourseGradeSummary[] = subjects.map(subject => {
    const items = assessments.filter(a => a.subjectId === subject.id);
    let currentPercentage = 85; // baseline fallback if no assessment yet

    if (items.length > 0) {
      let totalWeightedScore = 0;
      let totalWeight = 0;
      items.forEach(item => {
        const itemPct = (item.score / item.maxScore) * 100;
        totalWeightedScore += itemPct * item.weightPercentage;
        totalWeight += item.weightPercentage;
      });

      if (totalWeight > 0) {
        currentPercentage = Math.round((totalWeightedScore / totalWeight) * 10) / 10;
      }
    }

    const { letter, gpaPoint } = percentageToGrade(currentPercentage);
    totalWeightedPoints += gpaPoint * subject.credits;
    totalCredits += subject.credits;
    totalPctSum += currentPercentage;

    return {
      subject,
      assessments: items,
      currentPercentage,
      letterGrade: letter,
      gradePoint: gpaPoint
    };
  });

  const semesterGpa = totalCredits > 0 ? Math.round((totalWeightedPoints / totalCredits) * 100) / 100 : 4.0;
  const averagePercentage = subjects.length > 0 ? Math.round((totalPctSum / subjects.length) * 10) / 10 : 0;

  return {
    courseSummaries,
    semesterGpa,
    totalCredits,
    averagePercentage
  };
}

export function formatDeadlineCountdown(dueDateString: string): {
  text: string;
  isUrgent: boolean;
  isOverdue: boolean;
  daysDiff: number;
} {
  const now = new Date();
  const due = new Date(dueDateString);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      text: overdueDays === 0 ? 'Overdue today' : `Overdue by ${overdueDays}d`,
      isUrgent: true,
      isOverdue: true,
      daysDiff: diffDays
    };
  }

  if (diffHours <= 12) {
    return {
      text: `Due in ${Math.max(1, diffHours)} hrs`,
      isUrgent: true,
      isOverdue: false,
      daysDiff: 0
    };
  }

  if (diffDays === 1) {
    return {
      text: 'Due tomorrow',
      isUrgent: true,
      isOverdue: false,
      daysDiff: 1
    };
  }

  return {
    text: `Due in ${diffDays} days`,
    isUrgent: diffDays <= 3,
    isOverdue: false,
    daysDiff: diffDays
  };
}
