import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignmentAPI } from '../api/client';
import ReviewList from '../components/ReviewList';

export default function TeacherDashboard({ user, onLogout }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await assignmentAPI.getToReview();
      setAssignments(response.data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (assignmentId, newStatus) => {
    try {
      await assignmentAPI.updateStatus(assignmentId, newStatus);
      loadAssignments();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDownload = async (assignmentId, fileName) => {
    try {
      const response = await assignmentAPI.downloadFile(assignmentId);
      const { fileData } = response.data;
      
      // Create download link
      const link = document.createElement('a');
      link.href = fileData;
      link.download = fileName;
      link.click();
    } catch (err) {
      console.error('Failed to download:', err);
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
            <h1 className="text-2xl font-bold text-gray-900">ระบบส่งงาน - ครู</h1>
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
        <div className="apple-card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            งานที่รอตรวจ ({assignments.length})
          </h2>
          <ReviewList
            assignments={assignments}
            onStatusChange={handleStatusChange}
            onDownload={handleDownload}
          />
        </div>
      </main>
    </div>
  );
}
