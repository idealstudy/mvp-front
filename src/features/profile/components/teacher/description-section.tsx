import { FrontendTeacherDescription } from '@/entities/teacher';
import { TextViewer, parseEditorContent } from '@/shared/components/editor';

type Props = {
  description: FrontendTeacherDescription;
};

export default function DescriptionSection({ description }: Props) {
  if (!description.resolvedDescription.content) return null;

  return (
    <TextViewer
      value={parseEditorContent(description.resolvedDescription.content)}
    />
  );
}
