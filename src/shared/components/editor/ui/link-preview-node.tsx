'use client';

import { useState } from 'react';

import Image from 'next/image';

import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { ExternalLink, Globe, Loader2, X } from 'lucide-react';

import { LinkPreviewAttributes } from '../model/link-preview-extension';

export const LinkPreviewNode = ({
  node,
  deleteNode,
  editor,
}: NodeViewProps) => {
  const attrs = node.attrs as LinkPreviewAttributes;
  const { url, title, description, image, siteName, loading } = attrs;
  const [imageError, setImageError] = useState(false);

  const handleOpenLink = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = () => {
    deleteNode();
  };

  const isEditable = editor.isEditable;

  if (loading) {
    return (
      <NodeViewWrapper className="link-preview-wrapper my-2">
        <div
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          contentEditable={false}
        >
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          <span className="text-sm text-gray-500">
            링크 정보를 불러오는 중...
          </span>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="link-preview-wrapper my-2">
      <div
        className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        contentEditable={false}
      >
        {isEditable && (
          <button
            type="button"
            onClick={handleDelete}
            className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-900/80"
            title="삭제"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        <button
          type="button"
          onClick={handleOpenLink}
          className="flex w-full items-center text-left"
        >
          {image && !imageError && (
            <div className="relative hidden h-32 w-32 shrink-0 overflow-hidden sm:block">
              <Image
                src={image}
                alt={title || '링크 미리보기'}
                fill
                className="object-cover"
                unoptimized
                onError={() => setImageError(true)}
              />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-4">
            {title && (
              <h4 className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {title}
              </h4>
            )}
            {description && (
              <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Globe className="h-3 w-3" />
              <span className="truncate">
                {siteName || new URL(url).hostname}
              </span>
              <ExternalLink className="ml-auto h-3 w-3 shrink-0" />
            </div>
          </div>
        </button>
      </div>
    </NodeViewWrapper>
  );
};
