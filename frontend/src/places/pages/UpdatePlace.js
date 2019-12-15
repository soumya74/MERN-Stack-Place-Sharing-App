import React, {useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';

import './NewPlace.css';
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/util/validators';
import {useForm} from '../../shared/components/hooks/form-hook';
import { useHttpClient } from '../../shared/components/hooks/http-hook'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'

const UpdatePlace = () => {
    const placeId = useParams().placeId;
    const { isLoading, error, sendRequest, clearError } = useHttpClient() 
    const [identifiedPlace, setIdentifiedPlace] = useState()
    const history = useHistory()
  
    const [formState, inputHandler, setFormData] = useForm(
      {
        title: {
          value: '',
          isValid: false
        },
        description: {
          value: '',
          isValid: false
        }
      },
      false
    );
  
    const placeUpdateSubmitHandler = async event => {
      event.preventDefault();

      try{
        const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`,
        'PATCH',
        {
          'Content-Type': 'application/json'
        },
        JSON.stringify( {
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }) )  
        console.log(responseData) 
        history.push('/')
      } catch (err) {
        console.log(err)
      }   
    };

    useEffect( () => {
      const getPlace = async () => {
        try{
          const userPlace = await sendRequest(`http://localhost:5000/api/places/${placeId}`)
          console.log(userPlace.place)
          setIdentifiedPlace(userPlace.place)

          setFormData(
            {
                title: {
                  value: userPlace.user.title,
                  isValid: true
                },
                description: {
                  value: userPlace.user.description,
                  isValid: true
                }
              },
            true
        )
        } catch(err) {
          console.log(err)
        }
      }
      getPlace()
    } , [sendRequest, placeId, setFormData])

    if (!identifiedPlace) {
      return (
        <div className="center">
          <h2>Could not find place!</h2>
        </div>
      );
    }
  
    return (
      <React.Fragment>
        {isLoading && <LoadingSpinner asOverlay/>}
        <ErrorModal error={error} onClear={clearError}/>
        {!isLoading && identifiedPlace && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={identifiedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={identifiedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>}
      </React.Fragment>
    );
  };
  
  export default UpdatePlace;
  