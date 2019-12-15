import React, {useState, useEffect} from 'react';

import UserList from '../components/UsersList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { useHttpClient } from '../../shared/components/hooks/http-hook'

const Users = () => {

    const [loadedUser, setLoadedUser] = useState()
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    useEffect( () => {

        const loadUser = async () => {
            
            try {
                const responseData = await sendRequest('http://localhost:5000/api/users')

                setLoadedUser(responseData.users)
            } catch (err) {
                console.log(err)
            }
        }
        loadUser()
    }, [] )

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay/>}
            {!isLoading && loadedUser && <UserList items={loadedUser} />}
        </React.Fragment>
    );
}

export default Users;