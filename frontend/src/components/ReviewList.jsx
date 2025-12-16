export default function ReviewList({ assignments, onStatusChange, onDownload }) {
  const getStatusBadge = (status) => {
    const statusMap = {
      submitted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'ส่งแล้ว' },
      grading: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'กำลังตรวจ' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'ตรวจเสร็จ' }
    };
    const style = statusMap[status] || statusMap.submitted;
    return (
      <span className={`apple-badge ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ไม่มีงานที่รอตรวจ
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="apple-card p-4 border-l-4 border-l-blue-500">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div>
              <p className="text-xs text-gray-600 mb-1">นักเรียน</p>
              <p className="font-semibold text-gray-900">{assignment.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">ไฟล์</p>
              <p className="text-gray-900 truncate">{assignment.fileName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">วันที่ส่ง</p>
              <p className="text-gray-700 text-sm">{formatDate(assignment.submittedAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">สถานะ</p>
              {getStatusBadge(assignment.status)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onDownload(assignment.id, assignment.fileName)}
                className="apple-btn-primary text-xs py-2 px-3 flex-1"
              >
                ดาวน์โหลด
              </button>
              <select
                value={assignment.status}
                onChange={(e) => onStatusChange(assignment.id, e.target.value)}
                className="apple-select text-xs py-2 flex-1"
              >
                <option value="submitted">ส่งแล้ว</option>
                <option value="grading">กำลังตรวจ</option>
                <option value="completed">ตรวจเสร็จ</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
