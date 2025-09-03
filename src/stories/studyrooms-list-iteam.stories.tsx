import Image from 'next/image';

import { DropdownMenu } from '@/components/ui/dropdown-menu';
import type { Meta, StoryObj } from '@storybook/react';

import { ListItem } from '../features/studyrooms/components/common/list-item';

type ListItemStoryArgs = {
  title: string;
  subtitle: string;
  date: string;
  href: string;
  showTag: boolean;
  tagText: string;
  iconVariant: 'global' | 'student' | 'secret';
  menuItems: string[];
};

const meta: Meta<typeof ListItem> & { argTypes: Record<string, unknown> } = {
  title: 'studyroom/ListItem',
  component: ListItem,
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
  tags: ['autodocs'],
  args: {
    title: 'A반의 007',
    subtitle: '7일 전',
    date: '09/03(수)',
    href: '/',
    showTag: true,
    tagText: '수학 A반',
    iconVariant: 'global',
    menuItems: ['제목수정', '그룹이동하기', '삭제하기'],
  } as ListItemStoryArgs,
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    date: { control: 'text' },
    href: { control: 'text' },

    iconVariant: {
      control: 'select',
      options: ['global', 'student', 'secret'],
      description: '아이콘 프리셋',
    },

    menuItems: {
      control: 'object',
      description: '드롭다운 메뉴 라벨 리스트',
    },

    // ListItem 자체의 슬롯 prop들은 컨트롤에서 숨김
    tag: { table: { disable: true } },
    icon: { table: { disable: true } },
    dropdown: { table: { disable: true } },
    id: { table: { disable: true } },
  },
};
export default meta;

type Story = StoryObj<typeof ListItem>;

// 아이콘 매핑 상수
const ICON_MAPPING = {
  global: '/studynotes/read-global.svg', // 이 경로가 실제 파일과 일치하는지 확인 필요
  student: '/studynotes/read-students.svg',
  secret: '/studynotes/read-secret.svg',
} as const;

// 공통 렌더 헬퍼: args를 받아 실제 JSX 슬롯을 만들어 ListItem에 주입
const renderWithSlots = (args: ListItemStoryArgs) => {
  const {
    title,
    subtitle,
    date,
    href,
    showTag,
    tagText,
    iconVariant,
    menuItems,
  } = args;

  const iconSrc = ICON_MAPPING[iconVariant] ?? '/studynotes/read-global.svg';

  const tag = showTag ? (
    <span className="text-gray-scale-gray-60 bg-gray-scale-gray-5 flex h-5 items-center justify-center rounded-[4px] px-2 py-0.5 text-[10px]">
      {tagText}
    </span>
  ) : null;

  const dropdown = (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Image
          src="/studynotes/gray-kebab.svg"
          width={24}
          height={24}
          alt="menu"
          className="cursor-pointer"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {menuItems?.map((label: string) => (
          <DropdownMenu.Item
            key={label}
            onClick={() => {
              // 메뉴 아이템 클릭 처리
            }}
          >
            {label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );

  const icon = (
    <Image
      src={iconSrc}
      alt="note-icon"
      width={28}
      height={28}
    />
  );

  return (
    <div className="w-[740px]">
      <ListItem
        id={1}
        title={title}
        subtitle={subtitle}
        date={date}
        href={href}
        tag={tag}
        dropdown={dropdown}
        icon={icon}
      />
    </div>
  );
};

export const StudyroomStudyNotesListItem: Story = {
  render: (args) => renderWithSlots(args as unknown as ListItemStoryArgs),
};

export const StudyroomStudentsListItem: Story = {
  render: () => {
    return (
      <div className="w-[740px]">
        <ListItem
          id={1}
          title="김뎨듀"
          tag={
            <div className="flex flex-row items-center gap-2">
              <div className="bg-line-line2 h-[13px] w-px" />
              <span className="font-caption-normal text-key-color-primary">
                보호자 1
              </span>
            </div>
          }
          subtitle="kimdedu@dedu.com"
          date="3일전 가입"
          href="/"
          icon={
            <Image
              src="/invite/invite-type.svg"
              alt="invite-type"
              width={28}
              height={28}
            />
          }
          dropdown={
            <DropdownMenu>
              <DropdownMenu.Trigger>
                <Image
                  src="/studynotes/gray-kebab.svg"
                  width={24}
                  height={24}
                  alt="menu"
                  className="cursor-pointer"
                />
              </DropdownMenu.Trigger>
            </DropdownMenu>
          }
        />
      </div>
    );
  },
};
