import { cn } from '@/lib/utils';
import { Editor, useEditorState } from '@tiptap/react';
import { Select as SelectPrimitives } from 'radix-ui';

type ToolbarProps = {
  editor: Editor;
};

const FONT_SIZE_OPTIONS = [12, 14, 16] as const;

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
        isOrderedList: ctx.editor.isActive('orderedList'),
        isBulletList: ctx.editor.isActive('bulletList'),
        isTextAlignLeft: ctx.editor.isActive({ textAlign: 'left' }),
        isTextAlignCenter: ctx.editor.isActive({ textAlign: 'center' }),
        isTextAlignRight: ctx.editor.isActive({ textAlign: 'right' }),
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

  const toggleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  const toggleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  const toggleTextAlignment = (alignment: 'left' | 'center' | 'right') => {
    editor.chain().focus().toggleTextAlign(alignment).run();
  };

  return (
    <div className="border-line-line2 flex h-[46px] items-center overflow-x-auto border-b">
      <ToolbarItemGroup>
        <div className="relative flex items-center gap-1">
          <FontSizeSelect
            value={editorState.fontSize}
            onValueChange={changeFontSize}
          >
            {FONT_SIZE_OPTIONS.map((size) => (
              <FontSizeSelect.Option
                key={size}
                value={`${size}px`}
              >
                {size}
              </FontSizeSelect.Option>
            ))}
          </FontSizeSelect>
        </div>
      </ToolbarItemGroup>
      <ToolbarDivider />
      <ToolbarItemGroup>
        <button
          className={cn(
            'flex cursor-pointer items-center justify-center gap-[6px] text-xs',
            'disabled:opacity-50'
          )}
          disabled
        >
          글자색
          <span className="size-4 rounded-full bg-black" />
        </button>
      </ToolbarItemGroup>
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
      <ToolbarDivider />
      <ToolbarItemGroup>
        <ToolbarButton
          active={editorState.isTextAlignLeft}
          onClick={() => toggleTextAlignment('left')}
        >
          <AlignLeftIcon />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isTextAlignCenter}
          onClick={() => toggleTextAlignment('center')}
        >
          <AlignCenterIcon />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isTextAlignRight}
          onClick={() => toggleTextAlignment('right')}
        >
          <AlignRightIcon />
        </ToolbarButton>
      </ToolbarItemGroup>
      <ToolbarDivider />
      <ToolbarItemGroup>
        <ToolbarButton
          active={editorState.isBulletList}
          onClick={toggleBulletList}
          disabled
        >
          <BulletListIcon />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isOrderedList}
          onClick={toggleOrderedList}
          disabled
        >
          <ListIcon />
        </ToolbarButton>
      </ToolbarItemGroup>
      <ToolbarDivider />
      <ToolbarItemGroup>
        <ToolbarButton disabled>
          <ImageIcon />
        </ToolbarButton>
        <ToolbarButton disabled>
          <LinkIcon />
        </ToolbarButton>
      </ToolbarItemGroup>
    </div>
  );
};

const ToolbarDivider = () => {
  return <div className="bg-line-line1 h-full w-[1px]" />;
};

const ToolbarItemGroup = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-3 px-3">{children}</div>;
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
        'flex size-5 cursor-pointer items-center justify-center rounded-[4px]',
        'hover:bg-background-gray',
        'disabled:pointer-events-none disabled:opacity-50',
        active && 'bg-background-orange hover:bg-orange-scale-orange-5',
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

const AlignLeftIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.1665 5.83325H11.4998M5.1665 14.1666H11.4998M5.1665 9.99992H14.8332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const AlignCenterIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.1665 5.83325H12.8332M7.1665 14.1666H12.8332M5.1665 9.99992H14.8332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const AlignRightIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.49984 5.83325H14.8332M8.49984 14.1666H14.8332M5.1665 9.99992H14.8332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const BulletListIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.875 7.75C3.91053 7.75 4.75 6.91053 4.75 5.875C4.75 4.83947 3.91053 4 2.875 4C1.83947 4 1 4.83947 1 5.875C1 6.91053 1.83947 7.75 2.875 7.75Z"
        fill="currentColor"
      />
      <path
        d="M2.875 16.5C3.91053 16.5 4.75 15.6605 4.75 14.625C4.75 13.5895 3.91053 12.75 2.875 12.75C1.83947 12.75 1 13.5895 1 14.625C1 15.6605 1.83947 16.5 2.875 16.5Z"
        fill="currentColor"
      />
      <path
        d="M8.5 14.625C8.5 14.2798 8.77982 14 9.125 14H16.625C16.9702 14 17.25 14.2798 17.25 14.625C17.25 14.9702 16.9702 15.25 16.625 15.25H9.125C8.77982 15.25 8.5 14.9702 8.5 14.625ZM8.5 5.875C8.5 5.52982 8.77982 5.25 9.125 5.25H16.625C16.9702 5.25 17.25 5.52982 17.25 5.875C17.25 6.22018 16.9702 6.5 16.625 6.5H9.125C8.77982 6.5 8.5 6.22018 8.5 5.875Z"
        fill="currentColor"
      />
    </svg>
  );
};

const ListIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 14.375C10 14.0298 10.2798 13.75 10.625 13.75H18.125C18.4702 13.75 18.75 14.0298 18.75 14.375C18.75 14.7202 18.4702 15 18.125 15H10.625C10.2798 15 10 14.7202 10 14.375ZM10 5.625C10 5.27982 10.2798 5 10.625 5H18.125C18.4702 5 18.75 5.27982 18.75 5.625C18.75 5.97018 18.4702 6.25 18.125 6.25H10.625C10.2798 6.25 10 5.97018 10 5.625ZM5.625 7.5C5.27982 7.5 5 7.22018 5 6.875V3.125C5 2.77982 4.72018 2.5 4.375 2.5H4.0625C3.88991 2.5 3.75 2.63991 3.75 2.8125C3.75 2.98509 3.61009 3.125 3.4375 3.125H3.125C2.77982 3.125 2.5 3.40482 2.5 3.75C2.5 4.09518 2.77982 4.375 3.125 4.375C3.47018 4.375 3.75 4.65482 3.75 5V6.875C3.75 7.22018 3.47018 7.5 3.125 7.5C2.77982 7.5 2.5 7.77982 2.5 8.125C2.5 8.47018 2.77982 8.75 3.125 8.75H5.625C5.97018 8.75 6.25 8.47018 6.25 8.125C6.25 7.77982 5.97018 7.5 5.625 7.5ZM6.25 16.875C6.25 17.2202 5.97018 17.5 5.625 17.5H4.375C3.33947 17.5 2.5 16.6605 2.5 15.625V15C2.5 14.6685 2.6317 14.3505 2.86612 14.1161C3.10054 13.8817 3.41848 13.75 3.75 13.75H4.375C4.72018 13.75 5 13.4702 5 13.125C5 12.7798 4.72018 12.5 4.375 12.5H3.125C2.77982 12.5 2.5 12.2202 2.5 11.875C2.5 11.5298 2.77982 11.25 3.125 11.25H5C5.33152 11.25 5.64946 11.3817 5.88388 11.6161C6.1183 11.8505 6.25 12.1685 6.25 12.5V13.75C6.25 14.0815 6.1183 14.3995 5.88388 14.6339C5.64946 14.8683 5.33152 15 5 15H4.375C4.02982 15 3.75 15.2798 3.75 15.625C3.75 15.9702 4.02982 16.25 4.375 16.25H5.625C5.97018 16.25 6.25 16.5298 6.25 16.875Z"
        fill="currentColor"
      />
    </svg>
  );
};

const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.1665 12.6667L6.9973 10.3379C7.51644 9.67749 8.50952 9.65589 9.05689 10.2931L10.6665 12.1667M9.27653 10.5487C9.96797 9.66919 10.9314 8.42312 10.9941 8.34204L11.0007 8.33352C11.5208 7.6774 12.5107 7.65729 13.0569 8.29306L14.6665 10.1667M6.49984 5.16675H13.4998C14.2362 5.16675 14.8332 5.7637 14.8332 6.50008V13.5001C14.8332 14.2365 14.2362 14.8334 13.4998 14.8334H6.49984C5.76346 14.8334 5.1665 14.2365 5.1665 13.5001V6.50008C5.1665 5.7637 5.76346 5.16675 6.49984 5.16675Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.167 10.8334L14.0003 10.0001C15.1049 8.89549 15.1049 7.10463 14.0003 6.00006C12.8957 4.89549 11.1049 4.89549 10.0003 6.00006L9.16697 6.83339M6.83364 9.16672L6.0003 10.0001C4.89573 11.1046 4.89573 12.8955 6.0003 14.0001C7.10487 15.1046 8.89573 15.1046 10.0003 14.0001L10.8336 13.1667M11.5003 8.50006L8.5003 11.5001"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

type FontSizeSelectProps = SelectPrimitives.SelectTriggerProps & {
  value: string;
  onValueChange: (value: string) => void;
};

const FontSizeSelect = ({
  className,
  children,
  value,
  onValueChange,
  ...props
}: FontSizeSelectProps) => {
  return (
    <SelectPrimitives.Root
      value={value}
      onValueChange={onValueChange}
    >
      <SelectPrimitives.Trigger
        className={cn(
          'focus-visible:focus-ring flex cursor-pointer items-center gap-1 text-sm',
          className
        )}
        {...props}
      >
        <SelectPrimitives.Value>{value.slice(0, -2)}pt</SelectPrimitives.Value>
        <SelectPrimitives.Icon asChild>
          <ChevronDownIcon />
        </SelectPrimitives.Icon>
      </SelectPrimitives.Trigger>
      <SelectPrimitives.Portal>
        <SelectPrimitives.Content
          className="border-line-line1 bg-gray-scale-white flex flex-col rounded-[4px] border"
          position="popper"
          align="center"
          sideOffset={4}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <SelectPrimitives.Viewport>{children}</SelectPrimitives.Viewport>
        </SelectPrimitives.Content>
      </SelectPrimitives.Portal>
    </SelectPrimitives.Root>
  );
};

type FontSizeSelectOptionProps = SelectPrimitives.SelectItemProps;

const FontSizeSelectOption = ({
  className,
  children,
  ...props
}: FontSizeSelectOptionProps) => {
  return (
    <SelectPrimitives.Item
      className={cn(
        'font-label-normal text-text-main flex h-[26px] w-[52px] cursor-pointer items-center justify-center outline-none',
        'focus:bg-background-gray',
        'data-[state=checked]:bg-background-orange data-[state=checked]:text-key-color-primary',
        className
      )}
      {...props}
    >
      <SelectPrimitives.ItemText className="pointer-events-none">
        {children}pt
      </SelectPrimitives.ItemText>
    </SelectPrimitives.Item>
  );
};

FontSizeSelect.Option = FontSizeSelectOption;
