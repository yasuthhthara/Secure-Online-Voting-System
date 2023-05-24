import { IProfileFormInputs } from '@/FormTypes/profileCompleteFormTypes';
import TextField from '@mui/material/TextField';
import React from 'react'
import { UseFormRegister, Path } from 'react-hook-form';

type Props = {
    type: string;
    label: string;
    multilined?: boolean;
    placeholder?: string;
    value?: string
    error?: boolean;
    helperText: string;
    onChange?: (...params: any) => void;
    register: UseFormRegister<any>;
    required?: boolean;
    idLabel: Path<any>;
}

const InputField = ({helperText, label, register, required = false, type, error, multilined, onChange, placeholder, value, idLabel}: Props) => {

  return (
    <TextField
      className='w-full'
      {...register(idLabel, { required })}
      label={label}
      value={value&& value}
      error={error && error}
      helperText={error ? helperText : ''}
      InputLabelProps={{shrink: true}}
      multiline={multilined}
      placeholder={placeholder}
      type={type}
      variant="standard"
      color="secondary"
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  )
}

export default InputField