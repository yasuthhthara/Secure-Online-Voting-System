import MFA from '@/Components/MFA';
import { finaliseLoginEnrollment, loginUser, resolveSignIn } from '@/firebase/utils/authnticationUtils';
import useRecaptcha from '@/hooks/AuthenticationHooks/useRecaptcha';
import PageLayout from '@/layouts/PageLayout'
import { MultiFactorResolver } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

type Props = {}

const login = (props: Props) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaPop, setMfaPop] = useState<boolean>(false);
  const [verificationID, setVerificationID] = useState<string>('');
  const [MFAResolver, setMFAResolver] = useState<MultiFactorResolver>();

  const router = useRouter()
  const reCaptcha = useRecaptcha('sign-in');

  const handleFirebaseMFA = async (error: any) => {
    if (error.code == 'auth/multi-factor-auth-required' && reCaptcha) {
      const data = await resolveSignIn(error, reCaptcha)

      if (data) {
        const {verificationID, resolver} = data;
        setVerificationID(verificationID);
        setMFAResolver(resolver);
        setMfaPop(true);
      } else {
        console.error("Error")
      }
    } else {
      console.error(error.message)
    }
  }

  const onSubmitCode = (code: string) => {
    if (MFAResolver) {
      const isSuccess = finaliseLoginEnrollment(verificationID, MFAResolver, code);
      if (isSuccess) {
        router.push('/user/dashboard')
      } else {
        console.error('Verification Code Invalid')
      }
    } else {
      console.error('resolver not found')
    }
  }

  const onLogin = () => {
    loginUser(email, password, () => router.push('/user/dashboard'), (e) => handleFirebaseMFA(e))
  }

  return (
    <PageLayout title="Sign In">
      <div className="flex flex-col h-full">
        <section className="flex flex-col items-center justify-center h-full space-y-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-1/4 px-3 py-1 rounded-lg outline-none"
            type="email"
            placeholder="Email Address"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-1/4 px-3 py-1 rounded-lg outline-none"
            type="password"
            placeholder="Password"
          />
          <button
            onClick={() => onLogin()}
            className="py-2 text-white bg-blue-500 rounded-full px-7">
            Login
          </button>
        </section>
        <section className="flex text-white justify-center pb-4 font-medium">
          <span>
            New to the system? <Link href="/">Register</Link>
          </span>
        </section>
        <MFA onSubmit={(code) => onSubmitCode(code)} setOpen={setMfaPop} open = {mfaPop} />
        <div id='sign-in'></div>
      </div>
    </PageLayout>
  );
}

export default login