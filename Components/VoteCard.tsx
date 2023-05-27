import React, { useState, useEffect } from 'react'

type Props = {
    candidateName: string;
    description?: string;
    onVote?: (status: boolean) => void;
    disabled?: boolean;
    isVoted?: boolean
}

const VoteCard = ({candidateName, description, onVote, disabled = false, isVoted = false}: Props) => {

    const [selected, setSelected] = useState<boolean>(false);

    useEffect(() => {
        setSelected(isVoted)
    }, [isVoted])

    const handleVote = () => {
        onVote&& onVote(!selected);
        setSelected(!selected);
    }

  return (
    <div className='bg-gray-950/40 rounded-lg text-lg flex justify-between'>
        <section className='flex justify-center text-white items-center pl-3'>
            <span>{candidateName}</span>
        </section>
        <section>
            {disabled? <span className='text-white/40 italic text-sm pr-3 flex items-center py-3'>Vote Chances Finished</span>: <button onClick={() => handleVote()} className={`px-4 py-2 duration-300 rounded-r-lg text-white ${selected? 'bg-red-800': 'bg-white/20'}`}>{selected? "Cancel Vote": "Vote"}</button>}
        </section>
    </div>
  )
}

export default VoteCard