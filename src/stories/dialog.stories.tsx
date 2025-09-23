import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TextField } from '@/components/ui/text-field';
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
          <Button size="xsmall">열기</Button>
        </Dialog.Trigger>
        <Dialog.Content className="w-[598px]">
          <Dialog.Header>
            <Dialog.Title>수업노트 그룹 추가</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body className="mt-6">
            <TextField
              description={
                <TextField.Description>
                  수업노트 그룹으로 여러개의 수업노트를 묶어서 관리할 수
                  있습니다.
                </TextField.Description>
              }
            >
              <TextField.Input placeholder="수업노트 그룹 이름을 작성해주세요." />
            </TextField>
          </Dialog.Body>
          <Dialog.Footer className="mt-6 justify-end">
            <Dialog.Close asChild>
              <Button
                className="w-[120px]"
                variant="outlined"
                size="xsmall"
              >
                취소
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button
                className="w-[120px]"
                size="xsmall"
              >
                저장
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    );
  },
};
