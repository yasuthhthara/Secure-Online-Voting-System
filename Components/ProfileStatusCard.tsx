import React from 'react'
import ReportIcon from '@mui/icons-material/Report';

type Props = {
    title: string | null;
    subtitle: string | null;
    isCompletedProfile?: boolean;
    warning?: boolean;
}

const ProfileStatusCard = ({title, isCompletedProfile = false, subtitle, warning = false}: Props) => {
  return (
    <div className={`flex space-x-3 px-4 py-2 text-center bg-gray-50/20 hover:bg-gray-50/25 cursor-pointer duration-300 rounded-lg border-2 ${isCompletedProfile? 'border-emerald-500': 'border-red-500'}`}>
        {warning&& 
            <section className='flex w-9'>
                <ReportIcon className='fill-red-500 w-full h-full' />
            </section>
        }
        <section className='flex flex-col'>
            <span className='text-base font-medium text-white'>{title}</span>
            <span className='text-xs text-gray-50/60'>{subtitle}</span>
        </section>
    </div>
  )
}

export default ProfileStatusCard