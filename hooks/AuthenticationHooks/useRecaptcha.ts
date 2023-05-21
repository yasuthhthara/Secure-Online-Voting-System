import { auth } from '@/firebase/config';
import { ApplicationVerifier, RecaptchaVerifier } from 'firebase/auth';
import React, {useState, useEffect} from 'react'

const useRecaptcha = (compId: string) => {
    const [recaptcha, setRecaptcha] = useState<ApplicationVerifier>();

    useEffect(() => {
        const recaptchaVerifier = new RecaptchaVerifier(compId, {
            "size": "invisible",
            "callback": () => {}
        }, auth);

        setRecaptcha(recaptchaVerifier);

        return () => {
            recaptchaVerifier.clear();
        }
    }, [compId]);

    return recaptcha
}

export default useRecaptcha;