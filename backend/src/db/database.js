// In-memory database (for demo)
export const db = {
  users: [
    {
      id: 'teacher1',
      username: 'teacher1',
      password: 'teacher123', // In production: hash this
      name: 'ครูสมชาย',
      role: 'teacher',
      email: 'teacher1@school.com'
    },
    {
      id: 'teacher2',
      username: 'teacher2',
      password: 'teacher123',
      name: 'ครูสมหญิง',
      role: 'teacher',
      email: 'teacher2@school.com'
    },
    {
      id: 'student1',
      username: 'student1',
      password: 'student123',
      name: 'นักเรียนที่ 1',
      role: 'student',
      email: 'student1@school.com'
    },
    {
      id: 'student2',
      username: 'student2',
      password: 'student123',
      name: 'นักเรียนที่ 2',
      role: 'student',
      email: 'student2@school.com'
    }
  ],
  assignments: [
    {
      id: 'assign1',
      studentId: 'student1',
      teacherId: 'teacher1',
      fileName: 'homework.pdf',
      fileData: null,
      status: 'submitted', // submitted, grading, completed
      submittedAt: new Date(),
      gradedAt: null,
      grade: null
    }
  ]
};

export const findUserByUsername = (username) => {
  return db.users.find(u => u.username === username);
};

export const findUserById = (id) => {
  return db.users.find(u => u.id === id);
};

export const findTeachers = () => {
  return db.users.filter(u => u.role === 'teacher');
};

export const addAssignment = (assignment) => {
  db.assignments.push(assignment);
  return assignment;
};

export const getAssignmentsByStudent = (studentId) => {
  return db.assignments.filter(a => a.studentId === studentId);
};

export const getAssignmentsByTeacher = (teacherId) => {
  return db.assignments.filter(a => a.teacherId === teacherId);
};

export const updateAssignmentStatus = (assignmentId, status) => {
  const assignment = db.assignments.find(a => a.id === assignmentId);
  if (assignment) {
    assignment.status = status;
    assignment.gradedAt = new Date();
  }
  return assignment;
};
