'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateStudyRoomList() {
  revalidatePath('/list/study-rooms');
}
