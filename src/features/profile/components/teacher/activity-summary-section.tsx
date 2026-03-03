const ACTIVITY_SUMMARY_META = [
  {
    key: 'studyroom',
    label: '운영중인 스터디룸',
    unit: '개',
  },
  {
    key: 'note',
    label: '수업노트',
    unit: '개',
  },
  {
    key: 'student',
    label: '누적 학생 수',
    unit: '명',
  },
  {
    key: 'review',
    label: '후기 수',
    unit: '개',
  },
  {
    key: 'qna',
    label: '질문 답변 수',
    unit: '개',
  },
];

export default function ActivitySummarySection() {
  const summaryList = ACTIVITY_SUMMARY_META.map((meta) => ({
    ...meta,
    value: 0,
  }));

  return (
    <div className="flex justify-between">
      {summaryList.map((summary) => (
        <div
          key={summary.key}
          className="p-1"
        >
          <div className="text-key-color-primary flex items-baseline justify-center gap-1">
            <span className="font-title-heading">{summary.value}</span>
            <span className="font-body2-heading">{summary.unit}</span>
          </div>
          <p className="font-body2-normal">{summary.label}</p>
        </div>
      ))}
    </div>
  );
}
