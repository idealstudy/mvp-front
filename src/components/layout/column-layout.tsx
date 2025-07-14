import { cn } from '@/lib/utils';

type ColumnLayoutProps = React.ComponentPropsWithRef<'div'>;

const ColumnLayout = ({ className, children, ...props }: ColumnLayoutProps) => {
  return (
    <main
      className={cn(
        'desktop:flex-row flex w-full flex-col gap-5 py-10',
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
};

type ColumnLayoutStickyProps = React.ComponentPropsWithRef<'section'>;

const ColumnLayoutLeft = ({
  className,
  children,
  ...props
}: ColumnLayoutStickyProps) => {
  return (
    <section
      className={cn(
        'desktop:w-[360px] desktop:sticky top-[calc(var(--spacing-header-height)+40px)]',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};
type ColumnLayoutRightProps = React.ComponentPropsWithRef<'section'>;

const ColumnLayoutRight = ({
  className,
  children,
  ...props
}: ColumnLayoutRightProps) => {
  return (
    <section
      className={cn('desktop:w-[600px]', className)}
      {...props}
    >
      {children}
    </section>
  );
};

ColumnLayout.Left = ColumnLayoutLeft;
ColumnLayout.Right = ColumnLayoutRight;

export { ColumnLayout };
