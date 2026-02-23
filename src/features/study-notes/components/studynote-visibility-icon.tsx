import Image from 'next/image';

export default function StudyNoteVisibilityIcon({
  visibility,
}: {
  visibility: string;
}) {
  switch (visibility) {
    case 'PUBLIC':
      return (
        <Image
          src="/studynotes/read-global.svg"
          width={28}
          height={28}
          alt="study-notes"
          className="h-[28px] w-[28px] cursor-pointer"
        />
      );
    case 'SPECIFIC_STUDENTS_ONLY':
      return (
        <Image
          src="/studynotes/read-students.svg"
          width={28}
          height={28}
          alt="study-notes"
          className="h-[28px] w-[28px] cursor-pointer"
        />
      );
    case 'SPECIFIC_STUDENTS_AND_PARENTS':
      return (
        <Image
          src="/studynotes/read-students.svg"
          width={28}
          height={28}
          alt="study-notes"
          className="h-[28px] w-[28px] cursor-pointer"
        />
      );
    case 'STUDY_ROOM_STUDENTS_AND_PARENTS':
      return (
        <Image
          src="/studynotes/read-students.svg"
          width={28}
          height={28}
          alt="study-notes"
          className="h-[28px] w-[28px] cursor-pointer"
        />
      );
    case 'TEACHER_ONLY':
      return (
        <Image
          src="/studynotes/read-secret.svg"
          width={28}
          height={28}
          alt="study-notes"
          className="h-[28px] w-[28px] cursor-pointer"
        />
      );
    default:
      return null;
  }
}
