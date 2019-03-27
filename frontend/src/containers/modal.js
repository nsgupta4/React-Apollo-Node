import React from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
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
		const { book, deleteToggle } = this.props;
		console.log('handleForm', this.props, values, data);
		deleteToggle ? mutate({
			variables: {
				id: book.bookId,
				authorId: book.authorId,
			}
		}) : mutate({
			variables: {
				id: book.bookId,
				authorId: book.authorId,
				title: values.title,
				author: values.author,
			}
		});
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
          <ModalHeader toggle={toggle}>Modal title</ModalHeader>
          <ModalBody>
            <Mutation mutation={book && !book.author ? deleteMutation : updateMutation}>
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
											<Row>
												<Col md="4">
												</Col>
												<Col md="4">
													<Button type="submit" disabled={pristine}>
														Update
													</Button>
												</Col>
												<Col md="4">
												</Col>
											</Row>
										</form> : 
										<div>
											<form onSubmit={handleSubmit((values) => this.handleForm(values, mutate, data))}>
											<p>Are you sure?</p>
											<Button color="danger">Delete</Button>
											</form>
										</div>
									}
									</React.Fragment>
							)}
						}			
    				</Mutation>
          </ModalBody>
					<ModalFooter>
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
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