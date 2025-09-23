import { useState } from 'react';

import { DropdownMenu } from '@/components/ui/dropdown-menu';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ui/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <DropdownMenu>
        <DropdownMenu.Trigger className="flex size-8 cursor-pointer items-center justify-center">
          <EllipsisVerticalIcon />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>편집하기</DropdownMenu.Item>
          <DropdownMenu.Item variant="danger">삭제하기</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <DropdownMenu
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DropdownMenu.Trigger className="flex size-8 cursor-pointer items-center justify-center">
          <EllipsisVerticalIcon />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>편집하기</DropdownMenu.Item>
          <DropdownMenu.Item variant="danger">삭제하기</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

const EllipsisVerticalIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 19.25C13.5 18.2835 12.7165 17.5 11.75 17.5C10.7835 17.5 10 18.2835 10 19.25C10 20.2165 10.7835 21 11.75 21C12.7165 21 13.5 20.2165 13.5 19.25Z"
        fill="#171719"
      />
      <path
        d="M11.75 10.75C12.7165 10.75 13.5 11.5335 13.5 12.5C13.5 13.4665 12.7165 14.25 11.75 14.25C10.7835 14.25 10 13.4665 10 12.5C10 11.5335 10.7835 10.75 11.75 10.75Z"
        fill="#171719"
      />
      <path
        d="M11.75 4C12.7165 4 13.5 4.7835 13.5 5.75C13.5 6.7165 12.7165 7.5 11.75 7.5C10.7835 7.5 10 6.7165 10 5.75C10 4.7835 10.7835 4 11.75 4Z"
        fill="#171719"
      />
    </svg>
  );
};
