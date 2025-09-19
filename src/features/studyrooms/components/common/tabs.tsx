import { cn } from '@/lib/utils';
import { Tabs as TabsPrimitives } from 'radix-ui';

type TabsProps = TabsPrimitives.TabsProps;

const Tabs = ({ ...props }: TabsProps) => {
  return <TabsPrimitives.Root {...props} />;
};

type TabsTriggerProps = TabsPrimitives.TabsTriggerProps;

const TabsTrigger = ({ className, children, ...props }: TabsTriggerProps) => {
  return (
    <TabsPrimitives.Trigger
      className={cn(
        'group border-line-line1 relative flex h-[55px] min-w-[170px] cursor-pointer items-center justify-center gap-2 rounded-t-[12px] border border-b-0 px-5',
        'text-text-sub2 text-lg',
        'bg-transparent',
        '[&>svg]:text-text-inactive data-[state=active]:[&>svg]:text-key-color-primary',
        'data-[state=active]:text-key-color-primary data-[state=active]:bg-gray-scale-white data-[state=active]:font-semibold',
        className
      )}
      {...props}
    >
      {children}
      <span
        role="presentation"
        className="bg-gray-scale-white absolute right-0 -bottom-[1px] left-0 hidden h-[1px] group-data-[state=active]:flex"
      />
    </TabsPrimitives.Trigger>
  );
};

type TabsListProps = TabsPrimitives.TabsListProps;

const TabsList = ({ className, children, ...props }: TabsListProps) => {
  return (
    <TabsPrimitives.List
      className={cn('flex gap-2', className)}
      {...props}
    >
      {children}
    </TabsPrimitives.List>
  );
};

Tabs.Trigger = TabsTrigger;
Tabs.List = TabsList;
Tabs.Content = TabsPrimitives.Content;

export { Tabs };
