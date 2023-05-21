import React from 'react'
import ProfileStatusCard from './ProfileStatusCard';
import Link from 'next/link';
import ProfileAvatar from './ProfileAvatar';

type Props = {
    title: string;
    name?: string | null;
    idNumber: string | null;
    email: string;
    isCompletedProfile: boolean;
}

const Header = ({idNumber, isCompletedProfile, name = 'Unknown', title, email}: Props) => {
  return (
    <div className='flex justify-between items-center px-4 py-2'>
        <section>
            <span className='text-4xl font-semibold text-white'>{title}</span>
        </section>
        <section className='flex space-x-3'>
            {!isCompletedProfile&& <Link href='/user/profile'><ProfileStatusCard warning title='Complete Profile' subtitle='complete your profile to start voting' /></Link>}
            <span><Link href='/user/dashboard'><ProfileStatusCard title={`Welcome Back, ${name}`} subtitle={isCompletedProfile? idNumber: email} isCompletedProfile = {isCompletedProfile} /></Link></span>
            <span><ProfileAvatar /></span>
        </section>
    </div>
  )
}

export default Header