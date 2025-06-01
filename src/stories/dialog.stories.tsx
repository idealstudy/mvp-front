import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ui/Dialog',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  render: () => {
    return (
      <Dialog>
        <Dialog.Trigger asChild>
          <Button>열기</Button>
        </Dialog.Trigger>
        <Dialog.Content className="w-[598px]">
          <Dialog.Header>
            <Dialog.Title className="text-[35px] font-bold">
              Connecting
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body className="mt-8">
            <label
              className="mb-2 text-[20px] font-medium"
              htmlFor="input"
            >
              연결할 사용자 이메일 입력
            </label>
            <Input
              id="input"
              placeholder="연결할 선생님 or 학생 or 부모님의 이메일을 입력해주세요."
            />
          </Dialog.Body>
          <Dialog.Footer className="mt-8">
            <Dialog.Close asChild>
              <Button
                className="w-full"
                size="large"
                disabled
              >
                연결 요청 보내기
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    );
  },
};
