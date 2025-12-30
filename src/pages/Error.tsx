import React from 'react';

import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function Error() {
    const error: unknown = useRouteError();
    let errorMessage: string;
    // console.error(error);

    if (isRouteErrorResponse(error)) {
        // error is an ErrorResponse 
        errorMessage = error.data || error.statusText || error.status;
    } else if (error instanceof Error) {
        // error is a standard JS Error 
        errorMessage = (error as Error).message;
    } else {
        errorMessage = 'Something unexpected happened, and we don\'t know what.';
    }

    return (
        <div id="error-page">
            <h2 
                style={{ color: 'white' }}
            >
                Whoops...
            </h2>
            <p>
                Something unexpected happened. Try again later...
            </p>
            <p>
                <i>{errorMessage}</i>
            </p>
        </div>
    );
}
