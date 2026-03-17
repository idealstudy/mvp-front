import { FrontendStudentReport } from '@/entities/student';

const ACTIVITY_REPORT_META = [
  {
    key: 'studyRoomCount',
    label: '참여중인 스터디룸',
    unit: '개',
  },
  {
    key: 'questionCount',
    label: '질문 수',
    unit: '개',
  },
  {
    key: 'homeworkCompletionRate',
    label: '과제 수행률',
    unit: '%',
    format: (v: number) => Math.round(v * 100),
  },
] satisfies {
  key: keyof FrontendStudentReport;
  label: string;
  unit: string;
  format?: (v: number) => number;
}[];

export default function ActivityReportSection({
  report,
}: {
  report: FrontendStudentReport;
}) {
  const reportList = ACTIVITY_REPORT_META.map((meta) => ({
    ...meta,
    value: meta.format ? meta.format(report[meta.key]) : report[meta.key],
  }));

  return (
    <div className="flex justify-between">
      {reportList.map((report) => (
        <div
          key={report.key}
          className="space-y-2 p-1"
        >
          <div className="text-key-color-primary flex items-baseline justify-center gap-1">
            <span className="font-title-heading">{report.value}</span>
            <span className="font-body2-heading">{report.unit}</span>
          </div>
          <p className="font-body2-normal">{report.label}</p>
        </div>
      ))}
    </div>
  );
}
