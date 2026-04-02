import { TextEditor, useTextEditor } from '@/shared/components/editor';

const QuestionEditor = () => {
  const textEditor = useTextEditor();

  return (
    <div>
      <TextEditor
        value={textEditor.value}
        onChange={textEditor.onChange}
        placeholder="답변 내용을 작성해보세요."
      />
    </div>
  );
};

export default QuestionEditor;
