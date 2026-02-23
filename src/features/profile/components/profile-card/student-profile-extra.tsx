interface StudentProfileExtraProps {
  learningGoal: string;
}

export default function StudentProfileExtra({
  learningGoal,
}: StudentProfileExtraProps) {
  return (
    <>
      <div>
        <h4 className="font-body1-heading mb-2">학습 목표</h4>
        <p className="break-words">{learningGoal}</p>
      </div>

      {/* <div>
        <h4 className="font-body1-heading mb-2">보호자</h4>
        <p>(보호자목록)</p>
      </div> */}
    </>
  );
}
