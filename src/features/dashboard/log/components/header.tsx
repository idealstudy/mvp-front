import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LogHeader = () => {
  return (
    <section className="mx-auto flex max-w-[656px] flex-col items-center justify-center gap-y-[60px]">
      <h1 className="text-[32px] font-bold">어떤 수업을 기록해볼까요?</h1>
      <div className="flex w-full items-center gap-[12px]">
        <Input
          className="h-[56px] w-full"
          placeholder="학부모, 학생들이 확인할 제목을 입력해주세요!"
        />
        <Button className="h-[56px] w-[150px] text-[16px]">이어서 작성</Button>
      </div>
    </section>
  );
};

export default LogHeader;
