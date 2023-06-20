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

    if (subscriptionExists)
      return new Response("You've already subscribed to this subreddit", {
        status: 400,
      });

    // create record if not yet subscribed
    await db.subscription.create({
      data: {
        subredditId,
        userId: session.user.id,
      },
    });

    return new Response(subredditId);
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response(err.message, { status: 400 });

    return new Response(
      'Could not subscribe to subreddit at this time. Please try later',
      { status: 500 },
    );
  }
}
