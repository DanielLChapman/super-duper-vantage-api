import React, { useState } from 'react';

import { useRouter } from 'next/router';

import { useUser } from '../src/Components/User';
import dynamic from 'next/dynamic'
const SignUp = dynamic(() => import('../src/Components/UserHandling/SignUp'), {
    ssr: false,
  })


function signin(props) {
    let [needToRegister, setNeedToRegister] = useState(false);
    const router = useRouter();
    let user = useUser();

    React.useEffect(() => {
        if (user.id !== '-1') {
            router.push('/');
        }
    }, []);
    

    return (
        <section className="SignInContainer">
            {
                !needToRegister ? (
                    <span>Hi</span>
                ) : 
                (
                    <SignUp />
                )
            }
            
            <button onClick={() => {setNeedToRegister(!needToRegister)}}>{!needToRegister ? 'Need to Register?' : 'Sign In'}</button>
        </section>
    );
}

export default signin;