import React, { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Alert, Button } from 'react-bootstrap';
import { create, options } from '../Network/Ajax';
import { Logged } from './useContextComp';

import './login.css';

function Login() {

    const [error, setError] = useState('Error Box:')
    const [apiOptions, setApiOptions] = useState()
    const { register: logIn, handleSubmit, errors } = useForm();
    const value = useContext(Logged);

    const onSubmit = (data) => {
        create('/users/login', data)
            .then(res => {
                if (res.accessToken && res.refreshToken) {
                    Cookies.set('accessToken', res.accessToken)
                    Cookies.set('refreshToken', res.refreshToken)
                    Cookies.set('name', res.userName)
                    Cookies.set('isAdmin', res.isAdmin)
                    value.setIsLogged(true);
                }
            })
            .catch(e => {
                setError(e.message)
                console.error(e.message)
            })
    };

    const getAllApi = () => {
        options('/')
            .then(res => {
                setApiOptions(res)
            })
            .catch(error => {
                setError(error.message)
            })
    }

    return (
        <div className="container h-100">
            <div className="d-flex justify-content-center h-100">
                <div className="user_card">
                    <div className="d-flex justify-content-center">
                        <div className="brand_logo_container">
                            <img src="https://cdn.freebiesupply.com/logos/large/2x/pinterest-circle-logo-png-transparent.png" className="brand_logo" alt="Logo" />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center form_container">
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <div className="input-group mb-3">
                                <div className="input-group-append">
                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                </div>
                                <input name="email" type='email' className="form-control input_user" placeholder='email..' ref={logIn({ required: true, pattern: /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} />
                            </div>
                            <div className="input-group mb-2">
                                <div className="input-group-append">
                                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                                </div>
                                <input name="password" type='password' className="form-control input_pass" placeholder='password' ref={logIn({ required: true, pattern: /\d+/ })} />
                            </div>
                            <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input name="rememberToken" type="checkbox" ref={logIn()} />Remember Me
                                </div>
                            </div>
                            <div className="d-flex justify-content-center mt-3 login_container">
                                <input type="submit" value="Login" className="btn login_btn" />
                            </div>
                        </form>
                    </div>

                    <div className="mt-4">
                        <div className="d-flex justify-content-center links">
                            Don't have an account? <Link to={'/register'}><div>Sign Up</div></Link>
                        </div>
                    </div>
                </div>
            </div>
            <Alert key={'idx'} variant='danger' className='errorMessage' >
                {errors.email && 'Email is required.'}<br />
                {errors.password && 'Password with digits is required.'}
                {error}
            </Alert>
            <div className='logInGetOptions' >
                <Button variant="info" onClick={getAllApi} >Get all api that open for you</Button>
            </div>
            {apiOptions &&
                [<span className='tableContainer' key={'user.email + user.name'} >
                    <div className='userEmail' >Description:</div>
                    <div className='userIsAdmin' >Method:</div>
                    <div className='userName' >Path:</div>
                    <div className='userPassword' >Example:</div>
                </span>].concat(
                    apiOptions.map(user => <span className='tableContainer' key={user.email + user.name} >
                        <div className='userEmail' >{user.description}</div>
                        <div className='userIsAdmin'  >{user.method}</div>
                        <div className='userName' >{user.path}</div>
                        <div className='userPassword' >{`${JSON.stringify(user.example)}`}</div>
                    </span>))}
        </div>
    );
}

export default Login;
