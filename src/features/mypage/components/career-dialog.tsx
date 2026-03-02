'use client';

import { Controller, useForm } from 'react-hook-form';

import {
  CareerPayload,
  FrontendTeacherCareerListItem,
} from '@/entities/teacher';
import {
  usePostTeacherCareer,
  useUpdateTeacherCareer,
} from '@/features/mypage/hooks/teacher/use-careers';
import { CareerForm, CareerFormSchema } from '@/features/mypage/schema/schema';
import {
  Button,
  Checkbox,
  Dialog,
  Form,
  Input,
  RequiredMark,
  Textarea,
} from '@/shared/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';

interface CareerDialogProps {
  career?: FrontendTeacherCareerListItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CareerDialog({
  career,
  isOpen,
  onOpenChange,
}: CareerDialogProps) {
  const isEditMode = !!career;

  const updateTeacherCareerMutation = useUpdateTeacherCareer();
  const postTeacherCareerMutation = usePostTeacherCareer();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<CareerForm>({
    resolver: zodResolver(CareerFormSchema),
    defaultValues: {
      name: career?.name || '',
      startDate: career?.startDate || '',
      endDate: career?.endDate || '',
      description: career?.description || '',
      isCurrent: career?.current || false,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: CareerForm) => {
    const payload: CareerPayload = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.isCurrent ? '' : new Date(data.endDate).toISOString(),
    };

    if (isEditMode) {
      await updateTeacherCareerMutation.mutateAsync({
        careerId: career.id,
        careerData: payload,
      });
    } else {
      await postTeacherCareerMutation.mutateAsync(payload);
    }

    reset();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <Dialog.Content className="flex h-150 max-w-200 flex-col gap-6">
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <Dialog.Header>
              <div className="max-desktop:flex-col flex items-center gap-2">
                <Dialog.Title>
                  {isEditMode ? '경력 수정하기' : '경력 추가하기'}
                </Dialog.Title>
              </div>
            </Dialog.Header>
            <Dialog.Body className="flex flex-col gap-3">
              <Form.Item error={!!errors.name}>
                <Form.Label>
                  경력명
                  <RequiredMark />
                </Form.Label>

                <Form.Control>
                  <Input
                    {...register('name')}
                    placeholder="경력명을 입력해 주세요."
                  />
                </Form.Control>
                {errors.name?.message && (
                  <Form.ErrorMessage>{errors.name.message}</Form.ErrorMessage>
                )}
              </Form.Item>

              <div className="flex gap-2">
                <Form.Item
                  error={!!errors.startDate}
                  className="flex-1"
                >
                  <Form.Label>
                    시작일
                    <RequiredMark />
                  </Form.Label>

                  <Form.Control>
                    <Input
                      {...register('startDate')}
                      type="date"
                    />
                  </Form.Control>
                  {errors.startDate?.message && (
                    <Form.ErrorMessage>
                      {errors.startDate.message}
                    </Form.ErrorMessage>
                  )}
                </Form.Item>

                <Form.Item
                  error={!!errors.endDate}
                  className="flex-1"
                >
                  <div className="flex items-center justify-between">
                    <Form.Label>
                      종료일
                      <RequiredMark />
                    </Form.Label>
                    <Controller
                      name="isCurrent"
                      control={control}
                      render={({ field }) => (
                        <label className="flex cursor-pointer items-center gap-2">
                          <span>진행 중</span>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </label>
                      )}
                    ></Controller>
                  </div>

                  <Form.Control>
                    <Input
                      {...register('endDate')}
                      type="date"
                      disabled={watch('isCurrent')}
                    />
                  </Form.Control>
                  {errors.endDate?.message && (
                    <Form.ErrorMessage>
                      {errors.endDate.message}
                    </Form.ErrorMessage>
                  )}
                </Form.Item>
              </div>

              <Form.Item>
                <Form.Label>경력 내용</Form.Label>
                <Form.Control>
                  <Textarea
                    {...register('description')}
                    rows={4}
                    className="resize-none"
                  />
                </Form.Control>
              </Form.Item>
            </Dialog.Body>
            <Dialog.Footer className="self-end">
              <div className="flex justify-end gap-2">
                <Dialog.Close asChild>
                  <Button
                    type="button"
                    variant="outlined"
                    size="small"
                  >
                    취소
                  </Button>
                </Dialog.Close>
                <Button
                  type="submit"
                  variant="secondary"
                  size="small"
                  disabled={isSubmitting || !isDirty || !isValid}
                >
                  저장
                </Button>
              </div>
            </Dialog.Footer>
          </Form>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
