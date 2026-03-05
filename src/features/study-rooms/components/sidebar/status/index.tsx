export const StudyStats = ({
  numberOfTeachingNote,
  numberOfStudents,
  numberOfQuestion,
}: {
  numberOfTeachingNote?: number;
  numberOfStudents?: number;
  numberOfQuestion?: number;
}) => {
  return (
    <ul className="flex items-center justify-between px-3 py-4">
      <li
        key={'studyNote'}
        className="flex flex-col items-center gap-1"
      >
        <p className="font-headline2-heading text-gray-12 text-center">
          {numberOfTeachingNote != null ? `${numberOfTeachingNote}장` : '0장'}
        </p>
        <p className="text-gray-scale-gray-60 font-label-normal text-center">
          수업노트
        </p>
      </li>
      <div className="bg-gray-3 w-px self-stretch" />

      <li
        key={'student'}
        className="flex flex-col items-center gap-1"
      >
        <p className="font-headline2-heading text-gray-12 text-center">
          {numberOfStudents != null ? `${numberOfStudents}명` : '0명'}
        </p>
        <p className="text-gray-scale-gray-60 font-label-normal text-center">
          학생
        </p>
      </li>
      <div className="bg-gray-3 w-px self-stretch" />

      <li
        key={'question'}
        className="flex flex-col items-center gap-1"
      >
        <p className="font-headline2-heading text-gray-12 text-center">
          {numberOfQuestion != null ? `${numberOfQuestion}개` : '0개'}
        </p>
        <p className="text-gray-scale-gray-60 font-label-normal text-center">
          질문
        </p>
      </li>
    </ul>
  );
};

export const StudyIntro = ({ description }: { description?: string }) => {
  if (!description) return null;

  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-body1-heading">소개</h4>
      <p className="font-body2-normal text-text-sub2 whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
};
