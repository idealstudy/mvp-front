import { dto } from '../infrastructure/preview.dto';

export const MODALITY_TO_KOREAN = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
} as const;

export const CLASS_FORM_TO_KOREAN = {
  ONE_ON_ONE: '일대일',
  ONE_TO_MANY: '그룹',
} as const;

export const SUBJECT_TO_KOREAN = {
  KOREAN: '국어',
  ENGLISH: '영어',
  MATH: '수학',
  SCIENCE: '과학',
  SOCIETY: '사회',
  ART_PE: '예체능',
  ESSAY: '논술',
  OTHER: '기타',
} as const;

export const SCHOOL_LEVEL_TO_KOREAN = {
  ELEMENTARY: '초등학생',
  MIDDLE: '중학생',
  HIGH: '고등학생',
  OTHER: '기타',
} as const;

export const ENROLLMENT_STATUS_TO_KOREAN = {
  OPEN: '모집 중',
  OPERATING: '운영 중',
} as const;

type PreviewCoreLike = {
  modality: keyof typeof MODALITY_TO_KOREAN;
  classForm: keyof typeof CLASS_FORM_TO_KOREAN;
  subjectType: keyof typeof SUBJECT_TO_KOREAN;
  enrollmentStatus: keyof typeof ENROLLMENT_STATUS_TO_KOREAN;
  schoolInfo: {
    schoolLevel: keyof typeof SCHOOL_LEVEL_TO_KOREAN | null;
    grade: number | null;
  };
};

const withKoreanLabels = <T extends PreviewCoreLike>(value: T) => {
  const schoolLevelKorean = value.schoolInfo.schoolLevel
    ? SCHOOL_LEVEL_TO_KOREAN[value.schoolInfo.schoolLevel]
    : '대상 미정';

  return {
    ...value,
    modalityKorean: MODALITY_TO_KOREAN[value.modality],
    classFormKorean: CLASS_FORM_TO_KOREAN[value.classForm],
    subjectTypeKorean: SUBJECT_TO_KOREAN[value.subjectType],
    enrollmentStatusKorean: ENROLLMENT_STATUS_TO_KOREAN[value.enrollmentStatus],
    schoolInfo: {
      ...value.schoolInfo,
      schoolLevelKorean,
    },
  };
};

const PreviewCoreDomainSchema = dto.core.transform(withKoreanLabels);

const PreviewMainDomainSchema = dto.main.transform((value) =>
  withKoreanLabels(value)
);

const PreviewSideItemDomainSchema = dto.statsItem;

const PreviewSideDomainSchema = dto.side.transform((value) => ({
  ...value,
}));

const PreviewInquiryItemDomainSchema = dto.inquiryItem;

const PreviewInquiryListDomainSchema = dto.inquiryList;

export const domain = {
  core: PreviewCoreDomainSchema,
  main: PreviewMainDomainSchema,
  sideItem: PreviewSideItemDomainSchema,
  side: PreviewSideDomainSchema,
  inquiryItem: PreviewInquiryItemDomainSchema,
  inquiryList: PreviewInquiryListDomainSchema,
};
