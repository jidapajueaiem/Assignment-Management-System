export default function SubmissionsList({ submissions }) {
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

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ยังไม่มีการส่งงาน
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <div key={submission.id} className="apple-card p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-gray-900">{submission.fileName}</p>
              <p className="text-sm text-gray-600">ครู: {submission.teacherName}</p>
            </div>
            {getStatusBadge(submission.status)}
          </div>
          <p className="text-xs text-gray-500">
            ส่งเมื่อ: {formatDate(submission.submittedAt)}
          </p>
        </div>
      ))}
    </div>
  );
}
