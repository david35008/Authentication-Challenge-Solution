
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { Logged } from '../components/login/useContextComp';
import { create, read, options } from './Network/Ajax';
import { Alert } from 'react-bootstrap';

function Home() {

    const [apiOptions, setApiOptions] = useState()
    const [usersInformation, setUsersInformation] = useState()
    const [aadminInformation, setAdminInformation] = useState()

    const [error, setError] = useState('Error Box:')

    useEffect(() => {
        const interval = setInterval(() => {
            create('/users/token', { token: Cookies.get('refreshToken') })
                .then(res => {
                    Cookies.set('accessToken', res.accessToken)
                    console.log("refreshed the acces token");
                })
                .catch(err => console.error(err));
        }, 9000);

        return () => clearInterval(interval);
    })


    let value = useContext(Logged)


    const logOut = () => {
        create('/users/logout', {token: Cookies.get('refreshToken')})
        .then(res => {
            console.log(res.message);
        })
        .catch(console.error);
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('name')
        Cookies.remove('isAdmin')
        value.setIsLogged(false)
    }

    const getAllApi = () => {
        options('/')
            .then(res => {
                setApiOptions(res)
            })
            .catch(error => {
                setError(error.message)
            })
    }

    const getUsersInformation = () => {
        read('/api/v1/information')
            .then(res =>
                setUsersInformation(res))
            .catch(console.error)
    }

    const getAdminInformation = () => {
        read('/api/v1/users')
            .then(res => {
                setAdminInformation(res)
            })
            .catch(error => {
                setError(error.message)
            })

    }

    return (
        <div className='Home' >
            <span><span className='title' >Home Page</span><Button variant="danger" className='logOut' onClick={logOut} >Log Out</Button></span><br />
            {Cookies.get('name') && <div>Hello {Cookies.get('name')}</div>}
            <Alert key={'idx'} variant='danger' className='errorMessage' >
                {error}
            </Alert>
            <Button variant="info" onClick={getAllApi} >Get all api that open for you</Button>
            {apiOptions &&
                [<span className='tableContainer' key={'user.email + user.password'} >
                    <div className='userEmail' >Description:</div>
                    <div className='userIsAdmin' >Method:</div>
                    <div className='userName' >Path:</div>
                    <div className='userPassword' >Example:</div>
                </span>].concat(
                    apiOptions.map(user => <span className='tableContainer' key={user.description + user.name} >
                        <div className='userEmail' >{user.description}</div>
                        <div className='userIsAdmin'  >{user.method}</div>
                        <div className='userName' >{user.path}</div>
                        <div className='userPassword' >{`${JSON.stringify(user.example)}`}</div>
                    </span>))}
            <Button variant="success" onClick={getUsersInformation} >Try to get information from server</Button>
            {usersInformation &&
                [<span className='usersInfo' key={'user.user + user.info'} >
                    <div className='userName' >Name:</div>
                    <div className='userEmail' >Info:</div>
                </span>].concat(
                    usersInformation.map(user => <span className='usersInfo' key={user.user + user.info} >
                        <div className='userName' >{user.user}</div>
                        <div className='userEmail' >{user.info}</div>
                    </span>))}
            <Button variant="warning" onClick={getAdminInformation} >Try to get information from server</Button>
            {aadminInformation &&
                [<span className='tableContainer' key={'user.email + user.name'} >
                    <div className='userEmail' >Email:</div>
                    <div className='userName' >Name:</div>
                    <div className='userIsAdmin' >Is Admin:</div>
                    <div className='userPassword' >Hashed Passwords:</div>
                </span>].concat(
                    aadminInformation.map(user => <span className='tableContainer' key={user.email + user.name} >
                        <div className='userEmail' >{user.email}</div>
                        <div className='userName' >{user.name}</div>
                        <div className='userIsAdmin' >{`${user.isAdmin}`}</div>
                        <div className='userPassword' >{user.password}</div>
                    </span>))}

        </div>

    );
}

export default Home;
