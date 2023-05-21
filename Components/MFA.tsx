import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import VerificationCodeInput from './VerificationCodeInput';

type Props = {
    open: boolean;
    setOpen: (state: boolean) => void;
    onSubmit: (verificationCode: string) => void;
}

const MFA = ({open = false, setOpen, onSubmit}: Props) => {
    const [verificationCode, setVerificationCode] = useState<string>('');


  return (
    <>
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Enter The Verification Code</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Please enter the code that you received to your phone
                </DialogContentText>
                {/* <input placeholder='verification code' value={verificationCode} style={{color: 'black'}} type='password' onChange={(e) => setVerificationCode(e.target.value)} /> */}
                <VerificationCodeInput setCode={setVerificationCode} />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => onSubmit(verificationCode)}>Submit</Button>
            </DialogActions>
        </Dialog>
    </>
  )
}

export default MFA