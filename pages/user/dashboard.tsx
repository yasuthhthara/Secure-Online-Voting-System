import useCurrentUser from '@/hooks/AuthenticationHooks/useCurrentUser';
import IUser from '@/interfaces/IUser';
import PageLayout from '@/layouts/PageLayout';
import React from 'react'

const dashboard = () => {
    
    const user: IUser | undefined = useCurrentUser()

  return (
    <PageLayout title='Dashboard'>
        <div className='m-3 flex flex-col bg-gray-600/25 rounded-t-lg'>
          <div className='flex p-2 justify-center text-xl font-medium text-white'>Active Sessions</div>
        </div>
    </PageLayout>
  )
}

export default dashboard