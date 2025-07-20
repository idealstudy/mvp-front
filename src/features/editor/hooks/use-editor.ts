import { useState } from 'react';

import { TextEditorValue, initialTextEditorValue } from '../utils';

export const useTextEditor = (initialValue = initialTextEditorValue) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (value: TextEditorValue) => {
    setValue(value);
  };

  return {
    value,
    onChange,
  };
};
