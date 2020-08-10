import React, { Component } from 'react';
import { connect } from 'react-redux';

class Groups extends Component {
  render() {
    let groupsContent;

    return (
      <div className="groups text-center">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-2">Groups</h1>
              {groupsContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const addStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(addStateToProps, {})(Groups);
