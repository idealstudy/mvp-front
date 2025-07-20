import { useState } from 'react';

import {
  TextEditor,
  initialTextEditorValue,
} from '@/components/editor/text-editor';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ui/TextEditor',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(initialTextEditorValue);

    return (
      <div className="w-[600px]">
        <TextEditor
          value={value}
          onChange={setValue}
          placeholder="수업 내용을 작성해보세요."
        />
      </div>
    );
  },
};
