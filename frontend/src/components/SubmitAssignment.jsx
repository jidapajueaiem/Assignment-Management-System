import { useState } from 'react';

export default function SubmitAssignment({ teachers, onSubmit, onCancel }) {
  const [teacherId, setTeacherId] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!teacherId || !file) {
      setError('Please select teacher and file');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        onSubmit(teacherId, file.name, event.target.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to read file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <label className="block text-gray-900 font-semibold mb-3 text-sm">
          เลือกครู
        </label>
        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="apple-select text-sm"
          required
        >
          <option value="">-- เลือกครู --</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <label className="block text-gray-900 font-semibold mb-3 text-sm">
          อัพโหลดไฟล์
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="apple-input text-sm"
          required
        />
        {file && (
          <p className="text-sm text-green-600 mt-2 font-medium">
            ✓ {file.name}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 apple-btn-primary text-sm"
        >
          {loading ? 'Submitting...' : 'ส่งงาน'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 apple-btn-secondary text-sm"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
