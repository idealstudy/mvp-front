'use client';

import { imageApi } from '@/features/editor/services/api';
import axios from 'axios';

export default function TestPage() {
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const response = await imageApi.presign({
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    });

    axios.put(response.data.uploadUrl, file, {
      headers: response.data.headers,
    });
  };

  return (
    <main>
      <input
        type="file"
        onChange={onFileChange}
      />
    </main>
  );
}
