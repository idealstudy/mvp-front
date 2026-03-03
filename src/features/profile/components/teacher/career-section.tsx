export default function CareerSection() {
  const experiences = [
    {
      id: 1,
      title: '00학원 전임 강사',
      startDate: '2021-01-01',
      endDate: null,
      summary: '중고등학생 수학 담당',
    },
  ];

  return (
    <>
      {experiences.map((experience) => (
        <div
          key={experience.id}
          className="px-4 py-3"
        >
          <div className="mb-1 flex items-baseline gap-1">
            <span className="font-body2-heading">{experience.title}</span>
            <span className="font-caption-normal text-text-sub2">
              {experience.startDate} ~ {experience.endDate ?? '진행 중'}
            </span>
          </div>
          <ul>
            <li className="">- {experience.summary}</li>
          </ul>
        </div>
      ))}
    </>
  );
}
