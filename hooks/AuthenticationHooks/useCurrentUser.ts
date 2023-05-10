import { auth } from '@/firebase/config';
import IUser from '@/interfaces/IUser';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'

const useCurrentUser = () => {
    const [user, setUser] = useState<IUser | undefined>();

    useEffect(() => {
        onAuthStateChanged(auth, (usr) => {
            if (usr) {
                setUser({uid: usr.uid, email: usr.email, displayName: usr.displayName})
            }
        })
    }, [])

  return user
}

export default useCurrentUser