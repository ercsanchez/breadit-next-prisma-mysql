'use client';

import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { Button } from './ui/Button';
import { useToast } from '@/hooks/use-toast';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean;
  subredditId: string;
  subredditName: string;
}

const SubscribeLeaveToggle = ({
  isSubscribed,
  subredditId,
  subredditName,
}: SubscribeLeaveToggleProps) => {
  const { toast } = useToast();
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubscribeLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post('/api/subreddit/subscribe', payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: 'There was a problem.',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: 'Subscribed!',
        description: `You are now subscribed to r/${subredditName}`,
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnsubscribeLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post('/api/subreddit/unsubscribe', payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: 'There was a problem.',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: 'Unsubscribed!',
        description: `You are now unsubscribed from r/${subredditName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isSubscribed ? isUnsubscribeLoading : isSubscribeLoading}
      onClick={() => {
        isSubscribed ? unsubscribe() : subscribe();
      }}
    >
      {isSubscribed ? 'Leave community' : 'Join to post'}
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isSubscribeLoading}
      onClick={() => subscribe()}
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
