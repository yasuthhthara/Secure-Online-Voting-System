import { loginUser } from '@/firebase/utils/authnticationUtils';
import PageLayout from '@/layouts/PageLayout'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

type Props = {}

const login = (props: Props) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter()

  const onLogin = () => {
    loginUser(email, password, () => router.push('/user/dashboard'))
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
      </div>
    </PageLayout>
  );
}

export default login