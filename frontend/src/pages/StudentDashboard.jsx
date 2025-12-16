import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignmentAPI } from '../api/client';
import SubmitAssignment from '../components/SubmitAssignment';
import SubmissionsList from '../components/SubmissionsList';

export default function StudentDashboard({ user, onLogout }) {
  const [teachers, setTeachers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teachersRes, submissionsRes] = await Promise.all([
        assignmentAPI.getTeachers(),
        assignmentAPI.getMySubmissions()
      ]);
      setTeachers(teachersRes.data);
      setSubmissions(submissionsRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (teacherId, fileName, fileData) => {
    try {
      await assignmentAPI.submitAssignment(teacherId, fileName, fileData);
      setShowSubmitForm(false);
      loadData();
    } catch (err) {
      console.error('Failed to submit:', err);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="apple-header">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ระบบส่งงาน - นักเรียน</h1>
            <p className="text-gray-600 text-sm">ยินดีต้อนรับ {user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="apple-btn-danger"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submit Section */}
          <div className="lg:col-span-1">
            <div className="apple-card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">ส่งงาน</h2>
              {!showSubmitForm ? (
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="apple-btn-primary w-full"
                >
                  + ส่งงานใหม่
                </button>
              ) : (
                <SubmitAssignment
                  teachers={teachers}
                  onSubmit={handleSubmit}
                  onCancel={() => setShowSubmitForm(false)}
                />
              )}
            </div>
          </div>

          {/* Submissions List */}
          <div className="lg:col-span-2">
            <div className="apple-card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                งานที่ส่งแล้ว ({submissions.length})
              </h2>
              <SubmissionsList submissions={submissions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
