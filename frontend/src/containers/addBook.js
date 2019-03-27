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
import { GET_BOOKS } from './book';
import './style.css';

class AddBook extends React.Component {
	render () {
		const handleForm = (values, mutate) => {
			const { reset } = this.props;
      mutate({ 
				variables: {
					title: values.Title,
					author: values.Author,
				},
				refetchQueries: [{
					query: GET_BOOKS,
				}],
			}).then(() => reset())
  	};
		const { handleSubmit, pristine } = this.props;
		const book = {};
		return (
			<React.Fragment>
				<Mutation
					mutation={
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
					`}
					// update={(proxy, { data: { addBook } }) => {
					// 	try {
					// 		const data = proxy.readQuery({ query: GET_BOOKS });
					// 		data.allBooks.push(addBook);
					// 		proxy.writeQuery({ query: GET_BOOKS, data });
					// 		console.log('update-proxy', proxy, 'addBook', addBook, 'allBooks', data);
					// 	}
					// 	catch (error) {
					// 		console.error(error);
					// 	}
					// 	// const { allBooks } = cache.readQuery({ query: GET_BOOKS });
					// 	// cache.writeQuery({
					// 	// 	query: GET_BOOKS,
					// 	// 	data: { allBooks: allBooks.push(addBook) }
					// 	// });
					// 	// console.log('update-cache', cache, 'addBook', addBook, 'allBooks', allBooks);
					// }}	
				>
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
