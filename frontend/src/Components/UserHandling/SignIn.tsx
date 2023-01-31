import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from "graphql-tag";
import useForm from '../../../tools/useForm';
import { CURRENT_USER_QUERY } from '../User';
import Router from 'next/router';

const SIGNIN_MUTATION = gql`
    mutation SignInMutation($username: String!, $password: String!) {
        authenticateUserWithPassword(username: $username, password: $password) {
            ... on UserAuthenticationWithPasswordSuccess {
                item {
                    id
                    username
                }
            }
            ... on UserAuthenticationWithPasswordFailure {
                message
            }
        }
    }
`;

const SignIn: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [signIn, { data, error, loading }] = useMutation(SIGNIN_MUTATION);
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      let res = await signIn({ variables: { username, password }, refetchQueries: [{query: CURRENT_USER_QUERY}] });
      console.log(res);
        if (res.data.authenticateUserWithPassword.__typename === 'UserAuthenticationWithPasswordSuccess'       ) {
            alert('success');
            Router.push({
                pathname: `/`,
            });
        }
      
    };

    const errorM =
        data?.authenticateUserWithPassword.__typename ===
        "UserAuthenticationWithPasswordFailure"
            ? data?.authenticateUserWithPassword
            : undefined;

  
    return (
      <form onSubmit={handleSubmit} aria-disabled={loading}>
        {errorM && (
            <section className="form-error-message">
                <span>Error Signing In: {errorM.message}</span>
            </section>
        )}
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={event => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete='current-password'
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <button disabled={loading} aria-disabled={loading} type="submit">Sign In</button>
      </form>
    );
  };
  
  export default SignIn;
