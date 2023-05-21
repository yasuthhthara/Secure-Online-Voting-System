import { logoutUser } from '@/firebase/utils/authnticationUtils';
import { Avatar, Button, Popover } from '@mui/material'
import { useRouter } from 'next/router';
import React from 'react'

const ProfileAvatar = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <button className='h-full flex items-center pt-3 px-4' aria-describedby={id} onClick={handleClick}>
        <Avatar />
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Button onClick={() => logoutUser(() => router.push('/'))} color='error' sx={{ p: 2 }}>Logout</Button>
      </Popover>
    </div>
  );
}

export default ProfileAvatar