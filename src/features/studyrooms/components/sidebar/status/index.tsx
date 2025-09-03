import Image from 'next/image';

export const StudyStats = () => {
  const studyIcons = [
    {
      name: '수업노트',
      icon: '/studyroom/notebook.png',
      count: '999장',
    },
    {
      name: '학생',
      icon: '/studyroom/person.png',
      count: '999명',
    },

    {
      name: '질문',
      icon: '/studyroom/question.png',
      count: '999개',
    },
  ];

  return (
    <div className="flex items-center justify-between px-3 py-4">
      {studyIcons.map((icon) => (
        <li
          key={icon.name}
          className="flex flex-col items-center gap-1"
        >
          <Image
            src={icon.icon}
            alt={icon.name}
            width={24}
            height={24}
            className="mb-1"
          />
          <p className="text-gray-scale-gray-60 font-label-normal text-center">
            {icon.name}
          </p>
          <p className="font-headline2-heading text-key-color-primary text-center">
            {icon.count}
          </p>
        </li>
      ))}
    </div>
  );
};
