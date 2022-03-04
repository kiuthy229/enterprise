import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import PopUp from "../../components/PopUp/PopUp";
import { Box } from "@mui/material";
import axios, * as others from 'axios';
import loggedInUser from '../../data/login-user.json';
import { Navigate } from "react-router-dom";

// loginUser(userData, callback) {
//     return axios.post(`${USERS_SERVICE_URL}/users/login`, userData)
//         .then((res) => {
//             window.localStorage.setItem('authToken', res.data.token)
//             window.localStorage.setItem('user', res.data.user)
//             this.setState({ isAuthenticated: true })
//             this.createFlashMessage('You successfully logged in! Welcome!')
//             this.props.history.push('/')
//             this.getMovies()
//         })
//         .catch((error) => {
//             callback('Something went wrong')
//         })
// }

function Login(props) {
    const [buttonPopup, setButtonPopup] = useState(false);


    const [user, setUser] = useState({ username: "" });
    const [error, setError] = useState("");


    const Login = async (details) => {

        await axios
            .post('http://127.0.0.1:8000/users/login', {
                email: details.username,
                password: details.password
            })
            .then(response => {
                console.log(`Status Code: ${response.status}`)

                window.localStorage.setItem('authToken', response.data.token)
                window.localStorage.setItem('firstName', response.data.user.name)
                window.localStorage.setItem('isAuthenticated', true);
                props.authenticate(true);

                if (response.status === 200) {

                    loggedInUser.id = response.data.user._id;
                    loggedInUser.name = response.data.user.name;
                    loggedInUser.email = response.data.user.email;
                    loggedInUser.token = response.data.token;

                    console.log(`USER: ${JSON.stringify(loggedInUser)}`)

                    //console.log(`Logged in Data: ${JSON.stringify(response.data.user)}`)

                    setUser({
                        name: details.name,
                        username: details.username,
                    });
                }

            })
            .catch(error => {
                console.error(error)
                setError("Username or Password do not match!");
            });

    };

    const Logout = async () => {
        console.log(JSON.stringify(loggedInUser));


        axios({
            method: 'post', //you can set what request you want to be
            url: 'http://127.0.0.1:8000/users/logout',
            headers: {
                Authorization: 'Bearer ' + `${loggedInUser.token}`
            }
        }).then(response => {
            console.log(`Status Code: ${response.status}`)
            console.log(`Data: ${response.data}`)

            if (response.status === 200) {
                console.log("Logged out");
                setUser({ name: "", username: "" });
            }

        })
            .catch(error => {
                console.error(error)
                setError("Username or Password do not match!");
            });


    };

    return (
        <Box component="main">
            {user.username !== "" ? (
                // show response of the request
                <div className="welcome">
                    <h2>
                        Welcome, <span>{user.name}</span>
                    </h2>
                    <button onClick={() => setButtonPopup(true)}>Logout</button>
                </div>
            ) : (
                <LoginForm Login={Login} error={error} />
            )}
            <PopUp trigger={buttonPopup} setTrigger={setButtonPopup} setUser={Logout}>
                <h3>Confirm Logout ?</h3>
            </PopUp>
        </Box>
    );
}

export default Login;
