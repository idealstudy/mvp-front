import Image from 'next/image';
import Link from 'next/link';

type NextChallengeCardProps = {
  id: string;
  subject: string;
  title: string;
  passRate: number;
  participantCount: number;
  questionImageUrl: string | null;
};

export const NextChallengeCard = ({
  id,
  subject,
  title,
  passRate,
  participantCount,
  questionImageUrl,
}: NextChallengeCardProps) => {
  return (
    <div className="border-line-line1 flex flex-col gap-4 rounded-xl border bg-white p-6">
      <h3 className="font-body1-heading text-text-main">다음 문제 풀기</h3>

      <div className="border-line-line1 flex gap-3 rounded-lg border p-3">
        {questionImageUrl && (
          <div className="bg-orange-1 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md">
            <Image
              src={questionImageUrl}
              alt={title}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="flex min-w-0 flex-col justify-center gap-1">
          <p className="text-orange-7 text-xs font-semibold">{subject}</p>
          <p className="font-body2-heading text-text-main truncate text-sm">
            {title}
          </p>
          <p className="text-gray-7 text-xs">
            통과율 {passRate}% · {participantCount.toLocaleString()}명 도전 중
          </p>
        </div>
      </div>

      <Link
        href={`/open-challenge/${id}`}
        className="bg-orange-7 block w-full rounded-lg py-3 text-center font-semibold text-white transition-opacity hover:opacity-90"
      >
        다음 문제 풀기 →
      </Link>
    </div>
  );
};
