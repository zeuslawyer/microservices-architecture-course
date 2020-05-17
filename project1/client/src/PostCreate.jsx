import React from 'react';
import axios from 'axios';

export const PostCreate = () => {
  const [title, setTitle] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('http://localhost:5001/posts', { title });
    setTitle('');
  };

  const handleInput = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div>
      <form>
        <div className='form-group'>
          <label>
            <strong> Title: </strong>{' '}
          </label>
          <input
            className='form-control'
            type='input'
            value={title}
            onChange={handleInput}
          />
        </div>
        <button className='btn btn-primary' onClick={handleSubmit}>
          {' '}
          SUBMIT{' '}
        </button>
      </form>
    </div>
  );
};
