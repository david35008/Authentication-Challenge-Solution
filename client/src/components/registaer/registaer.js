import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { create } from '../Network/Ajax';
import '../login/login.css';

function Registaer() {

    const { register, handleSubmit, errors } = useForm();
    const [error, setError] = useState(<span></span>)

    const location = useHistory()

    const onSubmit = (data) => {
        console.log(data);
        create('/users/register', data)
            .then(res => {
                location.push('/')
                console.log('succes');
            }
            )
            .catch(e => {
                setError(e.message)
                console.error(e.message)
            })

    };


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
                                <input name="name" type='text' className="form-control input_user" placeholder='username..' ref={register({ required: true })} />
                            </div>

                            <div className="input-group mb-3">
                                <div className="input-group-append">
                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                </div>

                                <input name="email" type='email' className="form-control input_user" placeholder='email..' ref={register({ required: true, pattern: /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-append">
                                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                                </div>

                                <input name="password" type='password' className="form-control input_pass" placeholder='password' ref={register({ required: true, pattern: /\d+/ })} />
                            </div>
                            <div className="form-group">

                            </div>
                            <div className="d-flex justify-content-center mt-3 login_container">
                                <input type="submit" value="Sign Up" className="btn login_btn" />
                            </div>
                        </form>
                    </div>

                    <div className="mt-4">
                        <div className="d-flex justify-content-center links">
                            Already have an account? <Link to={'/'}><div>Sign In</div></Link>
                        </div>
                    </div>
                </div>
            </div>
            <Alert key={'idx'} variant='danger' className='errorMessage' >
                {error}
                {errors.name && 'Name is required.'}<br />
                {errors.email && 'Email is required.'}<br />
                {errors.password && 'Password is required.'}
            </Alert>
        </div>
    );
}

export default Registaer;
