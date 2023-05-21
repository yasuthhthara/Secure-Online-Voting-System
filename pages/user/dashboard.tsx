import MFA from '@/Components/MFA';
import { enrollUser, getCurrentUser, verifyIfUserIsEnrolled, verifyPhoneNumber } from '@/firebase/utils/authnticationUtils';
import useRecaptcha from '@/hooks/AuthenticationHooks/useRecaptcha';
import PageLayout from '@/layouts/PageLayout';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const dashboard = () => {
    
    const [user, setUser] = useState<User | null>(null);
    const [mfaPop, setMfaPop] = useState<boolean>(false);
    const [verificationID, setVerificationID] = useState<string>('');
    const router = useRouter();
    const recaptcha = useRecaptcha('dashboard-enroll');

    useEffect(() => {
      getCurrentUser((user) => {
          setUser(user);
      });
    }, []);

    const handleVote = async () => {
      if (user) {
        if (verifyIfUserIsEnrolled(user)) {
          router.push('/vote')
        } else {
          if (user && recaptcha) {
              if (user.phoneNumber) {
                const verifyID = await verifyPhoneNumber(user, user.phoneNumber, recaptcha);
                if (verifyID) {
                  setVerificationID(verifyID);
                  setMfaPop(true);
                } else {
                  console.error('verification ID not found')
                }
              } else {
                console.log(user.displayName)
                router.push('/user/profile');
              }
          } else {
              console.error("Error");
          }
        }
      } else {
        console.error('User not found')
      }
    }

    const handleSubmit = async (code: string) => {
      if (verificationID != '' && user) {
        const isSuccess: boolean = await enrollUser(user, verificationID, code)
        if (isSuccess) {
          router.push('/vote');
        } else {
          console.error("Not matching")
        }
      } else {
          console.error("cannot verify")
      }
    }

  return (
    <PageLayout title='Dashboard'>
        <div className='m-3 flex flex-col bg-gray-600/25 rounded-t-lg'>
          <div className='flex p-2 justify-center text-xl font-medium text-white'>Active Sessions</div>
          <button onClick={() => handleVote()}>Start vote</button>
          <MFA onSubmit={(code) => handleSubmit(code)} setOpen={setMfaPop} open = {mfaPop} />
          <div id='dashboard-enroll'></div>
        </div>
    </PageLayout>
  )
}

export default dashboard