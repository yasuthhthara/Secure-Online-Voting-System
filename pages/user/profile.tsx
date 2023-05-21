import InputField from '@/Components/InputField'
import { IProfileFormInputs } from '@/FormTypes/profileCompleteFormTypes'
import { getCurrentUser, verifyEmail } from '@/firebase/utils/authnticationUtils'
import { createData, getDataFromCollection } from '@/firebase/utils/databaseUtils'
import PageLayout from '@/layouts/PageLayout'
import { User } from 'firebase/auth'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

const profile = () => {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getCurrentUser((user) => {
            setEmail(user.email)
            setUsername(user.displayName)
            setUserID(user.uid)

            setUser(user)
        });
    }, []);

    useEffect(() => {
        getDataFromCollection("Users")
            .then((usersArray: any) => {
                usersArray.filter((usr: any) => usr.userID === user?.uid).map((profileData: IProfileFormInputs) => {
                    setFName(profileData.firstName);
                    setFLame(profileData.lastName);
                    setNIC(profileData.nic);
                    setBirthday(new Date(profileData.birthday).toISOString().split('T')[0]);
                    setMobile(profileData.mobileNo)
                    setAddress(profileData.address)
                })
            }).catch((e) => {
                console.log(e.message)
        })
    }, [user])

    const [fName, setFName] = useState<string>('');
    const [lName, setFLame] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [nic, setNIC] = useState<string>('');
    const [birthday, setBirthday] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [userID, setUserID] = useState<string>('');

    const createUser = () => {
        const userInfo = {
            firstName: fName,
            lastName: lName,
            username: username,
            nic: nic,
            birthday: birthday,
            mobileNo: mobile,
            address: address,
            email: email,
            userID: userID
        }
        createData("Users", userInfo, (res) => console.log("Submitted"), (e) => console.error(e));
    }

    const handleVerifyEmail = async () => {
        if(user) {
            verifyEmail(user).then((res: boolean) => {
                if (res) {
                    console.log(res)
                } else {
                    console.error("Cannot verify")
                }
            }).catch((e) => {
                console.error(e.message)
            })
        }
    }

    const { register, handleSubmit, formState: {errors} } = useForm<IProfileFormInputs>()
    
  return (
    <PageLayout title='My Profile'>
        <div className='m-3 flex-col bg-gray-600/25 rounded-t-lg'>
            <span className='flex p-2 justify-center text-xl font-medium text-white'>Profile Information</span>
            <div className='flex bg-gray-600/25 rounded-b-lg p-3'>
                {/* Profile Photo and change button */}
                <section className='flex-grow w-1/3'>

                </section>
                <div className='flex-grow w-2/3'>
                    <form onSubmit={handleSubmit(createUser)} className='grid grid-cols-2 gap-5'>
                        <InputField error = {errors.firstName? true: false} register={register} required idLabel='firstName' onChange={(text) => setFName(text)} value={fName} label='First Name' type='text' helperText='This Field is Required' />
                        <InputField error = {errors.lastName? true: false} register={register} required idLabel='lastName' onChange={(text) => setFLame(text)} value={lName} label='Last Name' type='text' helperText='This Field is Required' />
                        <InputField error = {errors.username? true: false} register={register} idLabel='username' onChange={(text) => setUsername(text)} value={username} label='Username' type='text' helperText='This Field is Required' />
                        <InputField error = {errors.nic? true: false} register={register} required idLabel='nic' onChange={(text) => setNIC(text)} value={nic} label='NIC Number' type='text' helperText='This Field is Required' />
                        <InputField error = {errors.birthday? true: false} register={register} required idLabel='birthday' onChange={(text) => setBirthday(text)} value={birthday} label='Birthday' type='date' helperText='This Field is Required' />
                        <InputField error = {errors.mobileNo? true: false} register={register} required idLabel='mobileNo' onChange={(text) => setMobile(text)} value={mobile} label='Mobile Number' type='text' helperText='This Field is Required' />
                        <InputField error = {errors.address? true: false} register={register} required idLabel='address' onChange={(text) => setAddress(text)} value={address} label='Residential Address' type='text' helperText='This Field is Required' />
                        <InputField error = {errors.emailAddress? true: false} register={register} idLabel='emailAddress' onChange={(text) => setEmail(text)} value={email} label='Email Address' type='text' helperText='This Field is Required' />
                        <div className='pt-4 space-x-2 flex justify-end'>
                            <button type='submit' className='py-2 text-white bg-blue-500 rounded-full px-7'>Submit Details</button>
                            {user&& !user.emailVerified&& <button onClick={() => handleVerifyEmail()} type='button' className='py-2 text-white bg-red-700 rounded-full px-7'>Verify Email</button>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </PageLayout>
  )
}

export default profile