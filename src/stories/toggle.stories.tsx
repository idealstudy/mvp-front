import { useState } from 'react';

import { Toggle } from '@/shared/components/ui/toggle';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ui/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '켜짐/꺼짐 상태 (제어 모드)',
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
  },
  render: (args, { updateArgs }) => {
    const { checked, ...rest } = args;
    return (
      <div className="flex flex-col items-center gap-4">
        <Toggle
          {...rest}
          checked={checked}
          onCheckedChange={(value) => updateArgs({ checked: value })}
        />
        <p className="text-gray-10 text-sm">
          상태:{' '}
          <span className="text-gray-12 font-medium">
            {checked ? '켜짐' : '꺼짐'}
          </span>
        </p>
      </div>
    );
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

function InteractiveDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <Toggle
        checked={checked}
        onCheckedChange={setChecked}
      />
      <p className="text-gray-10 text-sm">
        상태:{' '}
        <span className="text-gray-12 font-medium">
          {checked ? '켜짐' : '꺼짐'}
        </span>
      </p>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
