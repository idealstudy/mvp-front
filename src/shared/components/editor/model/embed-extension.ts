import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { EmbedNode } from '../ui/embed-node';

export interface EmbedOptions {
  HTMLAttributes: Record<string, unknown>;
}

export type EmbedType =
  | 'youtube'
  | 'vimeo'
  | 'twitter'
  | 'instagram'
  | 'generic';

export interface EmbedAttributes {
  url: string;
  type: EmbedType;
  embedUrl?: string;
  title?: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embed: {
      setEmbed: (options: EmbedAttributes) => ReturnType;
    };
  }
}

// URL에서 임베드 타입과 ID 추출
export const parseEmbedUrl = (
  url: string
): { type: EmbedType; embedUrl: string } | null => {
  try {
    const urlObj = new URL(url);

    // YouTube
    if (
      urlObj.hostname.includes('youtube.com') ||
      urlObj.hostname.includes('youtu.be')
    ) {
      let videoId: string | null = null;

      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get('v');
      }

      if (videoId) {
        return {
          type: 'youtube',
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
        };
      }
    }

    // Vimeo
    if (urlObj.hostname.includes('vimeo.com')) {
      const match = urlObj.pathname.match(/\/(\d+)/);
      if (match) {
        return {
          type: 'vimeo',
          embedUrl: `https://player.vimeo.com/video/${match[1]}`,
        };
      }
    }

    return null;
  } catch {
    return null;
  }
};

export const getEmbedTypeFromUrl = (embedUrl: string): EmbedType => {
  const normalized = embedUrl.toLowerCase();

  if (normalized.includes('youtube.com') || normalized.includes('youtu.be')) {
    return 'youtube';
  }

  if (normalized.includes('vimeo.com')) {
    return 'vimeo';
  }

  if (normalized.includes('twitter.com') || normalized.includes('x.com')) {
    return 'twitter';
  }

  if (normalized.includes('instagram.com')) {
    return 'instagram';
  }

  return 'generic';
};

export const Embed = Node.create<EmbedOptions>({
  name: 'embed',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      url: {
        default: null,
      },
      type: {
        default: 'generic',
      },
      embedUrl: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="embed"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'embed',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedNode);
  },

  addCommands() {
    return {
      setEmbed:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
