'use client';

import { Dispatch, SetStateAction } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { UserBasicInfo } from '@/entities/member/types';
import { parentKeys } from '@/entities/parent';
import { studentKeys } from '@/entities/student';
import { teacherKeys } from '@/entities/teacher';
import EditProfileImageField from '@/features/mypage/common/components/edit-profile-image-field';
import { useUpdateStudentBasicInfo } from '@/features/mypage/common/hooks/student/use-basic-info';
import { useUpdateTeacherBasicInfo } from '@/features/mypage/common/hooks/teacher/use-basic-info';
import { useEditProfileImage } from '@/features/mypage/common/hooks/use-edit-profile-image';
import {
  BasicInfoForm,
  BasicInfoFormSchema,
} from '@/features/mypage/common/schema/schema';
import { ProfileChangeModal } from '@/features/profile-image/components/profile-change-modal';
import {
  useProfileImage,
  useUpdateProfileImage,
} from '@/features/profile-image/hooks/use-profile-image';
import { useImageUpload } from '@/shared/components/editor';
import { ImageCropper } from '@/shared/components/image-crop';
import {
  Button,
  Checkbox,
  Form,
  Input,
  RequiredMark,
  Select,
  Textarea,
} from '@/shared/components/ui';
import { classifyMypageError, handleApiError } from '@/shared/lib/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';

import { useUpdateParentBasicInfo } from '../hooks/parent/use-basic-info';

interface EditProfileCardProps {
  basicInfo: UserBasicInfo;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
}

export default function EditProfileCard({
  basicInfo,
  setIsEditMode,
}: EditProfileCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateTeacherBasicInfoMutation = useUpdateTeacherBasicInfo();
  const updateStudentBasicInfoMutation = useUpdateStudentBasicInfo();
  const updateParentBasicInfoMutation = useUpdateParentBasicInfo();

  const { data: profileImageData } = useProfileImage();
  const { mutateAsync: updateImage } = useUpdateProfileImage();
  const { uploadAsync, isUploading } = useImageUpload();
  const profileImage = useEditProfileImage({
    serverImageUrl: profileImageData?.imageUrl,
  });

  const isProfileImageDirty = !!profileImage.imageFile;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<BasicInfoForm>({
    resolver: zodResolver(BasicInfoFormSchema),
    defaultValues: {
      name: basicInfo.name,
      isProfilePublic: basicInfo.isProfilePublic,
      isEmailPublic:
        basicInfo.role === 'ROLE_TEACHER' ? basicInfo.isEmailPublic : undefined,
      simpleIntroduction:
        basicInfo.role === 'ROLE_TEACHER'
          ? basicInfo.simpleIntroduction
          : undefined,
      learningGoal:
        basicInfo.role === 'ROLE_STUDENT'
          ? basicInfo.learningGoal || ''
          : undefined,
    },
    mode: 'onChange',
  });

  const invalidateBasicInfo = () => {
    if (basicInfo.role === 'ROLE_TEACHER') {
      queryClient.invalidateQueries({ queryKey: teacherKeys.basicInfo() });
      return;
    }

    if (basicInfo.role === 'ROLE_STUDENT') {
      queryClient.invalidateQueries({
        queryKey: studentKeys.mypage.basicInfo(),
      });
      return;
    }

    if (basicInfo.role === 'ROLE_PARENT') {
      queryClient.invalidateQueries({
        queryKey: parentKeys.mypage.basicInfo(),
      });
    }
  };

  const handleSaveError = (error: unknown) => {
    handleApiError(error, classifyMypageError, {
      onAuth: () => {
        // MEMBER_NOT_EXIST
        setTimeout(() => {
          router.replace('/login');
        }, 1500);
      },
      onUnknown: () => {},
    });
  };

  const updateBasicInfoIfNeeded = async (data: BasicInfoForm) => {
    if (!isDirty) return;
    if (basicInfo.role === 'ROLE_TEACHER') {
      await updateTeacherBasicInfoMutation.mutateAsync({
        name: data.name,
        isProfilePublic: data.isProfilePublic,
        isEmailPublic: data.isEmailPublic ?? false,
        simpleIntroduction: data.simpleIntroduction ?? '',
      });
      return;
    }

    if (basicInfo.role === 'ROLE_STUDENT') {
      await updateStudentBasicInfoMutation.mutateAsync({
        name: data.name,
        isProfilePublic: data.isProfilePublic,
        learningGoal: data.learningGoal ?? '',
      });
      return;
    }

    if (basicInfo.role === 'ROLE_PARENT') {
      await updateParentBasicInfoMutation.mutateAsync({
        name: data.name,
        isProfilePublic: data.isProfilePublic,
      });
    }
  };

  const updateProfileImageIfNeeded = async () => {
    if (!profileImage.imageFile) return;

    const uploaded = await uploadAsync(profileImage.imageFile);
    await updateImage({ mediaId: uploaded.mediaId });
    invalidateBasicInfo();
  };

  const onSubmit = async (data: BasicInfoForm) => {
    try {
      await updateBasicInfoIfNeeded(data);
      await updateProfileImageIfNeeded();
      setIsEditMode(false);
    } catch (error) {
      handleSaveError(error);
    }
  };

  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        <div>
          <Form.Item error={!!errors.name}>
            <Form.Label>
              이름
              <RequiredMark />
            </Form.Label>

            <Form.Control>
              <Input
                {...register('name')}
                placeholder="이름을 입력해 주세요."
              />
            </Form.Control>
            {errors.name?.message && (
              <Form.ErrorMessage>{errors.name.message}</Form.ErrorMessage>
            )}
          </Form.Item>
        </div>

        <EditProfileImageField
          fileInputRef={profileImage.fileInputRef}
          isUploading={isUploading}
          name={basicInfo.name}
          onFileChange={profileImage.handleProfileImageChange}
          onOpenModal={() => profileImage.setOpenModal(true)}
          profileImageUrl={profileImage.profileImageUrl}
        />

        <Form.Item error={!!errors.isProfilePublic}>
          <Form.Label>
            공개 범위
            <RequiredMark />
          </Form.Label>

          <Controller
            name="isProfilePublic"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ? 'public' : 'private'}
                onValueChange={(v) => field.onChange(v === 'public')}
              >
                <Select.Trigger />

                <Select.Content>
                  <Select.Option value="public">공개</Select.Option>
                  <Select.Option value="private">비공개</Select.Option>
                </Select.Content>
              </Select>
            )}
          />
        </Form.Item>

        {basicInfo.role === 'ROLE_TEACHER' && (
          <Form.Item error={!!errors.simpleIntroduction}>
            <Form.Label>간단 소개</Form.Label>

            <Form.Control>
              <Textarea
                {...register('simpleIntroduction')}
                placeholder="간단한 소개와 연락처를 남겨보세요!"
                className="resize-none"
              />
            </Form.Control>
            {errors.simpleIntroduction?.message && (
              <Form.ErrorMessage>
                {errors.simpleIntroduction.message}
              </Form.ErrorMessage>
            )}
          </Form.Item>
        )}
        {basicInfo.role === 'ROLE_STUDENT' && (
          <Form.Item error={!!errors.learningGoal}>
            <Form.Label>학습 목표</Form.Label>

            <Form.Control>
              <Input
                {...register('learningGoal')}
                placeholder="학습 목표를 입력해 주세요."
              />
            </Form.Control>
            {errors.learningGoal?.message && (
              <Form.ErrorMessage>
                {errors.learningGoal.message}
              </Form.ErrorMessage>
            )}
          </Form.Item>
        )}

        {basicInfo.role === 'ROLE_TEACHER' && (
          <Controller
            name="isEmailPublic"
            control={control}
            render={({ field }) => (
              <Checkbox.Label className="self-end">
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
                이메일 공개
              </Checkbox.Label>
            )}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={() => {
              reset();
              setIsEditMode(false);
            }}
          >
            취소
          </Button>
          {/* TODO 저장버튼 누를시 프로필 이미지도 전송 */}
          <Button
            type="submit"
            variant="secondary"
            size="small"
            disabled={
              isSubmitting ||
              isUploading ||
              (!isDirty && !isProfileImageDirty) ||
              !isValid
            }
          >
            저장
          </Button>
        </div>
      </Form>
      {profileImage.openModal && (
        <ProfileChangeModal
          isOpen={profileImage.openModal}
          onOpenChange={profileImage.setOpenModal}
          handleOpenFilePicker={profileImage.handleOpenFilePicker}
          setImageUrl={profileImage.setImageUrl}
          selectedImageId={profileImage.selectedImageId}
          setSelectedImageId={profileImage.setSelectedImageId}
          clearSelectedImage={profileImage.clearSelectedImage}
          handleImageCropper={profileImage.handleImageCropper}
        />
      )}
      <ImageCropper
        isOpen={profileImage.isCropperClicked}
        onOpenChange={profileImage.setIsCropperClicked}
        onApply={profileImage.onApply}
        image={profileImage.imageUrl}
        crop={profileImage.crop}
        zoom={profileImage.zoom}
        aspect={1}
        onCropChange={profileImage.setCrop}
        onZoomChange={profileImage.setZoom}
        onCropComplete={(_, croppedAreaPixels) => {
          profileImage.setCroppedAreaPixels(croppedAreaPixels);
        }}
        clearSelectedImage={profileImage.clearSelectedImage}
      />
    </>
  );
}
