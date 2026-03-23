type Props = {
  params: Promise<{ id: string }>;
};

export default async function ColumnEditPage({ params }: Props) {
  const { id } = await params;
  const columnId = Number(id);

  return <div>{columnId}</div>;
}
