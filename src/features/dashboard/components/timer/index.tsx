'use client';

import { useEffect, useRef, useState } from 'react';

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
  initialTextEditorValue,
  prepareContentForSave,
} from '@/shared/components/editor';
import type { TextEditorValue } from '@/shared/components/editor';
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
  const [studyNoteId, setStudyNoteId] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    data: progressData,
    isLoading: isProgressLoading,
    refetch,
  } = useStudyNoteTimerProgress();

  useEffect(() => {
    if (!isOpen) return;
    refetch().then((result) => {
      const data = result.data;
      if (!data?.ongoing) return;
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
      setSelectedSubject(data.subject);
      setElapsed(elapsedSec);
      setIsRunning(running);
      if (data.content) {
        try {
          setNoteContent(JSON.parse(data.content));
        } catch {
          // keep initial value
        }
      }
      setStep('running');
    });
  }, [isOpen, refetch]);

  const { data: subjects = [] } = useSubjectList();
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.code, s.name]));
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
    tempSaveTimer({
      studyNoteId,
      body: {
        title: topic,
        subject: selectedSubject ?? '',
        content: contentString,
        mediaIds,
        finishTimestamp: nowKST(),
      },
    });
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
        className={cn(step === 'running' ? 'max-w-[680px]' : 'max-w-[500px]')}
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
