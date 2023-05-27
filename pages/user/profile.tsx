import InputField from '@/Components/InputField'
import MFA from '@/Components/MFA'
import Notification from '@/Components/Notification'
import { IProfileFormInputs } from '@/FormTypes/profileCompleteFormTypes'
import { enrollUser, getCurrentUser, updateUser, verifyEmail, verifyIfUserIsEnrolled, verifyPhoneNumber } from '@/firebase/utils/authnticationUtils'
import { createData, getDataFromCollection } from '@/firebase/utils/databaseUtils'
import useRecaptcha from '@/hooks/AuthenticationHooks/useRecaptcha'
import PageLayout from '@/layouts/PageLayout'
import { User } from 'firebase/auth'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

const profile = () => {

    const [fName, setFName] = useState<string>('');
    const [lName, setFLame] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [nic, setNIC] = useState<string>('');
    const [birthday, setBirthday] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [userID, setUserID] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [verificationID, setVerificationID] = useState<string>('');
    const [mfaPop, setMfaPop] = useState<boolean>(false);
    
    const [notification, setNotification] = useState<{error: boolean, message: string}>();
    const [appear, setAppear] = useState<boolean>(false);

    const router = useRouter();
    const recaptcha = useRecaptcha('profile-enroll');

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
                setAppear(true);
                setNotification({error: true, message: e.message});
        })
    }, [user]);

    const checkIDNumber = async (id: string): Promise<number> => {
        const usersList: IProfileFormInputs[] = await getDataFromCollection("Users");
        return usersList.filter(usr => usr.nic === id).length
    }

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
        checkIDNumber(nic).then((res) => {
            if (res === 0) {
                createData("Users", userInfo, (res) => {setAppear(true); setNotification({error: false, message: "Details Submitted!"})}, (e) => {setAppear(true); setNotification({error: true, message: e.message})});
                handleVerifyPhoneNumber();
            } else {
                setNotification({error: true, message: "Looks like you already have an account"});
                setAppear(true);
            }
        })
    }

    const handleVerifyEmail = async () => {
        if(user) {
            verifyEmail(user).then((res: boolean) => {
                if (res) {
                    alert("Verification email has been sent!")
                } else {
                    setAppear(true);
                    setNotification({error: true, message: "Cannot verify"})
                }
            }).catch((e) => {
                setAppear(true);
                setNotification({error: true, message: e.message});
            })
        }
    }

    const handleVerifyPhoneNumber = async () => {
        if (user) {
            if (verifyIfUserIsEnrolled(user)) {
              router.push('/vote')
            } else {
              if (user && recaptcha) {
                  if (mobile != '') {
                    const verifyID = await verifyPhoneNumber(user, mobile, recaptcha);
                    if (verifyID) {
                      setVerificationID(verifyID)
                      setMfaPop(true)
                    } else {
                        setAppear(true);
                        setNotification({error: true, message: "Cannot Verify Please Log Again!"});
                    }
                  } else {
                    router.push('/user/profile');
                  }
              } else {
                setAppear(true);
                setNotification({error: true, message: "Recaptcha Failed! Try Again!"});
              }
            }
        } else {
            setAppear(true);
            setNotification({error: true, message: "User Not Found! Please Log Again!"});
        }
    }

    const handleVerificationComplete = async (code: string) => {
        if (verificationID != '' && user) {
          const isSuccess: boolean = await enrollUser(user, verificationID, code)
          if (isSuccess) {
            router.push('/user/dashboard');
          } else {
            setAppear(true);
            setNotification({error: true, message: "Invalid Code! Please Log Again!"});
          }
        } else {
            setAppear(true);
            setNotification({error: true, message: "Cannot Verify Please Log Again!"});
        }
    }

    const { register, handleSubmit, formState: {errors} } = useForm<IProfileFormInputs>()
    
  return (
    <PageLayout title='My Profile'>
        <div className='m-3 flex-col bg-gray-600/25 rounded-t-lg'>
            <Notification appear = {appear} setAppear={setAppear} title={notification&& notification.message} error = {notification&& notification.error}  />
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
                            {user&& !user.emailVerified? <button onClick={() => handleVerifyEmail()} type='button' className='py-2 text-white bg-red-700 rounded-full px-7'>Verify Email</button>: <button type='submit' className='py-2 text-white bg-blue-500 rounded-full px-7'>Submit Details</button>}
                            {user&& !verifyIfUserIsEnrolled(user)&& mobile.length === 12 && mobile.substring(0, 3) === "+94"&& <button onClick={() => handleVerifyPhoneNumber()} type='button' className='py-2 text-white bg-red-700 rounded-full px-7'>Verify Phone Number</button>}
                        </div>
                    </form>
                </div>
            </div>
            <MFA onSubmit={(code) => handleVerificationComplete(code)} setOpen={setMfaPop} open = {mfaPop} />
            <div id='profile-enroll'></div>
        </div>
    </PageLayout>
  )
}

export default profile