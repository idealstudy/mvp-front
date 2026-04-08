'use client';

import { MoreContentsHeader } from '../more-contents-header';
import { ParentStudyNewsItemData } from '../section-content/parent-study-news-item';
import { ParentStudent } from '../types/parent-student';
import { StudyNewsList } from './study-news-list';

export const StudyNews = ({
  data,
  studyNewsData,
}: {
  data: ParentStudent[];
  studyNewsData: ParentStudyNewsItemData[];
}) => {
  return (
    <div className="flex min-h-[calc(100vh-76px)] w-full flex-col">
      <MoreContentsHeader kind="STUDY_NEWS" />
      <StudyNewsList
        data={data}
        studyNewsData={studyNewsData}
      />
    </div>
  );
};
