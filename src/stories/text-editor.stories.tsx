import { TextEditor } from '@/features/editor/components/text-editor';
import { TextViewer } from '@/features/editor/components/text-viewer';
import { useTextEditor } from '@/features/editor/hooks/use-editor';
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

const EditorComponent = () => {
  const textEditor = useTextEditor();

  return (
    <div className="w-[600px]">
      <TextEditor
        value={textEditor.value}
        onChange={textEditor.onChange}
        placeholder="수업 내용을 작성해보세요."
      />
    </div>
  );
};

export const Editor: Story = {
  render: () => <EditorComponent />,
};

export const Viewer: Story = {
  render: () => {
    return <TextViewer value={DUMMY_TEXT_EDITOR_VALUE} />;
  },
};

const DUMMY_TEXT_EDITOR_VALUE = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '수업 노트에 작성한 텍스트가 표시됩니다.',
        },
      ],
    },
    {
      type: 'paragraph',
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '안녕하세요, 이것은 테스트용 텍스트입니다.',
        },
      ],
    },
  ],
};
