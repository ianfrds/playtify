'use client';

import { useAudio } from '@/context/AudioContext';

export function Toast() {
  const { toastMessage } = useAudio();

  if (!toastMessage) return null;

  return (
    <div className="toast-container" aria-live="polite">
      <div className="toast">{toastMessage}</div>
    </div>
  );
}

export default Toast;
