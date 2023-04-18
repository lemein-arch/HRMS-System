import React from 'react';

class NewRowForm extends React.Component {
    render() {
      return (
        <form>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" className="form-control" id="firstName" name="firstName" value={this.props.newRow.firstName} onChange={this.props.onChange} />
          </div>
          <div className="form-group">
            <label htmlFor="middleName">Middle Name</label>
            <input type="text" className="form-control" id="middleName" name="middleName" value={this.props.newRow.middleName} onChange={this.props.onChange} />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" className="form-control" id="lastName" name="lastName" value={this.props.newRow.lastName} onChange={this.props.onChange} />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="text" className="form-control" id="phoneNumber" name="phoneNumber" value={this.props.newRow.phoneNumber} onChange={this.props.onChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" name="email" value={this.props.newRow.email} onChange={this.props.onChange} />
          </div>
        </form>
      );
    }
  }

export default NewRowForm;