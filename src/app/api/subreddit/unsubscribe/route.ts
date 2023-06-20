import { z } from 'zod';

import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubredditSubscriptionValidator } from '@/lib/validators/subreddit';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('please login');
    }

    const reqBody = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(reqBody);

    const subscriptionExists = await db.subscription.findFirst({
      where: { subredditId, userId: session.user.id },
    });

    if (!subscriptionExists)
      return new Response('You are not subscribed to this subreddit.', {
        status: 400,
      });

    // check if user is creator of subreddit
    const subreddit = await db.subreddit.findFirst({
      where: { id: subredditId, creatorId: session.user.id },
    });

    if (subreddit)
      return new Response(`You can't unsubscribe from your own subreddit`, {
        status: 400,
      });

    // delete subscription
    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user.id,
        },
      },
    });

    return new Response(subredditId);
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response(err.message, { status: 400 });

    return new Response(
      'Could not unsubscribe to subreddit at this time. Please try later',
      { status: 500 },
    );
  }
}
