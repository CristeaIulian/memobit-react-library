import React, { useState } from 'react';

import './Login.scss';

export const getCookie = (cookieName: string): string | null => {
    // Get all cookies from document.cookie (returns a string like "cookie1=value1; cookie2=value2")
    const cookies = document.cookie;

    // Split the cookies string into an array of individual cookies
    const cookieArray = cookies.split('; ');

    // Find the specific cookie we're looking for
    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].split('=');
        const name = cookie[0];
        const value = cookie[1];

        if (name === cookieName) {
            // Return the cookie value (decoded from URI encoding)
            return decodeURIComponent(value);
        }
    }

    // Return null if the cookie isn't found
    return null;
};

export const Login = (): React.ReactElement | null => {
    // const [showLoginOverlay, setLoginOverlayVisibility] = useState(false);
    const [showLoginOverlay] = useState(false);
    // useEffect(() => {
    //     const serverCookie = getCookie('PHPSESSID');
    //
    //     if (!serverCookie) {
    //         setLoginOverlayVisibility(true);
    //     }
    // }, []);

    if (!showLoginOverlay) {
        return null;
    }

    return (
        <div className="login-container">
            <div className="login-back-drop"></div>
            <form action="https://memobit.ddns.net:8081/" method="post">
                <div className="login-content">
                    <div className="login-form">
                        <input type="text" name="user" />
                    </div>
                    <div className="login-form">
                        <input type="password" name="password" />
                    </div>
                    <div className="login-form">
                        <input type="submit" value="Login" />
                    </div>
                </div>
            </form>
        </div>
    );
};
