import React, {useState} from 'react'

type Props = {
    name: string;
    mobile: string;
    idNumber: string;
    onToggle: (selected: boolean) => void
}

const CandidateSelectionCard = ({idNumber, mobile, name, onToggle}: Props) => {

    const [isSelected, setIsSelected] = useState<boolean>(false);

    const onSelected = () => {
        onToggle(!isSelected);
        setIsSelected(!isSelected);
    }

  return (
    <div className='flex bg-[#505050] rounded-lg px-4 py-2 text-white'>
        <span className='flex-1 flex justify-center items-center'>{name}</span>
        <span className='flex-1 flex justify-center items-center'>{mobile}</span>
        <span className='flex-1 flex justify-center items-center'>{idNumber}</span>
        <button type='button' onClick={() => onSelected()} className={`${isSelected? "bg-gray-50 hover:bg-gray-400 text-black": "bg-gray-950 hover:bg-gray-900"} duration-300 p-2 rounded-lg`}>{isSelected? "Selected": "Select"}</button>
    </div>
  )
}

export default CandidateSelectionCard