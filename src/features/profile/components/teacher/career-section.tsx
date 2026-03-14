import {
  FrontendTeacherCareerList,
  FrontendTeacherCareerListItem,
} from '@/entities/teacher';

export default function CareerSection({
  careers,
  renderAction,
}: {
  careers: FrontendTeacherCareerList;
  renderAction?: (career: FrontendTeacherCareerListItem) => React.ReactNode;
}) {
  return (
    <>
      {careers.map((career) => (
        <div
          key={career.id}
          className="flex items-center justify-between"
        >
          <div className="px-4 py-3">
            <div className="mb-1 flex items-baseline gap-1">
              <span className="font-body2-heading">{career.name}</span>
              <span className="font-caption-normal text-text-sub2">
                {career.startDate} ~{' '}
                {career.current ? '진행 중' : career.endDate}
              </span>
            </div>
            <ul>
              <li className="whitespace-pre-wrap">{career.description}</li>
            </ul>
          </div>
          {renderAction?.(career)}
        </div>
      ))}
    </>
  );
}
