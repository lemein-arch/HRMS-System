import React, { Component } from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import NewRowForm from '../NewRowForm';

class Home extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      data: [],
      showModal: false,
      editRow: {},
      newRow: {
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
      },
      showNewRowForm: false
    };
  }

      componentDidMount() {
        axios
          .get("http://localhost:4000/employee")
          .then((response) => {
            const sortedData = response.data.sort((a, b) => a.id - b.id);
            this.setState({ data: sortedData });
          })
          .catch((error) => {
            console.log(error);
          });
      }
  

      handleAddRow = () => {
        axios
          .post("http://localhost:4000/employee", this.state.newRow)
          .then((response) => {
            const newRow = response.data;
            const updatedRows = [...this.state.data, newRow];
            this.setState({
              data: updatedRows,
              showModal: false,
              newRow: {
                firstName: '',
                middleName: '',
                lastName: '',
                phoneNumber: '',
                email: ''
              },
              showNewRowForm: false
            });
            alert("Added new Employee!")
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      };



      handleEdit = (row) => {
        this.setState({ editRow: row, showModal: true });
      };
    
      handleClose = () => {
        this.setState({ showModal: false });
      };
    
handleSave = (updatedRow) => {
    axios.put(`http://localhost:4000/employee/${updatedRow.id}`, updatedRow)
      .then((response) => {
        // Update the state with the updated row
        const updatedRows = this.state.data.map((row) => {
          if (row.id === updatedRow.id) {
            return updatedRow;
          } else {
            return row;
          }
        });
    
        this.setState({ data: updatedRows, showModal: false });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.firstName}?`)) {
      axios
        .delete(`http://localhost:4000/employee/${row.id}`)
        .then((response) => {
          // Remove the deleted row from the state
          const updatedRows = this.state.data.filter((r) => r.id !== row.id);
          this.setState({ data: updatedRows });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  
      
  handleNewRowChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      newRow: {
        ...this.state.newRow,
        [name]: value,
      },
    });
  };

  handleNewRowSubmit = (event) => {
    event.preventDefault();
    this.handleAddRow();
  };
      
    
      render() {
        const columns = [
            {
                dataField: "id",
                text: "id",
              },

          {
            dataField: "firstName",
            text: "First Name",
          },
          {
            dataField: "middleName",
            text: "Middle Name",
          },
          {
            dataField: "lastName",
            text: "Last Name",
          },

          {
            dataField: "phoneNumber",
            text: "P. Number",
          },

          {
            dataField: "email",
            text: "Email",
            headerStyle: {
              width:'250px'
            }
          },
          {
            text: "Edit",
            formatter: (cell, row) => (
              <button className="btn btn-success" onClick={() => this.handleEdit(row)}>
                Edit
              </button>
            ),
          },
          {
            text: "Delete",
            formatter: (cell, row) => (
              <button className="btn btn-danger" onClick={() => this.handleDelete(row)}>
                Delete
              </button>
            ),
          },

          
          
        ];
        
    
        return (
          <div className="container">
        <h1>Employees Staff Table</h1>
        <br></br>
        <Button onClick={() => this.setState({ showNewRowForm: true })}>Add New Employee</Button>
        <br></br>
        <Modal show={this.state.showNewRowForm} onHide={() => this.setState({ showNewRowForm: false })}>
       <Modal.Header closeButton>
          <Modal.Title>Add New Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <NewRowForm onChange={this.handleNewRowChange} onSubmit={this.handleNewRowSubmit} newRow={this.state.newRow} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.setState({ showNewRowForm: false })}>Close</Button>
              <Button variant="primary" onClick={this.handleNewRowSubmit}>Add Employee</Button>
            </Modal.Footer>
          </Modal>
            <br></br>
            <BootstrapTable keyField="id" data={this.state.data} columns={columns} />
            <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Row</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditRowForm row={this.state.editRow} onSave={this.handleSave} />
          </Modal.Body>
         
        </Modal>
          
          </div>

        );
      }
 
    }
      
      class EditRowForm extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            id: props.row.id,
            firstName: props.row.firstName,
            middleName: props.row.middleName,
            lastName: props.row.lastName,
            phoneNumber: props.row.phoneNumber,
            email: props.row.email,
          };
        }
      
        handleInputChange = (event) => {
          const target = event.target;
          const value = target.type === "checkbox" ? target.checked : target.value;
          const name = target.name;
    
          this.setState({
            [name]: value,
          });
        };
      
        handleSubmit = (event) => {
          event.preventDefault();
          const updatedRow = {
            ...this.props.row,
            firstName: this.state.firstName,
            middleName: this.state.middleName,
            lastName: this.state.lastName,
            phoneNumber:this.state.phoneNumber,
            email:this.state.email

        };

        this.props.onSave(updatedRow);




    };

        render() {
          return (
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleInputChange}
                />
                </div>
        <div className="form-group">
          <label htmlFor="middleName">Middle Name</label>
          <input
            type="text"
            className="form-control"
            id="middleName"
            name="middleName"
            value={this.state.middleName}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={this.state.lastName}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            className="form-control"
            id="phoneNumber"
            name="phoneNumber"
            value={this.state.phoneNumber}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
        </div>
        <br /><br />
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>

      
        );
    };

    

    
 }

 



export default Home;