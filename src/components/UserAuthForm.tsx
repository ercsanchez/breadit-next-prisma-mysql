import { FC } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button size="sm" className="w-full">
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
