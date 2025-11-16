import type { Preview } from '@storybook/react';

import '../src/shared/components/editor/styles/text-editor.css';
import './index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
