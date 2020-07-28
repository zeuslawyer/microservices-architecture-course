import axios from "axios";
import React from "react";

/**
 * A hook to make form submissions and handle errors.
 * @param {string} url endpoint relative to the hostname. Example: 'api/users/{:id}
 * @param {string} method the HTTP method
 * @param {any} body data object
 * @param {function} onSuccess callback to invoke on success. Data returned from the endpoint is passed in as the argument.
 * @returns {Array} - first item is the makeRequest function, and the second is the errors JSX string to render
 */
const useRequest = (url, method, body = null, onSuccess) => {
  const [errorsJsx, setErrorsJsx] = React.useState(null);

  // helper func to return
  const makeRequest = async () => {
    try {
      // reset errors state on UI on submit
      setErrorsJsx(null);

      // make request
      const response = await axios[method](url, body);

      // if success callback exists, then call it
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      const errs = error.response.data.errors;
      return setErrorsJsx(
        <div className="alert alert-danger">
          <h3>Ooops...</h3>
          <ul>
            {errs.map((e, idx) => (
              <li key={idx}>{e.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return [makeRequest, errorsJsx];
};

export default useRequest;
