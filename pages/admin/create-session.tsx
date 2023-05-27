import CandidateSelectionCard from '@/Components/CandidateSelectionCard'
import CommonButton from '@/Components/CommonButton'
import InputField from '@/Components/InputField'
import { IProfileFormInputs } from '@/FormTypes/profileCompleteFormTypes'
import { SessionInputs } from '@/FormTypes/sessionInputs'
import { createData, getDataFromCollection } from '@/firebase/utils/databaseUtils'
import { ICandidate } from '@/interfaces/ICandidate'
import PageLayout from '@/layouts/PageLayout'
import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import { useForm } from 'react-hook-form'

const CreateSession = () => {

    const [sessionName, setSessionName] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date| null>();
    const [maxVotes, setMaxVotes] = useState<number>(1);
    const [description, setDescription] = useState<string>('');
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [allUsers, setAllUsers] = useState<IProfileFormInputs[]>([]);

    useEffect(() => {
        getDataFromCollection("Users").then((res) => {
            setAllUsers(res)
        })
    }, [])

    const router = useRouter();
    const { register, handleSubmit, formState: {errors} } = useForm<SessionInputs>();

    const onCreate = () => {
        const data = {
            name: sessionName,
            startDate: startDate,
            endDate: endDate,
            maxVotes: maxVotes,
            description: description,
            candidates: candidates
        }

        createData("Sessions", data, () => router.push('/user/dashboard'), (e) => console.error(e));
    }

  return (
    <PageLayout title='Create Session'>
        <form onSubmit={handleSubmit(onCreate)} className='flex justify-center items-center h-full'>
            <section className='flex flex-col w-3/5 space-y-6'>
                <InputField type='text' error={errors.sessionName? true: false} register={register} idLabel='sessionName' label='Session Name' helperText='this field is required' required value={sessionName} onChange={(text) => setSessionName(text)} />
                <section className='w-full flex justify-between space-x-6'>
                    <InputField type='date' error={errors.startDate? true: false} register={register} idLabel='startDate' label='Start Date' helperText='this field is required' required value={startDate?.toISOString().split('T')[0]} onChange={(text) => setStartDate(new Date(text))} />
                    <InputField type='date' error={errors.endDate? true: false} register={register} idLabel='endDate' label='End Date' helperText='this field is required' required value={endDate?.toISOString().split('T')[0]} onChange={(text) => setEndDate(new Date(text))} />
                </section>
                <InputField type='number' error={errors.maxVotes? true: false} register={register} idLabel='maxVotes' label='Max Votes Per User' helperText='this field is required' required value={maxVotes.toString()} onChange={(text) => setMaxVotes(text)} />
                <InputField multilined type='text' error={errors.description? true: false} register={register} idLabel='description' label='Description' helperText='this field is required' required value={description} onChange={(text) => setDescription(text)} />
                <div className='text-white text-xl text-center'>Select Candidates</div>
                <section className='flex flex-col space-y-2'>
                    <div className='flex text-white mr-16'>
                        <span className='flex-1 flex justify-center'>Name</span>
                        <span className='flex-1 flex justify-center'>Phone Number</span>
                        <span className='flex-1 flex justify-center'>ID Number</span>
                    </div>
                    {allUsers.map((user) => (
                        <CandidateSelectionCard onToggle={(isTrue) => {isTrue? setCandidates([...candidates, {name: `${user.firstName} ${user.lastName}`,userID: user.userID, totalVotes: 0, votedIDs: []}]): null}} name={`${user.firstName} ${user.lastName}`} idNumber={user.nic} mobile={user.mobileNo} key={user.nic} />
                    ))}
                </section>
                <section className='flex w-full justify-end'>
                    <CommonButton type='button' title='Create Session' />
                </section>
            </section>
        </form>
    </PageLayout>
  )
}

export default CreateSession