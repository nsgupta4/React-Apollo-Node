import React from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
} from 'reactstrap';
import {
    connect
} from 'react-redux';
import {
    Field,
    reduxForm,
} from 'redux-form';
import renderField from '../components/renderField';
import validate from '../components/validate';
import gql from 'graphql-tag';
import {
    Mutation
} from "react-apollo";
import { GET_BOOKS } from './book';

const updateMutation = gql `mutation updateBook($id: String!, $authorId: String!, $title: String!, $author: String!) {
	updateBook(id: $id, authorId: $authorId, title: $title, author: $author) {
			id
			title
			author {
				id
				name
			}
	}
}`;

const deleteMutation = gql `mutation deleteBook($id: String!, $authorId: String!) {
	deleteBook(id: $id, authorId: $authorId) {
			id
			title
	}
}`;

class UpdateModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			book: {
				title: '',
				author: '',
			},
		};
		this.handleForm = this.handleForm.bind(this);
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		if(nextProps.book !== prevState.book) {
			nextProps.book && UpdateModal.handleInitialize(nextProps);
			return { book: nextProps.book };
		}
		return null;
	}
	static handleInitialize(props) {
		const initData = {
			"title": props.book.title,
			"author": props.book.author,
		};
		props.book.title && props.initialize(initData);
	}
	handleForm = (values, mutate, data) => {
		const { book, deleteToggle, toggle } = this.props;
		console.log('handleForm', this.props, values, data);
		deleteToggle ? mutate({
			variables: {
				id: book.bookId,
				authorId: book.authorId,
			},
			// refetchQueries: [{
			// 	query: GET_BOOKS,
			// }],
		}).then(() => toggle())
			: mutate({
			variables: {
				id: book.bookId,
				authorId: book.authorId,
				title: values.title,
				author: values.author,
			},
		}).then(() => toggle());
	};

	render () {
	const {
		handleSubmit,
		pristine,
		modal,
		toggle,
		deleteToggle,
		book,
	} = this.props;
    return (
      <div>
        <Modal isOpen={modal} toggle={toggle} className={this.props.className}>
          <ModalHeader toggle={toggle}>Update & delete book</ModalHeader>
          <ModalBody>
						<Mutation
							mutation={book && !book.author ? deleteMutation : updateMutation}
							update={(cache, { data: { deleteBook } }) => {
								if (book && !book.author) {
									console.log('update-cache', cache);
									const { allBooks } = cache.readQuery({ query: GET_BOOKS });
									cache.writeQuery({
										query: GET_BOOKS,
										data: { allBooks: allBooks.filter(e => e.id !== book.bookId) }
									});
								}
							}}
						>
						{(mutate, { data }) => {
					 		return (
								 <React.Fragment>
										{ !deleteToggle ? <form onSubmit={handleSubmit((values) => this.handleForm(values, mutate, data))}>
											<Field
												name="title"
												component={renderField}
												type="text"
												placeholder="title"
											/>
											<Field
												name="author"
												component={renderField}
												type="text"
												placeholder="author"
											/>
												<div md="4" className="text-center button_primary">
													<Button type="submit" disabled={pristine}>
														Update
													</Button>
												</div>
										</form> : 
										<div>
											<form onSubmit={handleSubmit((values) => this.handleForm(values, mutate, data))}>
												<p>Are you sure?</p>
												<div className="text-center button_primary">
													<Button color="danger">Delete</Button>
												</div>
											</form>
										</div>
									}
									</React.Fragment>
							)}
						}			
    				</Mutation>
					</ModalBody>
				</Modal>
      </div>
		);
	}
}

const Form = reduxForm({
	form: 'update',
	validate
})(UpdateModal);

export default connect(null)(Form);