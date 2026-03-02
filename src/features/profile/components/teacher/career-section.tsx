import { FrontendTeacherCareerList } from '@/entities/teacher';
import { CareerDropdown } from '@/features/mypage/components/career-dropdown';

export default function CareerSection({
  careers,
  isOwner = false,
}: {
  careers: FrontendTeacherCareerList;
  isOwner?: boolean;
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
          {isOwner && <CareerDropdown career={career} />}
        </div>
      ))}
    </>
  );
}
