import { TextField } from '@/components/ui/text-field';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ui/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <TextField
        className="w-[300px]"
        label={<TextField.Label>인풋 타이틀</TextField.Label>}
        required
      >
        <TextField.Input placeholder="이메일을 입력해주세요." />
      </TextField>
    );
  },
};

export const WithDescription: Story = {
  render: () => {
    return (
      <TextField
        className="w-[300px]"
        label={<TextField.Label>인풋 타이틀</TextField.Label>}
        description={
          <TextField.Description>이메일을 입력해주세요.</TextField.Description>
        }
        required
      >
        <TextField.Input placeholder="이메일을 입력해주세요." />
      </TextField>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <TextField
        className="w-[300px]"
        label={<TextField.Label>인풋 타이틀</TextField.Label>}
        required
      >
        <TextField.Input
          placeholder="이메일을 입력해주세요."
          disabled
        />
      </TextField>
    );
  },
};

export const Invalid: Story = {
  render: () => {
    return (
      <TextField
        className="w-[300px]"
        label={<TextField.Label>인풋 타이틀</TextField.Label>}
        required
        error
        errorMessage={
          <TextField.ErrorMessage>
            올바른 이메일 형식이 아닙니다.
          </TextField.ErrorMessage>
        }
      >
        <TextField.Input placeholder="이메일을 입력해주세요." />
      </TextField>
    );
  },
};

export const WithPrefix: Story = {
  render: () => {
    return (
      <TextField
        className="w-[300px]"
        label={<TextField.Label>인풋 타이틀</TextField.Label>}
        required
      >
        <TextField.Prefix>
          <CalendarIcon />
        </TextField.Prefix>
        <TextField.Input placeholder="이메일을 입력해주세요." />
      </TextField>
    );
  },
};

export const WithSuffix: Story = {
  render: () => {
    return (
      <TextField
        className="w-[300px]"
        label={<TextField.Label>인풋 타이틀</TextField.Label>}
        required
      >
        <TextField.Input placeholder="이메일을 입력해주세요." />
        <TextField.Suffix>
          <CalendarIcon />
        </TextField.Suffix>
      </TextField>
    );
  },
};

const CalendarIcon = () => {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 11H9V16H14V11ZM13 0V2H5V0H3V2H2C0.89 2 0.00999999 2.9 0.00999999 4L0 18C0 19.1 0.89 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2H15V0H13ZM16 18H2V7H16V18Z"
        fill="#7C7C7C"
      />
    </svg>
  );
};
