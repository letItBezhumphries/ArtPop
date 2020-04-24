import React, { Fragment, useState } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPortfolio } from '../../actions/admin';

const AddPortfolioForm = ({addPortfolio}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const {
    title,
    description
  } = formData;

  const onChange = e =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  const onSubmit = async e => {
    e.preventDefault();
    addPortfolio({ title, description })
  };

  return (
    <Fragment>
      <h1 className='large text-primary portfolio-form'>Add a Portfolio</h1>

      <form className='portfolio-form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Title of Portfolio'
            name='title'
            value={title}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <textarea
            placeholder='Add a description'
            cols = "30"
            rows = "5"
            name='description'
            value={description}
            onChange={onChange}>    
          </textarea>
        </div>
        
        <input type='submit' className='btn btn-primary' value='Submit'/>
      </form>
    </Fragment>
  );
}

AddPortfolioForm.propTypes = {
  addPortfolio: PropTypes.func.isRequired
};

export default connect(
  null,
  { addPortfolio }
)(AddPortfolioForm);
