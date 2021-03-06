import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Input } from 'antd';
import BackButton from '../BackButton';
import AddSnapshotSlider from '../AddSnapshotSlider';

import * as workspaceSelectors from '../../store/Workspaces/selectors';
import * as entryActions from '../../store/Entries/actions';

import './AddSnapshot.css';

class AddSnapshot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      score: [],
    };
  }

  onNameChange = (e) => {
    this.setState({
      title: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { workspaceId, entryId } = this.props;
    const { title, score } = this.state;
    const data = { title, score };
    // dispatch to addSnapshot action
    this.props.addSnapshot(workspaceId, entryId, data);
  };

  addEnablerScoreToState = (enablerScore) => {
    this.setState({
      score: [...this.state.score, enablerScore],
    });
  };

  renderEnablers = () => {
    const { enablers } = this.props;
    return enablers.map(enabler => (
      <AddSnapshotSlider
        key={`enabler: ${enabler}`}
        enabler={enabler}
        finalValue={enablerScore => this.addEnablerScoreToState(enablerScore)}
      />
    ));
  };

  render() {
    return (
      <div className="container">
        <BackButton>Cancel</BackButton>
        <div className="panel add-snapshot-panel">
          <p className="h4">New Snapshot</p>
          <form onSubmit={this.onSubmit}>
            <span>Name:</span>
            <Input value={this.state.title} onChange={this.onNameChange} />
            {this.renderEnablers()}
            <button type="submit" className="button">
              Add
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { workspaceId, entryId } = ownProps.location.state;
  const enablers = workspaceSelectors.getEnablers(state, workspaceId);

  return {
    workspaceId,
    entryId,
    enablers,
  };
};

const mapDispatchToProps = dispatch => ({
  addSnapshot: (workspaceId, entryId, data) =>
    dispatch(entryActions.addSnapshot(workspaceId, entryId, data)),
});

AddSnapshot.propTypes = {
  addSnapshot: PropTypes.func,
  enablers: PropTypes.array,
  entryId: PropTypes.string,
  workspaceId: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSnapshot);
