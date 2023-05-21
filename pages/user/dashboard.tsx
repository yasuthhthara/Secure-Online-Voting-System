import { getCurrentUser, verifyIfUserIsEnrolled } from '@/firebase/utils/authnticationUtils';
import IUser from '@/interfaces/IUser';
import PageLayout from '@/layouts/PageLayout';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const dashboard = () => {
    
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
      getCurrentUser((user) => {
          setUser(user);
      });
    }, []);

    const handleVote = () => {
      if (user) {
        if (verifyIfUserIsEnrolled(user)) {
          router.push('/vote')
        } else {
          router.push('/user/number-input')
        }
      } else {
        console.error('User not found')
      }
    }

  return (
    <PageLayout title='Dashboard'>
        <div className='m-3 flex flex-col bg-gray-600/25 rounded-t-lg'>
          <div className='flex p-2 justify-center text-xl font-medium text-white'>Active Sessions</div>
          <button onClick={() => handleVote()}>Start vote</button>
        </div>
    </PageLayout>
  )
}

export default dashboard