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
      };
    },
  });

  return (
    <div className="border-line-line2 flex h-[46px] items-center border-b px-3 py-[10px]">
      {JSON.stringify(editorState)}
      <div className="relative">
        <select className="focus-visible:focus-ring flex h-4 w-[48px] cursor-pointer appearance-none text-xs">
          <option value="12">12pt</option>
          <option>14pt</option>
          <option>16pt</option>
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2" />
      </div>
      <ToolbarDivider />
      <ToolbarItemGroup>
        <ToolbarButton>T</ToolbarButton>
        <ToolbarButton>
          <span className="size-4 rounded-full bg-black" />
        </ToolbarButton>
      </ToolbarItemGroup>
      <ToolbarDivider />
      <ToolbarItemGroup>
        <ToolbarButton>B</ToolbarButton>
        <ToolbarButton>I</ToolbarButton>
        <ToolbarButton>U</ToolbarButton>
        <ToolbarButton>S</ToolbarButton>
      </ToolbarItemGroup>
      <ToolbarDivider />
      <ToolbarItemGroup>
        <ToolbarButton>L</ToolbarButton>
        <ToolbarButton>C</ToolbarButton>
        <ToolbarButton>R</ToolbarButton>
      </ToolbarItemGroup>
      <ToolbarItemGroup>
        <ToolbarButton>UL</ToolbarButton>
        <ToolbarButton>OL</ToolbarButton>
      </ToolbarItemGroup>
      <ToolbarItemGroup>
        <ToolbarButton>I</ToolbarButton>
        <ToolbarButton>L</ToolbarButton>
        <ToolbarButton>T</ToolbarButton>
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

type ToolbarButtonProps = React.ComponentPropsWithRef<'button'>;

const ToolbarButton = ({
  className,
  children,
  ...props
}: ToolbarButtonProps) => {
  return (
    <button
      className={cn(
        'flex size-5 cursor-pointer items-center justify-center',
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
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_2419_7831)">
        <path
          d="M7.38574 2.88672L4.13574 6.13672L0.885742 2.88672"
          stroke="currentColor"
        />
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
