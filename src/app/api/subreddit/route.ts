import { z } from 'zod';

import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubredditValidator } from '@/lib/validators/subreddit';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name } = SubredditValidator.parse(body);

    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExists) {
      return new Response('Subreddit already exists!', { status: 409 });
    }

    const subreddit = await db.subreddit.create({
      data: { name, creatorId: session.user.id },
    });

    // creator has to be subscribed
    await db.subscription.create({
      data: { subredditId: subreddit.id, userId: session.user.id },
    });

    return new Response(subreddit.name);
  } catch (err) {
    if (err instanceof z.ZodError) {
      // console.error(err);
      return new Response(err.message, { status: 422 }); // p
    }

    return new Response('Could not create subreddit.', { status: 500 });
  }
}
