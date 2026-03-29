'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { useAdminColumnDetail } from '@/features/community/column/hooks/use-admin-column';
import { useMyColumnDetail } from '@/features/community/column/hooks/use-column-detail';
import {
  useCreateColumn,
  useUpdateColumn,
} from '@/features/community/column/hooks/use-column-form';
import {
  ColumnForm,
  ColumnFormSchema,
} from '@/features/community/column/schema/schema';
import {
  TextEditor,
  parseEditorContent,
  prepareContentForSave,
} from '@/shared/components/editor';
import { MiniSpinner } from '@/shared/components/loading';
import {
  Button,
  Dialog,
  Form,
  Input,
  RequiredMark,
} from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';
import { cn, extractText } from '@/shared/lib';
import { classifyColumnError, handleApiError } from '@/shared/lib/errors';
import { useMemberStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { JSONContent } from '@tiptap/core';
import { X } from 'lucide-react';

// 첫 번째 이미지 MediaId 추출 (썸네일용)
const getFirstImageMediaId = (node: JSONContent): string | undefined => {
  if (node.type === 'image' && node.attrs?.mediaId)
    return node.attrs.mediaId as string;
  for (const child of node.content ?? []) {
    const id = getFirstImageMediaId(child);
    if (id) return id;
  }
  return undefined;
};

// 이미지 업로드 중일 때, 저장 버튼 비활성화
const hasUploadingNode = (node: JSONContent): boolean => {
  if (node.attrs?.isUploading === true) return true;
  return (node.content ?? []).some(hasUploadingNode);
};

// 이미지(썸네일) 존재 여부 확인
const hasImageNode = (node: JSONContent): boolean => {
  if (node.type === 'image') return true;
  return (node.content ?? []).some(hasImageNode);
};

export default function ColumnWriteArea({
  id,
  isEditMode = false,
}: {
  id?: number;
  isEditMode?: boolean;
}) {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const router = useRouter();

  const role = useMemberStore((state) => state.member?.role);
  const isAdmin = role === 'ROLE_ADMIN';

  // 수정 모드일 경우, 기존 내용 불러오기
  const { data: teacherData, isLoading: teacherLoading } = useMyColumnDetail(
    id ?? 0,
    { enabled: isEditMode && !!id && !isAdmin }
  );
  const { data: adminData, isLoading: adminLoading } = useAdminColumnDetail(
    id ?? 0,
    { enabled: isEditMode && !!id && isAdmin }
  );

  const existingData = isAdmin ? adminData : teacherData;
  const isDetailLoading = isAdmin ? adminLoading : teacherLoading;

  const createColumnMutation = useCreateColumn();
  const updateColumnMutation = useUpdateColumn(id ?? 0);

  const mutation = isEditMode ? updateColumnMutation : createColumnMutation;

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ColumnForm>({
    resolver: zodResolver(ColumnFormSchema),
    defaultValues: {
      title: '',
      content: { type: 'doc', content: [] },
      tags: [],
    },
    mode: 'onChange',
  });

  // 수정 모드일 경우, 기본값 세팅
  useEffect(() => {
    if (existingData && isEditMode) {
      reset({
        title: existingData.title,
        content: parseEditorContent(existingData.resolvedContent.content),
        tags: existingData.tags,
      });
    }
  }, [existingData, isEditMode, reset]);

  // 태그 상태 관리
  const [tagInput, setTagInput] = useState('');
  const tags = watch('tags') ?? [];

  // 태그 추가
  const addTag = (input: string) => {
    const trimmed = input.trim().replace(/^#/, '');

    if (trimmed && !tags.includes(trimmed) && tags.length < 3) {
      setValue('tags', [...tags, trimmed], {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      });
    }
    setTagInput('');
  };

  // Enter 또는 , 입력 시 태그 추가
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const content = watch('content');
  const isUploading = useMemo(() => hasUploadingNode(content), [content]);

  // 작성 완료 클릭 시 제출
  const onSubmit = (data: ColumnForm) => {
    // 썸네일 MediaId 추출
    const thumbnailMediaId = getFirstImageMediaId(data.content);

    // 썸네일용 사진이 없을 경우, 알림
    if (!thumbnailMediaId && !hasImageNode(data.content)) {
      setShowImageDialog(true);
      return;
    }

    const { contentString, mediaIds } = prepareContentForSave(data.content);

    const payload = {
      title: data.title,
      content: contentString,
      thumbnailMediaId,
      tags: data.tags,
      mediaIds,
    };

    mutation.mutate(payload, {
      onError: (error) => {
        handleApiError(error, classifyColumnError, {
          // COLUMN_ARTICLE_NOT_EXIST, COLUMN_ARTICLE_NOT_OWNED
          onContext: () => {
            setTimeout(
              () => router.replace(PUBLIC.COMMUNITY.COLUMN.LIST),
              1500
            );
          },
          // MEMBER_NOT_EXIST
          onAuth: () => {
            setTimeout(() => router.replace('/login'), 1500);
          },
        });
      },
    });
  };

  if (isEditMode && isDetailLoading) return <MiniSpinner />;

  return (
    <>
      <h1 className="font-title-heading mb-10">
        {isEditMode ? '칼럼 게시글 수정' : '칼럼 게시글 작성'}
      </h1>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* 제목 */}
        <Form.Item error={!!errors.title}>
          <Form.Label className="font-body1-heading mb-2">
            게시글 제목 <RequiredMark />
          </Form.Label>
          <Form.Control>
            <Input
              {...register('title')}
              placeholder="게시글의 제목을 입력해주세요."
              disabled={mutation.isPending}
            />
          </Form.Control>
          <Form.ErrorMessage className="text-sm">
            {errors.title?.message}
          </Form.ErrorMessage>
        </Form.Item>

        {/* 태그 */}
        <Form.Item error={!!errors.tags}>
          <Form.Label className="font-body1-heading mb-2">
            해시태그 <RequiredMark />
          </Form.Label>
          <p className="text-gray-7 mb-2 text-sm">
            태그는 최대 3개까지 추가할 수 있습니다.
          </p>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => {
              addTag(tagInput);
              trigger('tags');
            }}
            placeholder="관련 해시태그 입력 후 Enter를 눌러주세요. (#고3 #진로상담 #학생부)"
            disabled={mutation.isPending || tags.length >= 3}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-orange-2 font-label-normal flex items-center gap-1 rounded-lg px-3 py-1"
              >
                # {tag}
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      'tags',
                      tags.filter((t) => t !== tag),
                      { shouldValidate: true, shouldDirty: true }
                    )
                  }
                >
                  <X
                    size={12}
                    aria-label="태그 삭제"
                  />
                </button>
              </span>
            ))}
          </div>
          <Form.ErrorMessage className="text-sm">
            {errors.tags?.message}
          </Form.ErrorMessage>
        </Form.Item>

        {/* 내용 */}
        <Form.Item error={!!errors.content}>
          <Form.Label className="font-body1-heading">
            내용 <RequiredMark />
          </Form.Label>
          <p className="text-gray-7 mb-2 text-sm">
            칼럼의 썸네일을 위해 이미지를 최소 1개 포함해주세요.
          </p>
          <Form.Control>
            <Controller
              name="content"
              control={control}
              render={({ field }) => {
                const text = extractText(JSON.stringify(field.value));
                const length = text.length;
                return (
                  <>
                    <TextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="칼럼 내용을 입력해주세요."
                      minHeight="400px"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-system-warning text-sm">
                        {typeof errors.content?.message === 'string' &&
                          errors.content.message}
                      </p>
                      <span
                        className={cn(
                          length > 3000 ? 'text-system-warning' : 'text-gray-5'
                        )}
                      >
                        {length} / 3000
                      </span>
                    </div>
                  </>
                );
              }}
            />
          </Form.Control>
        </Form.Item>

        {/* 제출 버튼 */}
        <Button
          type="submit"
          disabled={mutation.isPending || !isDirty || !isValid || isUploading}
          className="w-full"
        >
          {mutation.isPending && '저장 중'}
          {!mutation.isPending && (isEditMode ? '수정 완료' : '작성 완료')}
        </Button>
      </Form>

      {/* 이미지 포함 안내 다이얼로그 */}
      <Dialog
        isOpen={showImageDialog}
        onOpenChange={setShowImageDialog}
      >
        <Dialog.Content className="max-w-[400px] space-y-2 text-center">
          <Dialog.Title>썸네일 이미지를 추가해주세요</Dialog.Title>
          <Dialog.Description className="">
            칼럼의 썸네일을 위해
            <br />
            본문에 이미지를 최소 1개 포함해주세요.
          </Dialog.Description>
          <div className="mt-6">
            <Button
              className="w-full"
              onClick={() => setShowImageDialog(false)}
            >
              확인
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
