import React from 'react';
import {
	connect
} from 'react-redux';
import {
	Field,
	reduxForm,
} from 'redux-form';
import renderField from '../components/renderField';
import {
	Button,
	Row,
	Col,
	Card,
	CardBody,
} from 'reactstrap';
import validate from '../components/validate';
import gql from 'graphql-tag';
import { Mutation } from "react-apollo";
import './style.css';

class AddBook extends React.Component {
	render () {
		const handleForm = (values, mutate, data) => {
			console.log('handleForm', data);
      mutate({ 
				variables: { 
					title: values.Title,
					author: values.Author,
				} 
			});
  	};
  	const { handleSubmit, pristine } = this.props;
		return (
			<React.Fragment>
				<Mutation mutation={
					gql `mutation addBook($title: String!, $author: String!) {
									addBook(title: $title, author: $author) {
											id
											title
											author {
												id
												name
											}
									}
							}
					`}>
					{(mutate, { data }) => (					
						<Row>
							<Col md="4">
							</Col>
							<Col md="4" className="addBook">
								<Card>
								<CardBody>	
								<form onSubmit={handleSubmit((values) => handleForm(values, mutate, data))}>
									<Field
										name="Title"
										component={renderField}
										type="text"
										placeholder="title"
									/>
									<Field
										name="Author"
										component={renderField}
										type="text"
										placeholder="author"
									/>
									<div className="button_primary">
										<Button type="submit" disabled={pristine}>
											ADD
										</Button>
									</div>
									</form>
									</CardBody>
								</Card>
							</Col>
							<Col md="4">
							</Col>
						</Row>
					)}
    		</Mutation>
			</React.Fragment>	
		);
	}
}

const Form = reduxForm({
	form: 'simple',
	validate
})(AddBook);

export default connect(null)(Form);
