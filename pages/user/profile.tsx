import InputField from '@/Components/InputField'
import { IProfileFormInputs } from '@/FormTypes/profileCompleteFormTypes'
import { getCurrentUser } from '@/firebase/utils/authnticationUtils'
import { createData } from '@/firebase/utils/databaseUtils'
import PageLayout from '@/layouts/PageLayout'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

const profile = () => {

    useEffect(() => {
        getCurrentUser((user) => {
            setEmail(user.email)
            setUsername(user.displayName)
        })
    }, [])

    const [fName, setFName] = useState<string>('');
    const [lName, setFLame] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [nic, setNIC] = useState<string>('');
    const [birthday, setBirthday] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const createUser = () => {
        const userInfo = {
            firstName: fName,
            lastName: lName,
            username: username,
            nic: nic,
            birthday: birthday,
            mobileNo: mobile,
            address: address,
            email: email
        }
        // createData("Users", userInfo, (res) => console.log("Submitted"), (e) => console.error(e));
        console.log(userInfo)
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
                        <InputField error = {errors.NIC? true: false} register={register} required idLabel='NIC' onChange={(text) => setNIC(text)} value={nic} label='NIC Number' type='text' helperText='This Field is Required' />
                        <InputField error = {errors.Birthday? true: false} register={register} required idLabel='Birthday' onChange={(text) => setBirthday(text)} value={birthday} label='Birthday' type='date' helperText='This Field is Required' />
                        <InputField error = {errors.Mobile? true: false} register={register} required idLabel='Mobile' onChange={(text) => setMobile(text)} value={mobile} label='Mobile Number' type='text' helperText='This Field is Required' />
                        <InputField error = {errors.residentialAddress? true: false} register={register} required idLabel='residentialAddress' onChange={(text) => setAddress(text)} value={address} label='Residential Address' type='text' helperText='This Field is Required' />
                        <InputField error = {errors.emailAddress? true: false} register={register} idLabel='emailAddress' onChange={(text) => setEmail(text)} value={email} label='Email Address' type='text' helperText='This Field is Required' />
                        <div className='pt-4 flex justify-end'>
                            <button type='submit' className='py-2 text-white bg-blue-500 rounded-full px-7'>Submit Details</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </PageLayout>
  )
}

export default profile