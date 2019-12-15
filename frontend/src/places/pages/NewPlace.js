import React, {useCallback, useReducer, useContext} from 'react';
import { useHistory } from 'react-router-dom'

import './NewPlace.css';
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/util/validators';
import {useForm} from '../../shared/components/hooks/form-hook'
import { AuthContext } from '../../shared/components/context/auth-context'
import { useHttpClient } from '../../shared/components/hooks/http-hook'
import LoadinSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'

const NewPlace = () => {

    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const history = useHistory()

    const [formState, inputHandler] = useForm(
        {
          title: {
            value: '',
            isValid: false
          },
          description: {
            value: '',
            isValid: false
          },
          address: {
            value: '',
            isValid: false
          }
        },
        false
      );

    const placeSubmitHandler = async event => {
      event.preventDefault()

      try {
        const responseData = await sendRequest('http://localhost:5000/api/places',
        'POST',
        {
            'Content-Type': 'application/json'
        },
        JSON.stringify( {
            title: formState.inputs.title.value,
            description: formState.inputs.description.value,
            address: formState.inputs.description.value,
            creator: auth.userId,
        }) )
        console.log(responseData)    
        history.push('/')
      } catch (err) {
        console.log(err)
      }
    }

    return(
        <React.Fragment>
          {isLoading && <LoadinSpinner asOverlay />}
          <ErrorModal error={error} onClear={clearError}/>
          <form className="place-form" onSubmit={placeSubmitHandler}>
              <Input
                  id="title"
                  element="input"
                  type="text"
                  label="Title"
                  onInput={inputHandler}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid title."
              />
              <Input
                  id="description"
                  element="textarea"
                  type="text"
                  label="Title"
                  onInput={inputHandler}
                  validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                  errorText="Please enter a valid description (min length 5)."
              />
              <Input
                  id="address"
                  element="input"
                  type="text"
                  label="Address"
                  onInput={inputHandler}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid address."
              />
              <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
          </form>
        </React.Fragment>
    );
}

export default NewPlace;