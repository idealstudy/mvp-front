const ACTIVITY_SUMMARY_META = [
  {
    key: 'studyRoomCount',
    label: '운영중인 스터디룸',
    unit: '개',
  },
  {
    key: 'teachingNoteCount',
    label: '수업노트',
    unit: '개',
  },
  {
    key: 'studentCount',
    label: '누적 학생 수',
    unit: '명',
  },
  {
    key: 'reviewCount',
    label: '후기 수',
    unit: '개',
  },
  {
    key: 'qnaCount',
    label: '질문 답변 수',
    unit: '개',
  },
] as const satisfies {
  key: keyof ActivitySummary;
  label: string;
  unit: string;
}[];

type ActivitySummary = {
  studyRoomCount: number;
  teachingNoteCount: number;
  studentCount: number;
  reviewCount: number;
  qnaCount: number;
};

export default function ActivitySummarySection({
  summary,
}: {
  summary: ActivitySummary;
}) {
  const summaryList = ACTIVITY_SUMMARY_META.map((meta) => ({
    ...meta,
    value: summary[meta.key],
  }));

  return (
    <div className="flex justify-between py-4">
      {summaryList.map((summary) => (
        <div
          key={summary.key}
          className="space-y-2 p-1"
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
