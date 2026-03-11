// 텍스트 추출 함수

export const toPlainText = (node: unknown): string => {
  if (typeof node === 'string') {
    try {
      return toPlainText(JSON.parse(node));
    } catch {
      return node.trim();
    }
  }

  const buf: string[] = [];
  JSON.stringify(node, (key, value) => {
    if (key === 'text' && typeof value === 'string') buf.push(value);
    return value;
  });

  return buf.join('').trim();
};
