import { dto } from '../infrastructure';

const StudentReportShape = dto.studentReport;

const StudentDashboardReportShape = dto.dashboard.report;
const StudentDashboardNoteListShape = dto.dashboard.noteList;
const StudentDashboardStudyRoomListShape = dto.dashboard.studyRoomList;
const StudentDashboardQnaListShape = dto.dashboard.QnaList;
const StudentDashboardHomeworkListShape = dto.dashboard.homeworkList;

export const studentDomain = {
  studentReport: StudentReportShape,
  dashboard: {
    report: StudentDashboardReportShape,
    noteList: StudentDashboardNoteListShape,
    studyRoomList: StudentDashboardStudyRoomListShape,
    QnaList: StudentDashboardQnaListShape,
    homeworkList: StudentDashboardHomeworkListShape,
  },
};
