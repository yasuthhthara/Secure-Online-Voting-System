import { TextField } from '@mui/material'
import { MuiOtpInput } from 'mui-one-time-password-input'
import React from 'react'

type Props = {
    setCode: (text: string) => void
}

const VerificationCodeInput = ({setCode}: Props) => {

  return (
    <div>
        <TextField onChange={(e) => setCode(e.target.value)} size='small' type='text' className='w-full' placeholder='Verification Code' />
    </div>
  )
}

export default VerificationCodeInput