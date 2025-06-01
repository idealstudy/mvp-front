import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Prompt } from '@/components/ui/prompt';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ui/Prompt',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  render: () => {
    return (
      <Prompt>
        <Prompt.Trigger asChild>
          <Button>열기</Button>
        </Prompt.Trigger>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>연결 요청을 거절하시겠습니까?</Prompt.Title>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel>취소</Prompt.Cancel>
            <Prompt.Action>확인</Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    );
  },
};

export const Alert: Story = {
  render: () => {
    return (
      <Prompt>
        <Prompt.Trigger asChild>
          <Button>열기</Button>
        </Prompt.Trigger>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>연결 요청에 성공했습니다!</Prompt.Title>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Action>확인</Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Prompt
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <Prompt.Trigger asChild>
          <Button>열기</Button>
        </Prompt.Trigger>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>연결 요청을 거절하시겠습니까?</Prompt.Title>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel>취소</Prompt.Cancel>
            <Prompt.Action>확인</Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    );
  },
};
