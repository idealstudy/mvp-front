import { StudyConsulation } from '@/features/dashboard/components/study-consulation';

const mockStudentData = [
  {
    studentId: 101,
    studentName: '김학생',
    studyRooms: [
      {
        studyRoomId: 1001,
        studyRoomName: '스터디룸',
      },
    ],
  },
  {
    studentId: 102,
    studentName: '이학생',
    studyRooms: [
      {
        studyRoomId: 2001,
        studyRoomName: '스터디룸',
      },
      {
        studyRoomId: 2002,
        studyRoomName: '스터디룸2',
      },
    ],
  },
];

export default function StudyConsulationPage() {
  return <StudyConsulation data={mockStudentData} />;
}
