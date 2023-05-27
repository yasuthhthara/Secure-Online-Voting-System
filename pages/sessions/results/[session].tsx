import { getSingleDataFromCollection } from '@/firebase/utils/databaseUtils';
import { ICandidate } from '@/interfaces/ICandidate';
import { ISession } from '@/interfaces/ISession';
import PageLayout from '@/layouts/PageLayout';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

type Props = {}

const SessionResults = (props: Props) => {

    const [sessionID, setSessionID] = useState<string>('');
    const [session, setSession] = useState<ISession>();
    const [candidates, setCandidates] = useState<ICandidate[]>();
    const router = useRouter();

    useEffect(() => {
        const sessionID = router.query.session

        if (sessionID != undefined && typeof sessionID != "object") {
            setSessionID(sessionID);
            getSingleDataFromCollection("Sessions", sessionID).then((res) => {
                setSession(res)
            })
        }
    }, [router]);

    useEffect(() => {
        if (session) {
            const sortedUsers = session.candidates.sort((a, b) => {
                return b.totalVotes -a.totalVotes
            });

            setCandidates(sortedUsers);
        }
    }, [session]);

  return (
    <PageLayout title={`Results of ${session? session.name: "Loading..."}`}>
        <div className='text-white flex w-full flex-col pt-10 space-y-2'>
            {candidates&& candidates.map((candidate, idx) => (
                <div key={idx} className={`rounded-lg bg-gray-950/40 text-xl py-3 px-3 mx-3 justify-between flex ${idx === 0? 'border-2 border-yellow-500' : ''}`}>
                    <span>{candidate.name}</span>
                    <span hidden = {idx != 0} className='text-yellow-500'>Winner</span>
                </div>
            ))}
        </div>
    </PageLayout>
  )
}

export default SessionResults