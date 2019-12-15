import React, {useState, useCallback, useRef, useEffect} from 'react'

export const useHttpClient = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    const activeHttpRequests = useRef([])

    const sendRequest = useCallback( async (url, method = 'GET', headers = {}, body = null) => {

        const httpAbortController = new AbortController()
        activeHttpRequests.current.push(httpAbortController)
        try {
            setIsLoading(true)
            setError(null)
            const response = await fetch( url, {
                method,
                body,
                headers,
                signal: httpAbortController.signal
            })

            // Removing current abortController as the request has already completed
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqController => reqController !== httpAbortController
            )

            const responseData = await response.json()
            if(!response.ok){
                throw new Error(responseData.message)
            }

            setIsLoading(false)
            return responseData
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again")
            setIsLoading(false)
            throw err
        }
    }, [])

    const clearError = () => {
        setError(null)
    }

    useEffect( () => {
        return () => {activeHttpRequests.current.forEach( abortController => abortController.abort() )}
    } ,[])

    return {isLoading, error, sendRequest, clearError}
}