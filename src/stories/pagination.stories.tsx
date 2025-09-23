import { useState } from 'react';

import { Pagination } from '@/components/ui/pagination';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ui/Pagination',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1);

    return (
      <Pagination
        page={page}
        onPageChange={setPage}
        totalPages={10}
      />
    );
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = useState(1);

    return (
      <Pagination
        page={page}
        onPageChange={setPage}
        totalPages={30}
      />
    );
  },
};
