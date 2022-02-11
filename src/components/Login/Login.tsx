import React, { useState } from 'react';
import { Button, FormControl, Input, InputLabel, Typography } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { UserDataService } from '../../dataservices/UserDataService';

import './Login.scss';

export const Login: React.FC<{ onSuccess: () => void }> = ({onSuccess}) => {
    const [error, setError] = useState<string>();
    const {register, handleSubmit, watch} = useForm({
        defaultValues: {
            username: '',
            password: '',
        }
    });
    const {username, password} = watch();

    const handleLogin = async () => {
        await UserDataService.login(username, password) ? onSuccess() : setError('Вы ввели неверные данные!');
    }

    return (
        <div className="login-wrapper">
            <Typography variant="h4" className="login-wrapper-header">Вход</Typography>
            <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
                <FormControl className="input-item">
                    <InputLabel htmlFor="username" className="row-label">Имя пользователя</InputLabel>
                    <Input id="username" className="row-input" type="text" {...register("username", {required: true, minLength: 3})}/>
                </FormControl>
                <FormControl className="input-item">
                    <InputLabel htmlFor="password" className="row-label">Пароль</InputLabel>
                    <Input id="password" className="row-input" type="password" {...register("password", {required: true, minLength: 3})}/>
                </FormControl>
                {error && <InputLabel error>{error}</InputLabel>}
                <Button color="primary" variant="contained" className="btn-login" type="submit">Войти</Button>
            </form>
        </div>
    )
}
