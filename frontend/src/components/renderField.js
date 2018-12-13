import React from 'react';

const renderField = ({ input, label, type, placeholder,validationError, meta: { touched, error, warning } }) => {

  return(
  <div>
    <label>{placeholder} </label>
    <input {...input} placeholder={placeholder} type={type}  className={"form-control"}/>
  </div>
)
};

export default renderField;