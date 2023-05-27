import CommonButton from '@/Components/CommonButton';
import MFA from '@/Components/MFA';
import SessionCard from '@/Components/SessionCard';
import { enrollUser, getCurrentUser, verifyIfUserIsEnrolled, verifyPhoneNumber } from '@/firebase/utils/authnticationUtils';
import { getDataFromCollection } from '@/firebase/utils/databaseUtils';
import useRecaptcha from '@/hooks/AuthenticationHooks/useRecaptcha';
import { ISession } from '@/interfaces/ISession';
import PageLayout from '@/layouts/PageLayout';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const dashboard = () => {
    
    const [user, setUser] = useState<User | null>(null);
    const [mfaPop, setMfaPop] = useState<boolean>(false);
    const [verificationID, setVerificationID] = useState<string>('');
    const [sessions, setSessions] = useState<ISession[]>([]);

    const router = useRouter();
    const recaptcha = useRecaptcha('dashboard-enroll');

    useEffect(() => {
      getCurrentUser((user) => {
          setUser(user);
      });

      getDataFromCollection("Sessions").then((res) => {
        setSessions(res)
      }).catch((e) => {
        console.error(e)
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
          router.push('/user/dashboard');
        } else {
          console.error("Not matching")
        }
      } else {
          console.error("cannot verify")
      }
    }

  return (
    <PageLayout title={user?.uid === 'UXeFlR4Z69f1IvnMrImu0JkVV4c2'? 'Admin Dashboard': 'Dashboard'}>
        {user?.uid != 'UXeFlR4Z69f1IvnMrImu0JkVV4c2'?
        <div className='m-3 flex flex-col bg-gray-600/25 rounded-t-lg'>
          <div className='flex p-2 justify-center text-xl font-medium text-white'>Active Sessions</div>
          <div className='space-y-2 px-2 py-4'>
            {sessions.map((session, idx) => (
                <SessionCard key={idx} description={session.description} name={session.name} endDate={session.endDate} startDate={session.startDate}>
                  <CommonButton title='Start Voting' type='button' onClick={() => router.push(`/sessions/voting/${session.id}`)} />
                </SessionCard>
            ))}
          </div>
          <MFA onSubmit={(code) => handleSubmit(code)} setOpen={setMfaPop} open = {mfaPop} />
          <div id='dashboard-enroll'></div>
        </div>: 
        <div>
          <div className='m-3 flex flex-col bg-gray-600/25 rounded-t-lg'>
            <div className='flex p-2 justify-center text-xl font-medium text-white'>Sessions</div>
            <section>
              <div className='w-full flex justify-end px-4 py-3'>
                <CommonButton type='button' title='Create Session' onClick={() => router.push('/admin/create-session')} />
              </div>
              <div className='space-y-2 px-2 py-4'>
                {sessions.map((session, idx) => (
                  <SessionCard key={idx} description={session.description} name={session.name} endDate={session.endDate} startDate={session.startDate} >
                    <CommonButton title='View Results' type='button' onClick={() => router.push('/sessions/results/' + session.id)} />
                  </SessionCard>
                ))}
              </div>
            </section>
            <div id='dashboard-enroll'></div>
          </div>
        </div>}
    </PageLayout>
  )
}

export default dashboard