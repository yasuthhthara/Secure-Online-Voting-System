import React from 'react'

type Props = {
    name: string;
    description: string;
    endDate: Date;
    startDate: Date;
    onEdit?: () => void;
}

const SessionCard = ({description, endDate, name, startDate, onEdit}: Props) => {

    const dateConvert = (date: Date) => {
        return new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
    }

  return (
    <div className='bg-gray-950 px-4 py-2 rounded-lg'>
        <div className='text-2xl text-white font-semibold text-left'>{name}</div>
        <div className='py-2 px-2 text-white/40'>{description}</div>
        <div className='pb-2 text-white/70 text-right'>{new Date() >= dateConvert(startDate)? `Ending on ${dateConvert(endDate).toDateString()}`: `Starting on ${dateConvert(startDate).toDateString()}`}</div>
    </div>
  )
}

export default SessionCard