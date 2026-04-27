'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  useStudyNoteTimerFinish,
  useStudyNoteTimerPause,
  useStudyNoteTimerProgress,
  useStudyNoteTimerReset,
  useStudyNoteTimerResume,
  useStudyNoteTimerStart,
  useStudyNoteTimerTempSave,
} from '@/features/dashboard/hooks';
import {
  hasMeaningfulEditorContent,
  initialTextEditorValue,
  parseEditorContent,
  prepareContentForSave,
} from '@/shared/components/editor';
import type { TextEditorValue } from '@/shared/components/editor';
import { showBottomToast } from '@/shared/components/ui';
import { Dialog } from '@/shared/components/ui/dialog';
import { PRIVATE } from '@/shared/constants';
import { useSubjectList } from '@/shared/hooks';
import { cn } from '@/shared/lib';

import { CompleteView } from './complete-view';
import { nowKST } from './constants';
import { RunningView } from './running-view';
import { SetupView } from './setup-view';

type Step = 'setup' | 'running' | 'complete';

type TimerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const TimerModal = ({ isOpen, onClose }: TimerModalProps) => {
  const router = useRouter();

  const [step, setStep] = useState<Step>('setup');
  const [topic, setTopic] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [noteOpen, setNoteOpen] = useState(true);
  const [noteContent, setNoteContent] = useState<TextEditorValue>(
    initialTextEditorValue
  );
  const [savedNoteContent, setSavedNoteContent] = useState<TextEditorValue>(
    initialTextEditorValue
  );
  const [studyNoteId, setStudyNoteId] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    data: progressData,
    isLoading: isProgressLoading,
    refetch,
  } = useStudyNoteTimerProgress();

  const progressDataRef = useRef(progressData);
  progressDataRef.current = progressData;

  const applyProgressData = useCallback(
    (data: NonNullable<typeof progressData>) => {
      const running = data.status === 'RUNNING';
      let elapsedSec = data.studyTime ?? 0;
      if (running && data.restartTime) {
        elapsedSec += Math.max(
          0,
          Math.floor((Date.now() - new Date(data.restartTime).getTime()) / 1000)
        );
      }
      setStudyNoteId(data.id);
      setTopic(data.title ?? '');
      setSelectedSubject(data.subject ?? null);
      setElapsed(elapsedSec);
      setIsRunning(running);
      const content = data.resolvedContent?.content
        ? parseEditorContent(data.resolvedContent.content)
        : parseEditorContent(data.content ?? '');
      setNoteContent(content);
      setSavedNoteContent(content);
      setStep('running');
    },
    []
  );

  useEffect(() => {
    if (!isOpen) return;
    // 캐시에 ongoing 데이터가 있으면 즉시 running으로 전환 (refetch 응답 전 공백 방지)
    if (progressDataRef.current?.ongoing) {
      applyProgressData(progressDataRef.current);
    }
    refetch().then((result) => {
      const data = result.data;
      if (!data?.ongoing) {
        setStep('setup');
        return;
      }
      applyProgressData(data);
    });
  }, [isOpen, refetch, applyProgressData]);

  const { data: subjects = [] } = useSubjectList();
  const subjectMap = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.code, s.name])),
    [subjects]
  );
  const subjectLabel = selectedSubject
    ? (subjectMap[selectedSubject] ?? selectedSubject)
    : null;

  const { mutate: startTimer } = useStudyNoteTimerStart();
  const { mutate: pauseTimer } = useStudyNoteTimerPause();
  const { mutate: resumeTimer } = useStudyNoteTimerResume();
  const { mutate: resetTimer } = useStudyNoteTimerReset();
  const { mutate: finishTimer } = useStudyNoteTimerFinish();
  const { mutate: tempSaveTimer } = useStudyNoteTimerTempSave();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setElapsed((t) => t + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleClose = () => {
    setStep('setup');
    setTopic('');
    setSelectedSubject(null);
    setElapsed(0);
    setIsRunning(false);
    setNoteOpen(true);
    setNoteContent(initialTextEditorValue);
    setSavedNoteContent(initialTextEditorValue);
    setStudyNoteId(null);
    onClose();
  };

  const handlePauseResume = () => {
    if (!studyNoteId) return;
    if (isRunning) {
      pauseTimer(
        {
          studyNoteId,
          body: {
            title: topic,
            subject: selectedSubject ?? '',
            content: '',
            mediaIds: [],
            finishTimestamp: nowKST(),
          },
        },
        { onSuccess: () => setIsRunning(false) }
      );
    } else {
      resumeTimer(studyNoteId, { onSuccess: () => setIsRunning(true) });
    }
  };

  const handleTempSave = () => {
    if (!studyNoteId) return;
    const { contentString, mediaIds } = prepareContentForSave(noteContent);
    tempSaveTimer(
      {
        studyNoteId,
        body: {
          title: topic,
          subject: selectedSubject ?? '',
          content: contentString,
          mediaIds,
          finishTimestamp: nowKST(),
        },
      },
      {
        onSuccess: () => {
          setSavedNoteContent(noteContent);
          showBottomToast('학습노트가 저장되었어요');
        },
      }
    );
  };

  const handleFinish = () => {
    if (!studyNoteId) return;
    const { contentString, mediaIds } = prepareContentForSave(noteContent);
    finishTimer(
      {
        studyNoteId,
        body: {
          title: topic,
          subject: selectedSubject ?? '',
          content: contentString,
          mediaIds,
          finishTimestamp: nowKST(),
        },
      },
      {
        onSuccess: () => {
          setIsRunning(false);
          setStep('complete');
        },
      }
    );
  };

  const hasUploadingContent = (content: TextEditorValue): boolean => {
    if (content.attrs?.isUploading === true) return true;
    if (Array.isArray(content.content)) {
      return content.content.some(hasUploadingContent);
    }
    return false;
  };

  const isTempSaveDisabled =
    !hasMeaningfulEditorContent(noteContent) ||
    JSON.stringify(noteContent) === JSON.stringify(savedNoteContent) ||
    hasUploadingContent(noteContent);

  const today = new Date();
  const dateStr = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <Dialog.Content
        className={cn(
          'tablet:p-9 p-4',
          step === 'running' ? 'max-w-[680px]' : 'max-w-[500px]'
        )}
      >
        <Dialog.Title className="sr-only">
          {step === 'setup'
            ? '타이머'
            : step === 'running'
              ? '타이머 진행 중'
              : '공부 완료'}
        </Dialog.Title>
        {step === 'setup' && isProgressLoading && (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="border-key-color-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        )}
        {step === 'setup' && !isProgressLoading && !progressData?.ongoing && (
          <SetupView
            topic={topic}
            onTopicChange={setTopic}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            canStart={topic.trim().length > 0 || selectedSubject !== null}
            onStart={() => {
              startTimer(
                {
                  title: topic,
                  subject: selectedSubject ?? '',
                  content: '',
                  mediaIds: [],
                  finishTimestamp: nowKST(),
                },
                {
                  onSuccess: ({ id }) => {
                    setStudyNoteId(id);
                    setElapsed(0);
                    setIsRunning(true);
                    setStep('running');
                  },
                }
              );
            }}
            onClose={handleClose}
          />
        )}
        {step === 'running' && (
          <RunningView
            elapsed={elapsed}
            isRunning={isRunning}
            subjectLabel={subjectLabel}
            noteOpen={noteOpen}
            noteContent={noteContent}
            onNoteContentChange={setNoteContent}
            onToggleNote={() => setNoteOpen((o) => !o)}
            onPauseResume={handlePauseResume}
            onTempSave={handleTempSave}
            isTempSaveDisabled={isTempSaveDisabled}
            onReset={() => {
              if (!studyNoteId) return;
              resetTimer(studyNoteId, {
                onSuccess: () => {
                  setElapsed(0);
                  setIsRunning(true);
                },
              });
            }}
            onFinish={handleFinish}
            onClose={handleClose}
          />
        )}
        {step === 'complete' && (
          <CompleteView
            elapsed={elapsed}
            subjectLabel={subjectLabel}
            topic={topic}
            dateStr={dateStr}
            onClose={handleClose}
            onWriteNote={() => {
              if (studyNoteId)
                router.push(
                  `${PRIVATE.STUDENT_NOTE.DETAIL(studyNoteId)}?edit=true`
                );
              handleClose();
            }}
          />
        )}
      </Dialog.Content>
    </Dialog>
  );
};
