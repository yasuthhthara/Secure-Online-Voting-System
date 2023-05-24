import React from 'react'

type Props = {
    title: string;
    onClick?: () => void;
    type: "submit" | "button"
}

const CommonButton = ({title, onClick}: Props) => {
  return (
    <button className='bg-[#505050] rounded-lg px-3 py-2 text-white text-lg font-semibold hover:bg-[#707070] duration-300' onClick={onClick&& onClick}>
        {title}
    </button>
  )
}

export default CommonButton