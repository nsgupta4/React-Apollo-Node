import React from 'react';
import gql from "graphql-tag";
import {
	Query
} from "react-apollo";
import ReactTable from 'react-table';
import { Button, ButtonGroup } from 'reactstrap';
import UpdateModal from './modal';
import './style.css';

const GET_BOOKS = gql`
  {
    allBooks {
      id
			title
			author {
				id
				name
			}
    }
  }
`;

class Book extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			delete: false,
			book: {},
		};

		this.toggle = this.toggle.bind(this);
		this.deleteToggle = this.deleteToggle.bind(this);
		this.initForm = this.initForm.bind(this);
	}

	toggle() {
		this.setState({
			open: !this.state.open,
			delete: false,
		});
	}

	deleteToggle(row) {
		this.setState({
			open: !this.state.open,
			delete: !this.state.delete,
			book: {
				bookId: row.original.id,
				authorId: row.original.author.id,
			}
		});
	}

	initForm(row) {
		const { title, author, id } = row.original;
		console.log('initForm', row);
		const book = {
			title,
			author: author.name,
			authorId: author.id,
			bookId: id,
		}
		this.setState({
			book
		});
	}

	render() {
		return (

			<Query query={GET_BOOKS}>
				{({ loading, error, data }) => {
					console.log('frontend', data);
					if (loading) return "Loading...";
					if (error) return `Error! ${error.message}`;
					
					return (
						<div className="table_primary">
							<ReactTable
								data={data.allBooks}
								columns={[{
									Header: 'Id',
									id: 'id',
									accessor: 'id',
								}, 
								{
									Header: 'Title',
									id: 'Title',
									accessor: 'title',
									},
									{
										Header: 'Author',
										id: 'name',
										accessor: 'author.name',
									},
								{
									sortable: false,
									Cell: row => (
										<ButtonGroup>
											<Button outline color="success" size="sm" className="btn-pill" onClick={() => {
												this.initForm(row);
												this.toggle();
											}}>Update</Button>
											<Button outline color="danger" size="sm" className="btn-pill" onClick={() => { 
												this.deleteToggle(row);
											}}>Delete</Button>
										</ButtonGroup>
									)
								}
								]}
								defaultPageSize={5}
								showPagination={true}
								className="-striped -highlight"
							/>
							<UpdateModal modal={this.state.open} toggle={this.toggle} deleteToggle={this.state.delete} book={this.state.book} />
						</div>
					);
				}}
			</Query>
		);
	}
}

export default Book;