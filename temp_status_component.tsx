import { useState } from 'react';

import { Icon } from '@/components/ui/icon';

export const StudyStats = () => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const studyIcons = [
    {
      name: '수업노트',
      icon: Icon.Notebook,
      count: '999장',
    },
    {
      name: '학생',
      icon: Icon.Person,
      count: '999명',
    },
    {
      name: '질문',
      icon: Icon.Question,
      count: '999개',
    },
  ];

  return (
    <div className="flex items-center justify-between px-3 py-4">
      {studyIcons.map((icon) => (
        <li
          key={icon.name}
          className="flex cursor-pointer flex-col items-center gap-1"
          onClick={() => setSelectedIcon(icon.name)}
        >
          <icon.icon
            className={`mb-1 ${
              selectedIcon === icon.name
                ? 'text-key-color-primary'
                : 'text-gray-scale-gray-60'
            }`}
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
