import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'

type Props = {
  title?: string;
  error?: boolean;
  setAppear: (status: boolean) => void;
  appear: boolean;
}

const Notification = ({error = false, title = '', setAppear, appear}: Props) => {
  return (
    <Snackbar open={appear} autoHideDuration={3000} onClose={() => setAppear(false)}>
      <Alert onClose={() => setAppear(false)} severity={error? "error": "success"} sx={{ width: '100%' }}>
        {title}
      </Alert>
    </Snackbar>
  )
}

export default Notification