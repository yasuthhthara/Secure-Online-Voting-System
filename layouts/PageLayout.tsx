import Header from '@/Components/Header'
import { getCurrentUser } from '@/firebase/utils/authnticationUtils'
import { getDataFromCollection } from '@/firebase/utils/databaseUtils'
import IUser from '@/interfaces/IUser'
import React, { useEffect, useState } from 'react'

const PageLayout = ({children, title,}: {children: JSX.Element | string, title: string}) => {

  useEffect(() => {
    getCurrentUser((user) => {
        setUser(user);
    });
  }, []);

  const [user, setUser] = useState<IUser>();
  const [nic, setNIC] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    checkUserProfile();
  }, [user])

  const checkUserProfile = () => {
    if(user) {
      getDataFromCollection("Users").then((regUsers) => {
        regUsers.forEach((regUser: { userID: string | null | undefined, nic: string | null }) => {
          if(regUser.userID === user.uid) {
            setIsCompleted(true)
            setNIC(regUser.nic)
          }
        });
      }).catch((e) => {
        console.error(e)
      })
    }
  }

  return (
    <div className='h-screen flex-1 flex flex-col bg-[#101010]'>
        <Header email={user?.email? user.email: ''} name={user&& user.displayName} isCompletedProfile = {isCompleted} idNumber={nic} title={title} />
        <section className='flex-1'>
            {children}
        </section>
    </div>
  )
}

export default PageLayout