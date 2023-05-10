import Header from '@/Components/Header'
import useCurrentUser from '@/hooks/AuthenticationHooks/useCurrentUser'
import IUser from '@/interfaces/IUser'
import React from 'react'

const PageLayout = ({children, title,}: {children: JSX.Element | string, title: string}) => {

  const user: IUser | undefined = useCurrentUser()

  return (
    <div className='h-screen flex-1 flex flex-col bg-[#101010]'>
        <Header email={user?.email? user.email: ''} name={user&& user.displayName} isCompletedProfile = {false} idNumber={null} title={title} />
        <section className='flex-1'>
            {children}
        </section>
    </div>
  )
}

export default PageLayout