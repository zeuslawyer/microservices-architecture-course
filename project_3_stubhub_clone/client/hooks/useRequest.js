import axios from "axios";
import React from "react";

/**
 * A hook to make form submissions and handle errors.
 * @param {string} url endpoint relative to the hostname. Example: 'api/users/{:id}
 * @param {string} method the HTTP method
 * @param {any} body data object
 * @returns {Array} - first item is the makeRequest function, and the second is the errors JSX string to render
 */
const useRequest = (url, method, body = null) => {
  const [errorsJsx, setErrorsJsx] = React.useState(null);

  const makeRequest = async () => {
    try {
      // reset errors state on UI on submit
      setErrorsJsx(null);

      // make request
      const response = await axios[method](url, body);
      return response.data;
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
