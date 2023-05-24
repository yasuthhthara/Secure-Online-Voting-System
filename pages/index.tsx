import { registerUser } from "@/firebase/utils/authnticationUtils";
import PageLayout from "@/layouts/PageLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const router = useRouter()

  const onRegister = () => {
    if (password === passwordAgain) {
      registerUser(email, password, username, () => router.push('/user/profile'));
    } else {
      console.error('cannot register')
    }
  };

  return (
    <div className="h-screen flex-1 flex flex-col bg-[#101010]">
      <div className="flex flex-col h-full">
        <section className="flex flex-col items-center justify-center h-full space-y-4">
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="w-1/3 px-3 py-1 rounded-lg outline-none"
            type="text"
            placeholder="Username"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-1/3 px-3 py-1 rounded-lg outline-none"
            type="email"
            placeholder="Email Address"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-1/3 px-3 py-1 rounded-lg outline-none"
            type="password"
            placeholder="Password"
          />
          <input
            onChange={(e) => setPasswordAgain(e.target.value)}
            className="w-1/3 px-3 py-1 rounded-lg outline-none"
            type="password"
            placeholder="Confirm Password"
          />
          <button
            onClick={() => onRegister()}
            className="py-2 text-white bg-blue-500 rounded-full px-7">
            Register
          </button>
        </section>
        <section className="flex text-white justify-center pb-4 font-medium">
          <span>
            Already have an account? <Link href="/login">Sign in</Link>
          </span>
        </section>
      </div>
    </div>
  );
}
