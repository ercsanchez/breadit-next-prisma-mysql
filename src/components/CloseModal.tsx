'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import { Button } from './ui/Button';

const CloseModal = ({}) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      variant="subtle"
      className="h-6 w-6 p-0 rounded-md"
    >
      <X aria-label="close modal" className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;
