import axios from "axios";
import React from "react";

/**
 * A hook to make form submissions and handle errors.
 * @param {string} url endpoint relative to the hostname. Example: 'api/users/{:id}
 * @param {string} method the HTTP method
 * @param {any} body data object
 * @returns {Array}
 */
const useRequest = (url, method, body = null) => {
  const [errors, setErrors] = React.useState(null);

  const makeRequest = async () => {
    try {
      const response = await axios[method](url, body);
      return response.data;
    } catch (error) {
      const errs = error.response.data.errors;
      return setErrors(
        <div className="alert alert-danger">
          <h3>Ooops...</h3>
          <ul>
            {errs.map((e, idx) => (
              <li key={idx}>{errs.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return [makeRequest, errors];
};

export default useRequest;
