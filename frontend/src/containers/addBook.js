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
											title
									}
							}
					`}>
					{(mutate, { data }) => (
						<Card>
						<CardBody>						
						<Row>
							<Col md="4">
							</Col>
							<Col md="4">
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
									<div>
										<Button type="submit" disabled={pristine}>
											ADD
										</Button>
									</div>
								</form>
							</Col>
							<Col md="4">
							</Col>
						</Row>
						</CardBody>
						</Card>
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
