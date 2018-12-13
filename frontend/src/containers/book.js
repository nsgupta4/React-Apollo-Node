import React from 'react';
import gql from "graphql-tag";
import {
	Query
} from "react-apollo";
import ReactTable from 'react-table';
import { Button, ButtonGroup } from 'reactstrap';
import UpdateModal from './modal';

const GET_BOOKS = gql`
  {
    allBooks {
      id
      title
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
				id: row.original.id,
			}
		});
	}

	initForm(row) {
		const { title, author } = row.original;
		const book = {
			title,
			author,
		}
		this.setState({
			book
		});
	}

	render() {
		return (

			<Query query={GET_BOOKS}>
				{({ loading, error, data }) => {
					if (loading) return "Loading...";
					if (error) return `Error! ${error.message}`;
		
					return (
						<React.Fragment>
						
							<ReactTable
								data={data.allBooks}
								columns={[{
									Header: 'Id',
									id: 'id',
									accessor: 'id',
								}, 
								{
									Header: 'Name',
									id: 'name',
									accessor: 'title',
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
						</React.Fragment>
					);
				}}
			</Query>
		);
	}
}

export default Book;