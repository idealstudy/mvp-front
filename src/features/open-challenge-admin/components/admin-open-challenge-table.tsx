'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import {
  type AdminChallengeDifficulty,
  type ChallengeListParams,
  type ChallengeSubject,
} from '@/entities/open-challenge';
import { MiniSpinner } from '@/shared/components/loading';
import { Button, Input, Select } from '@/shared/components/ui';
import { PRIVATE, PUBLIC } from '@/shared/constants';
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';

import {
  useAdminOpenChallengeListQuery,
  useDeleteAdminOpenChallengeMutation,
  useHideAdminOpenChallengeMutation,
  useShowAdminOpenChallengeMutation,
} from '../hooks/use-admin-open-challenge';

type SubjectFilter = ChallengeSubject | 'ALL';
type DifficultyFilter = AdminChallengeDifficulty | 'ALL';
type SortFilter = NonNullable<ChallengeListParams['sort']>;

const PAGE_SIZE = 10;

const SUBJECT_OPTIONS: Array<{ value: SubjectFilter; label: string }> = [
  { value: 'ALL', label: '전체 과목' },
  { value: 'MATH', label: '수학' },
  { value: 'KOREAN', label: '국어' },
  { value: 'ENGLISH', label: '영어' },
  { value: 'SCIENCE', label: '탐구' },
];

const DIFFICULTY_OPTIONS: Array<{ value: DifficultyFilter; label: string }> = [
  { value: 'ALL', label: '전체 난이도' },
  { value: 'TOP', label: '최상' },
  { value: 'HIGH', label: '상' },
  { value: 'MID', label: '중' },
  { value: 'LOW', label: '하' },
];

const SORT_OPTIONS: Array<{ value: SortFilter; label: string }> = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
];

const SUBJECT_LABEL: Record<ChallengeSubject, string> = {
  MATH: '수학',
  KOREAN: '국어',
  ENGLISH: '영어',
  SCIENCE: '탐구',
};

const toListDifficulty = (
  difficulty: DifficultyFilter
): ChallengeListParams['difficulty'] => {
  if (difficulty === 'ALL') return 'ALL';
  if (difficulty === 'TOP') return 'highest';
  if (difficulty === 'HIGH') return 'high';
  if (difficulty === 'LOW') return 'low';
  return 'middle';
};

export const AdminOpenChallengeTable = () => {
  const [page, setPage] = useState(0);
  const [subject, setSubject] = useState<SubjectFilter>('ALL');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('ALL');
  const [sort, setSort] = useState<SortFilter>('latest');
  const [showTargetId, setShowTargetId] = useState('');

  const { data, isLoading } = useAdminOpenChallengeListQuery({
    page,
    size: PAGE_SIZE,
    subject,
    difficulty: toListDifficulty(difficulty),
    sort,
  });
  const hideMutation = useHideAdminOpenChallengeMutation();
  const showMutation = useShowAdminOpenChallengeMutation();
  const deleteMutation = useDeleteAdminOpenChallengeMutation();

  const challenges = data?.content ?? [];

  useEffect(() => {
    setPage(0);
  }, [subject, difficulty, sort]);

  const handleShowHiddenChallenge = () => {
    const id = showTargetId.trim();
    if (!id) return;
    showMutation.mutate(id, {
      onSuccess: () => setShowTargetId(''),
    });
  };

  if (isLoading) return <MiniSpinner />;

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-body1-heading text-text-main">
              게시 중인 문제 목록
            </h2>
            <p className="text-gray-8 mt-1 text-sm">
              현재 백엔드 조회 API는 공개 문제만 반환합니다.
            </p>
          </div>
          <Button
            asChild
            size="small"
          >
            <Link href={PRIVATE.ADMIN.OPEN_CHALLENGE.NEW}>
              <Plus
                size={16}
                className="mr-1"
              />
              문제 등록
            </Link>
          </Button>
        </div>

        <div className="border-line-line2 grid gap-3 rounded-md border bg-white p-4 md:grid-cols-3">
          <Select
            value={subject}
            onValueChange={(value) => setSubject(value as SubjectFilter)}
          >
            <Select.Trigger placeholder="과목" />
            <Select.Content>
              {SUBJECT_OPTIONS.map((option) => (
                <Select.Option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Select.Option>
              ))}
            </Select.Content>
          </Select>

          <Select
            value={difficulty}
            onValueChange={(value) => setDifficulty(value as DifficultyFilter)}
          >
            <Select.Trigger placeholder="난이도" />
            <Select.Content>
              {DIFFICULTY_OPTIONS.map((option) => (
                <Select.Option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Select.Option>
              ))}
            </Select.Content>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as SortFilter)}
          >
            <Select.Trigger placeholder="정렬" />
            <Select.Content>
              {SORT_OPTIONS.map((option) => (
                <Select.Option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Select.Option>
              ))}
            </Select.Content>
          </Select>
        </div>

        <div className="border-line-line2 overflow-hidden rounded-md border bg-white">
          <table className="w-full min-w-[920px]">
            <thead className="border-line-line2 bg-gray-1 border-b text-left">
              <tr className="*:px-5 *:py-4">
                <th>문제</th>
                <th>과목</th>
                <th>통계</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody className="divide-line-line1 divide-y">
              {challenges.map((challenge) => (
                <tr
                  key={challenge.id}
                  className="hover:bg-gray-1"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={PUBLIC.OPEN_CHALLENGE.DETAIL(challenge.id)}
                      className="font-body2-heading hover:underline"
                    >
                      {challenge.title}
                    </Link>
                    <p className="text-gray-8 mt-1 text-sm">
                      {challenge.sourceText}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    {SUBJECT_LABEL[challenge.subject]}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm">통과율 {challenge.passRate}%</p>
                    <p className="text-gray-8 text-sm">
                      {challenge.participantCount.toLocaleString()}명 참여
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-system-success-alt text-system-success rounded-md px-2.5 py-1 text-sm">
                      게시
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        asChild
                        variant="outlined"
                        size="xsmall"
                      >
                        <Link
                          href={PRIVATE.ADMIN.OPEN_CHALLENGE.EDIT(challenge.id)}
                        >
                          <Pencil
                            size={14}
                            className="mr-1"
                          />
                          수정
                        </Link>
                      </Button>
                      <Button
                        variant="outlined"
                        size="xsmall"
                        onClick={() => hideMutation.mutate(challenge.id)}
                        disabled={hideMutation.isPending}
                      >
                        <EyeOff
                          size={14}
                          className="mr-1"
                        />
                        비노출
                      </Button>
                      <Button
                        variant="secondary"
                        size="xsmall"
                        onClick={() => {
                          if (window.confirm('이 문제를 삭제할까요?')) {
                            deleteMutation.mutate(challenge.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2
                          size={14}
                          className="mr-1"
                        />
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {challenges.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-gray-8 px-5 py-12 text-center"
                  >
                    조건에 맞는 게시 문제가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outlined"
            size="xsmall"
            disabled={page === 0}
            onClick={() => setPage((previousPage) => previousPage - 1)}
          >
            이전
          </Button>
          <span className="text-gray-8 px-3 text-sm">{page + 1}페이지</span>
          <Button
            variant="outlined"
            size="xsmall"
            disabled={!data?.hasNext}
            onClick={() => setPage((previousPage) => previousPage + 1)}
          >
            다음
          </Button>
        </div>
      </section>

      <section className="border-line-line2 rounded-md border bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-body1-heading text-text-main">
              비노출 문제 노출 재개
            </h2>
            <p className="text-gray-8 mt-1 text-sm">
              숨김 문제는 공개 목록에 표시되지 않아 ID로 직접 노출 재개합니다.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-[420px]">
            <Input
              value={showTargetId}
              onChange={(event) => setShowTargetId(event.target.value)}
              placeholder="challengeId"
            />
            <Button
              type="button"
              size="small"
              onClick={handleShowHiddenChallenge}
              disabled={
                showMutation.isPending || showTargetId.trim().length === 0
              }
            >
              <Eye
                size={16}
                className="mr-1"
              />
              노출
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
