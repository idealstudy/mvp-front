import { cn } from '@/lib/utils';
import { Editor, useEditorState } from '@tiptap/react';

type ToolbarProps = {
  editor: Editor;
};

export const Toolbar = ({ editor }: ToolbarProps) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold'),
        isItalic: ctx.editor.isActive('italic'),
        isUnderline: ctx.editor.isActive('underline'),
        isStrikethrough: ctx.editor.isActive('strike'),
        fontSize: ctx.editor.getAttributes('textStyle').fontSize || '16px',
      };
    },
  });

  const changeFontSize = (fontSize: string) => {
    editor.chain().focus().setFontSize(fontSize).run();
  };

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  const toggleUnderline = () => {
    editor.chain().focus().toggleUnderline().run();
  };

  const toggleStrikethrough = () => {
    editor.chain().focus().toggleStrike().run();
  };

  const fontSizeOptions = [12, 14, 16];

  return (
    <div className="border-line-line2 flex h-[46px] items-center border-b px-3 py-[10px]">
      <div className="relative">
        <select
          className="focus-visible:focus-ring flex h-4 w-[48px] cursor-pointer appearance-none text-xs"
          value={editorState.fontSize}
          onChange={(e) => changeFontSize(e.target.value)}
        >
          {fontSizeOptions.map((size) => (
            <option
              key={size}
              value={`${size}px`}
            >
              {size}pt
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2" />
      </div>
      <ToolbarDivider />
      <ToolbarItemGroup>
        <ToolbarButton
          active={editorState.isBold}
          onClick={toggleBold}
        >
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isItalic}
          onClick={toggleItalic}
        >
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isUnderline}
          onClick={toggleUnderline}
        >
          <UnderlineIcon />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isStrikethrough}
          onClick={toggleStrikethrough}
        >
          <StrikethroughIcon />
        </ToolbarButton>
      </ToolbarItemGroup>
    </div>
  );
};

const ToolbarDivider = () => {
  return <div className="bg-line-line1 mx-3 h-full w-[1px]" />;
};

const ToolbarItemGroup = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-3">{children}</div>;
};

type ToolbarButtonProps = React.ComponentPropsWithRef<'button'> & {
  active?: boolean;
};

const ToolbarButton = ({
  className,
  children,
  active = false,
  ...props
}: ToolbarButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        'flex size-5 cursor-pointer items-center justify-center',
        active && 'bg-gray-scale-gray-5',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_2419_7831)">
        <path d="M7.38574 2.88672L4.13574 6.13672L0.885742 2.88672" />
      </g>
      <defs>
        <clipPath id="clip0_2419_7831">
          <rect
            width="8"
            height="8"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const BoldIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M4.5 3.16666H8.33333C9.71404 3.16666 10.8333 4.28594 10.8333 5.66666C10.8333 7.04737 9.71404 8.16666 8.33333 8.16666H4.5V3.16666Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 8.16666H9.16667C10.4553 8.16666 11.5 9.21133 11.5 10.5C11.5 11.7887 10.4553 12.8333 9.16667 12.8333H4.5V8.16666Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ItalicIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.33366 3.16666H7.83366M9.33366 3.16666H10.8337M9.33366 3.16666L6.66699 12.8333M6.66699 12.8333H5.16699M6.66699 12.8333H8.16699"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const UnderlineIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M3.16699 12.8333H12.8337"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.8337 3.16666V7.33332C10.8337 8.89813 9.56513 10.1667 8.00033 10.1667C6.43552 10.1667 5.16699 8.89813 5.16699 7.33332V3.16666"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const StrikethroughIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.16699 8.16668H12.8337M12.167 5.50001V5.33334C12.167 4.22877 11.2716 3.33334 10.167 3.33334H5.83366C4.72909 3.33334 3.83366 4.22877 3.83366 5.33334V6.16668C3.83366 7.27125 4.72909 8.16668 5.83366 8.16668H10.0003M3.83366 10.5V10.8333C3.83366 11.9379 4.72909 12.8333 5.83366 12.8333H10.167C11.2716 12.8333 12.167 11.9379 12.167 10.8333V9.83334"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
