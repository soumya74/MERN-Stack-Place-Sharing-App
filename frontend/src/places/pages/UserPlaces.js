import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import PlaceList from '../components/PlaceList'
import LoadSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { useHttpClient } from '../../shared/components/hooks/http-hook'

const UserPlaces = (props) => {

    const [placeList, setPlaceList] = useState()
    const {isLoading, error, sendRequest, clearError} = useHttpClient()

    const userId = useParams().userId;

    useEffect( () => {
        
        const getPlaces = async () => {
            try{
                const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`)
                setPlaceList(responseData.places)
            } catch(err) {
                console.log(err)
            }
        }
        getPlaces();
    } ,[])

    return(
        <React.Fragment>
            {isLoading && <LoadSpinner asOverlay/>}
            <ErrorModal error={error} onClear={clearError}/>
            {!isLoading && placeList && <PlaceList items={placeList}/>}
        </React.Fragment>
    )
}

export default UserPlaces;