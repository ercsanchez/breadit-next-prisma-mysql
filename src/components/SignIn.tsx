'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { Icons } from './Icons';
import UserAuthForm from './UserAuthForm';

const SignIn: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you agree to our User Agreement and Privacy Policy.
        </p>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-zinc-700">
          New to breadit?{'  '}
          <Link
            href="/sign-up"
            className="hover:text-zinc-800 text-sm underline underline-offset-4"
            onClick={(e) => {
              e.preventDefault();
              // const urlHistory = document.referrer;
              router.replace('/sign-up');
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
