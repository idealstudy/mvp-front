'use client';

import { type ReactNode, useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  type AdminChallengeDetail,
  type AdminChallengeDifficulty,
  type AdminChallengePayload,
  type AdminChallengeSubject,
} from '@/entities/open-challenge';
import { Button, Input, Select, Textarea } from '@/shared/components/ui';
import { PRIVATE, PUBLIC } from '@/shared/constants';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { classifyOpenChallengeError } from '@/shared/lib/errors/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Minus, Plus, Save } from 'lucide-react';

import {
  useCreateAdminOpenChallengeMutation,
  useUpdateAdminOpenChallengeMutation,
} from '../hooks/use-admin-open-challenge';
import {
  type AdminChallengeForm,
  AdminChallengeFormSchema,
} from '../schema/schema';

type AdminOpenChallengeFormProps = {
  challenge?: AdminChallengeDetail;
};

const SUBJECT_OPTIONS: Array<{ value: AdminChallengeSubject; label: string }> =
  [{ value: 'MATH', label: '수학' }];

const DIFFICULTY_OPTIONS: Array<{
  value: AdminChallengeDifficulty;
  label: string;
}> = [
  { value: 'TOP', label: '최상' },
  { value: 'HIGH', label: '상' },
  { value: 'MID', label: '중' },
  { value: 'LOW', label: '하' },
];

const ERROR_REDIRECT_DELAY_MS = 1500;
const CHOICE_LABELS = ['①', '②', '③', '④', '⑤'] as const;
const CHOICE_LABEL_PATTERN = /^[①②③④⑤]\s*/;

const DEFAULT_VALUES: AdminChallengeForm = {
  subject: 'MATH',
  difficulty: 'MID',
  wrongAnswerRate: 0,
  title: '',
  sourceText: '',
  questionText: '',
  questionMediaId: '',
  choices: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
  correctChoiceIndex: 0,
  type: '',
};

const stripChoiceLabel = (value: string) =>
  value.replace(CHOICE_LABEL_PATTERN, '').trim();

const findCorrectChoiceIndex = (choices: string[], correctAnswer: string) => {
  const normalizedCorrectAnswer = stripChoiceLabel(correctAnswer);
  const index = choices.findIndex(
    (choice) => stripChoiceLabel(choice) === normalizedCorrectAnswer
  );

  return index >= 0 ? index : 0;
};

const toFormValues = (challenge?: AdminChallengeDetail): AdminChallengeForm => {
  if (!challenge) return DEFAULT_VALUES;

  return {
    subject: challenge.subject,
    difficulty: challenge.difficulty,
    wrongAnswerRate: challenge.wrongAnswerRate,
    title: challenge.title,
    sourceText: challenge.sourceText,
    questionText: challenge.questionText,
    questionMediaId: '',
    choices: challenge.choices.map((choice) => ({
      value: stripChoiceLabel(choice),
    })),
    correctChoiceIndex: findCorrectChoiceIndex(
      challenge.choices,
      challenge.correctAnswer
    ),
    type: challenge.type,
  };
};

const toPayload = (data: AdminChallengeForm): AdminChallengePayload => {
  const choices = data.choices
    .map((choice) => choice.value.trim())
    .filter(Boolean);

  return {
    subject: data.subject,
    difficulty: data.difficulty,
    wrongAnswerRate: data.wrongAnswerRate,
    title: data.title.trim(),
    sourceText: data.sourceText.trim(),
    questionText: data.questionText.trim() || null,
    questionMediaId: data.questionMediaId.trim() || null,
    choices,
    correctAnswer: choices[data.correctChoiceIndex] ?? '',
    type: data.type.trim() || null,
  };
};

export const AdminOpenChallengeForm = ({
  challenge,
}: AdminOpenChallengeFormProps) => {
  const router = useRouter();
  const isEditMode = !!challenge;
  const createMutation = useCreateAdminOpenChallengeMutation();
  const updateMutation = useUpdateAdminOpenChallengeMutation(
    challenge?.id ?? ''
  );
  const mutation = isEditMode ? updateMutation : createMutation;

  const {
    control,
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<AdminChallengeForm>({
    resolver: zodResolver(AdminChallengeFormSchema),
    defaultValues: toFormValues(challenge),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'choices',
  });
  const selectedCorrectIndex = watch('correctChoiceIndex');
  const choices = watch('choices');
  const selectedCorrectAnswer =
    choices?.[selectedCorrectIndex]?.value?.trim() ?? '';

  useEffect(() => {
    reset(toFormValues(challenge));
  }, [challenge, reset]);

  const handleRemoveChoice = (index: number) => {
    remove(index);
    if (selectedCorrectIndex === index) {
      setValue('correctChoiceIndex', 0, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    if (selectedCorrectIndex > index) {
      setValue('correctChoiceIndex', selectedCorrectIndex - 1, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const onSubmit = (data: AdminChallengeForm) => {
    mutation.mutate(toPayload(data), {
      onSuccess: (createdId) => {
        router.replace(
          isEditMode
            ? PRIVATE.ADMIN.OPEN_CHALLENGE.LIST
            : PUBLIC.OPEN_CHALLENGE.DETAIL(createdId as string)
        );
      },
      onError: (error) => {
        handleApiError(error, classifyOpenChallengeError, {
          onField: (message) => setError('root', { message }),
          onContext: () =>
            setTimeout(
              () => router.replace(PRIVATE.ADMIN.OPEN_CHALLENGE.LIST),
              ERROR_REDIRECT_DELAY_MS
            ),
          onAuth: () =>
            setTimeout(
              () => router.replace(PUBLIC.CORE.LOGIN),
              ERROR_REDIRECT_DELAY_MS
            ),
        });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-title-heading text-2xl leading-[135%] tracking-tight lg:text-3xl">
            {isEditMode ? '오픈챌린지 문제 수정' : '오픈챌린지 문제 등록'}
          </h1>
          <p className="text-gray-8 mt-2 text-sm">
            공개 목록 조회 API 기준으로 등록된 문제를 관리합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={() => router.push(PRIVATE.ADMIN.OPEN_CHALLENGE.LIST)}
          >
            <ArrowLeft
              size={16}
              className="mr-1"
            />
            목록
          </Button>
          <Button
            type="submit"
            size="small"
            disabled={mutation.isPending || (isEditMode && !isDirty)}
          >
            <Save
              size={16}
              className="mr-1"
            />
            {mutation.isPending ? '저장 중' : '저장'}
          </Button>
        </div>
      </div>

      {errors.root?.message && (
        <p className="border-system-warning bg-system-warning-alt text-system-warning rounded-lg border px-4 py-3 text-sm">
          {errors.root.message}
        </p>
      )}

      <section className="border-line-line2 grid gap-5 rounded-md border bg-white p-5 lg:grid-cols-2">
        <Field label="과목">
          <Controller
            control={control}
            name="subject"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <Select.Trigger placeholder="과목 선택" />
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
            )}
          />
        </Field>

        <Field label="난이도">
          <Controller
            control={control}
            name="difficulty"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <Select.Trigger placeholder="난이도 선택" />
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
            )}
          />
        </Field>

        <Field
          label="관리용 제목"
          error={errors.title?.message}
        >
          <Input
            {...register('title')}
            placeholder="예: 2025 6월 평가원 25번"
            aria-invalid={!!errors.title}
          />
        </Field>

        <Field
          label="출처"
          error={errors.sourceText?.message}
        >
          <Input
            {...register('sourceText')}
            placeholder="예: 2025 6월 평가원"
            aria-invalid={!!errors.sourceText}
          />
        </Field>

        <Field
          label="오답률"
          error={errors.wrongAnswerRate?.message}
        >
          <Input
            {...register('wrongAnswerRate')}
            type="number"
            min={0}
            max={100}
            aria-invalid={!!errors.wrongAnswerRate}
          />
        </Field>

        <Field label="문제 유형">
          <Input
            {...register('type')}
            placeholder="선택 입력"
          />
        </Field>
      </section>

      <section className="border-line-line2 grid gap-5 rounded-md border bg-white p-5">
        <Field
          label="문제 본문"
          error={errors.questionText?.message}
        >
          <Textarea
            {...register('questionText')}
            rows={5}
            placeholder="텍스트형 문제 본문을 입력하거나 이미지 mediaId를 입력하세요."
          />
        </Field>

        <Field label="문제 이미지 mediaId">
          <Input
            {...register('questionMediaId')}
            placeholder="Presigned 업로드 후 발급된 mediaId"
          />
        </Field>

        {challenge?.questionImageUrl && (
          <div className="border-line-line1 bg-gray-1 rounded-md border p-4">
            <p className="text-gray-8 mb-2 text-sm">현재 문제 이미지</p>
            <Image
              src={challenge.questionImageUrl}
              alt="현재 문제 이미지"
              width={640}
              height={360}
              unoptimized
              className="max-h-[240px] rounded-md bg-white object-contain"
            />
          </div>
        )}
      </section>

      <section className="border-line-line2 grid gap-5 rounded-md border bg-white p-5 lg:grid-cols-[1fr_240px]">
        <Field
          label="선지"
          error={errors.choices?.message}
        >
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-start gap-2"
              >
                <div className="flex min-w-0 flex-1 items-center">
                  <span className="border-line-line2 bg-gray-1 text-gray-8 flex h-[56px] w-[52px] shrink-0 items-center justify-center rounded-l-[4px] border border-r-0 text-lg font-bold">
                    {CHOICE_LABELS[index]}
                  </span>
                  <Input
                    {...register(`choices.${index}.value`)}
                    placeholder="선지 내용을 입력해주세요."
                    aria-invalid={!!errors.choices?.[index]?.value}
                    className="rounded-l-none"
                  />
                </div>
                <Button
                  type="button"
                  variant={
                    selectedCorrectIndex === index ? 'primary' : 'outlined'
                  }
                  size="small"
                  className="h-[56px] w-[78px] shrink-0 px-0"
                  onClick={() =>
                    setValue('correctChoiceIndex', index, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  정답
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  className="h-[56px] w-[56px] shrink-0 px-0"
                  onClick={() => handleRemoveChoice(index)}
                  disabled={fields.length <= 1}
                  aria-label={`선지 ${index + 1} 삭제`}
                >
                  <Minus size={16} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outlined"
              size="small"
              className="w-fit"
              onClick={() => append({ value: '' })}
              disabled={fields.length >= 5}
            >
              <Plus
                size={16}
                className="mr-1"
              />
              선지 추가
            </Button>
          </div>
        </Field>

        <Field
          label="선택된 정답"
          error={errors.correctChoiceIndex?.message}
        >
          <div className="border-line-line2 bg-gray-1 flex min-h-[56px] flex-col justify-center rounded-[4px] border px-4">
            <p className="text-gray-8 text-xs">
              {CHOICE_LABELS[selectedCorrectIndex] ?? '-'}
            </p>
            <p className="text-text-main mt-1 text-sm font-semibold break-words">
              {selectedCorrectAnswer || '정답 선지를 선택해주세요.'}
            </p>
          </div>
        </Field>
      </section>
    </form>
  );
};

type FieldProps = {
  label: string;
  children: ReactNode;
  error?: string;
};

const Field = ({ label, children, error }: FieldProps) => (
  <label className="flex min-w-0 flex-col gap-2">
    <span className="font-body2-heading text-text-main text-sm">{label}</span>
    {children}
    {error && <span className="text-system-warning text-sm">{error}</span>}
  </label>
);
