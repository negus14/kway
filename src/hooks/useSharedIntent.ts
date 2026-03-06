import {useEffect, useState} from 'react';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';

interface SharedItem {
  text?: string;
  weblink?: string;
}

/**
 * Listens for incoming share intents and returns the first text/URL received.
 * Clears the intent queue after reading to prevent re-processing on re-render.
 */
export function useSharedIntent(): string | null {
  const [sharedText, setSharedText] = useState<string | null>(null);

  useEffect(() => {
    ReceiveSharingIntent.getReceivedFiles(
      (files: SharedItem[]) => {
        if (files && files.length > 0) {
          const item = files[0];
          const text = item.text ?? item.weblink ?? null;
          if (text) {
            setSharedText(text);
          }
        }
      },
      (error: unknown) => {
        console.warn('useSharedIntent error:', error);
      },
      'com.kwayapp', // Android app package name — must match AndroidManifest
    );

    return () => {
      ReceiveSharingIntent.clearReceivedFiles();
    };
  }, []);

  return sharedText;
}
