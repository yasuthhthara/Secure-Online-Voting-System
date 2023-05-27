import VoteCard from '@/Components/VoteCard'
import { getCurrentUser } from '@/firebase/utils/authnticationUtils'
import { getSingleDataFromCollection, updateFromCollection } from '@/firebase/utils/databaseUtils'
import { ISession } from '@/interfaces/ISession'
import PageLayout from '@/layouts/PageLayout'
import { User } from 'firebase/auth'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

type Props = {}

const VotingSession = (props: Props) => {

    const [session, setSession] = useState<ISession>();
    const [sessionID, setSessionID] = useState<string>();
    const [votesUsed, setVotesUsed] = useState<number>(0);
    const [votedIndexes, setVotedIndexes] = useState<number[]>([]);
    const [user, setUser] = useState<User>();
    const router= useRouter();

    useEffect(() => {
        const sessionID = router.query.session

        if (sessionID != undefined && typeof sessionID != "object") {
            setSessionID(sessionID);
            getSingleDataFromCollection("Sessions", sessionID).then((res) => {
                setSession(res)
            })
        }

        getCurrentUser((user: User) => {
          setUser(user);
        });

    }, [router]);

    useEffect(() => {
      if (session && user && votedIndexes.length === 0 && votesUsed === 0) {
        session.candidates.forEach((candidate, index) => {
          if (candidate.votedIDs.includes(user.uid)) {
            votedIndexes.push(index);
            setVotesUsed(votesUsed + 1);
          }
        })
      }
    }, [user, session])

    const handleVote = (index: number) => {
        setVotesUsed(votesUsed + 1);
        votedIndexes.push(index);

        if (session && sessionID && user) {
            const tempData = session;
            tempData.candidates[index].totalVotes = session.candidates[index].totalVotes + 1;
            tempData.candidates[index].votedIDs = [...session.candidates[index].votedIDs, user.uid]

            updateFromCollection("Sessions", tempData, sessionID, () => alert('successfully voted to ' + session.candidates[index].name), (e) => {console.error(e); setVotesUsed(votesUsed - 1); setVotedIndexes(votedIndexes.filter(idx => idx != index));});
        }
    }

    const handleCancelVote = (index: number) => {
        setVotesUsed(votesUsed - 1);

        setVotedIndexes(votedIndexes.filter(idx => idx != index));

        if (session && sessionID && user) {
            const tempData = session;
            tempData.candidates[index].totalVotes = session.candidates[index].totalVotes - 1;
            tempData.candidates[index].votedIDs = session.candidates[index].votedIDs.filter(id => id != user.uid)
            
            updateFromCollection("Sessions", tempData, sessionID, () => alert('removed vote for ' + session.candidates[index].name), (e) => {console.error(e); setVotesUsed(votesUsed + 1); votedIndexes.push(index);});
        }
    }

    const checkIsVoted = (index: number) => {
      return votedIndexes.includes(index)
    }

  return (
    <PageLayout title={session? session.name: 'Loading...'}>
        <div className='m-3 flex flex-col bg-gray-600/25 rounded-t-lg'>
          <div className='flex justify-around p-2 text-xl font-medium text-white'>
            <span>Candidates</span>
            <span>Maximum Votes Per User: {session? session.maxVotes: 'Loading...'}</span>
          </div>
          <div className='space-y-2 px-2 py-4'>
            {session?.candidates.map((candidate, idx) => (
                <VoteCard isVoted = {checkIsVoted(idx)} disabled = {(!votedIndexes.includes(idx)) && (session.maxVotes === votesUsed)} onVote={(isVoted: boolean) => isVoted? handleVote(idx): handleCancelVote(idx)} key={idx} candidateName={candidate.name} />
            ))}
          </div>
        </div>
    </PageLayout>
  )
}

export default VotingSession