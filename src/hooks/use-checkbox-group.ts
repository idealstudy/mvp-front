import { useState } from 'react';

export const useCheckboxGroup = <T extends string>(
  entries: T[],
  initialChecked?: T[]
) => {
  const [checkedItems, setCheckedItems] = useState(initialChecked ?? []);

  const getCheckboxProps = (value: T) => {
    const checked = checkedItems.includes(value);

    const onCheckedChange = (checked: boolean) => {
      setCheckedItems((prev) =>
        checked ? [...prev, value] : prev.filter((item) => item !== value)
      );
    };

    return { checked, onCheckedChange };
  };

  const checkAll = () => {
    setCheckedItems(entries);
  };

  const uncheckAll = () => {
    setCheckedItems([]);
  };

  const toggleAll = () => {
    if (checkedItems.length === entries.length) {
      uncheckAll();
    } else {
      checkAll();
    }
  };

  const isAllChecked = checkedItems.length === entries.length;

  return {
    checkedItems,
    isAllChecked,
    toggleAll,
    getCheckboxProps,
    checkAll,
    uncheckAll,
    setCheckedItems,
  };
};
