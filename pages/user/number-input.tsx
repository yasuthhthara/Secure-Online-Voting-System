import { enrollUser, getCurrentUser, verifyEmail, verifyPhoneNumber } from '@/firebase/utils/authnticationUtils';
import useRecaptcha from '@/hooks/AuthenticationHooks/useRecaptcha'
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, {useState, useEffect} from 'react'

type Props = {

}

const numberInput = (props: Props) => {

    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [verificationID, setVerificationID] = useState<string>('');
    const [user, setUser] = useState<User>();

    const recaptcha = useRecaptcha('sign-up');
    const router = useRouter();

    useEffect(() => {
        getCurrentUser((user) => {
            setUser(user);
        });
    }, []);

    const handleClick = async () => {
        if (user && recaptcha) {
            const verifiID = await verifyPhoneNumber(user, phoneNumber, recaptcha);
            if (verifiID) {
                setVerificationID(verifiID)
            } else {
                console.error("cannot verify")
            }
        } else {
            console.error("Error");
        }
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

    const handleSubmit = async () => {
        if (user) {
            const isSuccess: boolean = await enrollUser(user, verificationID, verificationCode)
             if (isSuccess) {
                console.log(isSuccess)
             } else {
                console.error("Not matching")
             }
        } else {
            console.error('user not found')
        }
    }
    

  return (
    <>
        <input onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} placeholder='number' />
        <button onClick={() => handleClick()}>submit</button>
        {verificationID != ''&& <input placeholder='verification code' value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />}
        <button disabled = {verificationID === ''} onClick={() => handleSubmit()}>submit verification code</button>
        {!user?.emailVerified&& <button onClick={() => handleVerifyEmail()}>Verify Email</button>}
        <div id='sign-up'></div>
    </>
  )
}

export default numberInput