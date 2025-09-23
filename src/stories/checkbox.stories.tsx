import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ui/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <Checkbox.Label>
        <Checkbox disabled />
        체크박스 텍스트
      </Checkbox.Label>
    );
  },
};

export const DisabledChecked: Story = {
  render: () => {
    return (
      <Checkbox.Label>
        <Checkbox
          checked
          disabled
        />
        체크박스 텍스트
      </Checkbox.Label>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    return (
      <Checkbox.Label>
        <Checkbox />
        체크박스 텍스트
      </Checkbox.Label>
    );
  },
};

export const Invalid: Story = {
  render: () => {
    return (
      <Checkbox.Label>
        <Checkbox aria-invalid />
        스타일 미구현
      </Checkbox.Label>
    );
  },
};

export const Grouped: Story = {
  render: () => {
    return (
      <Checkbox.Group className="flex flex-col gap-4">
        <Checkbox.Label>
          <Checkbox />
          서비스 이용 약관에 동의합니다.
        </Checkbox.Label>
        <Checkbox.Label>
          <Checkbox />
          개인정보 처리 방침에 동의합니다.
        </Checkbox.Label>
        <Checkbox.Label>
          <Checkbox />
          마케팅 정보 수신에 동의합니다. (선택)
        </Checkbox.Label>
      </Checkbox.Group>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);

    return (
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};
