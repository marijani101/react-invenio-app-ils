import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Confirm, Menu } from 'semantic-ui-react';
import { documentApi } from '@api/documents';
import { ESSelectorModal } from '@modules/ESSelector';
import { serializeDocument } from '@modules/ESSelector/serializer';
import get from 'lodash/get';

export class RejectAction extends React.Component {
  state = {
    header: null,
    type: null,
    open: false,
  };

  onCancel = () => {
    this.setState({ open: false });
  };

  onConfirm = type => {
    const { onReject } = this.props;
    this.setState({ open: false });
    onReject({ reject_reason: type });
  };

  onRejectWithDocument = selections => {
    const { onReject } = this.props;

    onReject({
      reject_reason: 'IN_CATALOG',
      document_pid: get(selections, '0.id'),
    });
  };

  onClick = (event, { text, value }) => {
    if (value === 'USER_CANCEL') {
      this.setState({
        header: text,
        type: value,
        open: true,
      });
    } else if (value === 'NOT_FOUND') {
      this.setState({
        header: text,
        type: value,
        open: true,
      });
    } else {
      throw new Error(`Invalid reject type: ${value}`);
    }
  };

  renderOptions() {
    const options = [
      {
        key: 'USER_CANCEL',
        text: 'Cancelled by the user',
        value: 'USER_CANCEL',
        icon: 'user cancel',
      },
      {
        key: 'IN_CATALOG',
        text: 'Document already in catalog',
        value: 'IN_CATALOG',
        icon: 'search',
      },
      {
        key: 'NOT_FOUND',
        text: 'Document not found in any provider',
        value: 'NOT_FOUND',
        icon: 'minus',
      },
    ];
    return options.map(option => {
      const dropdown = <Dropdown.Item {...option} onClick={this.onClick} />;
      if (option.value === 'IN_CATALOG') {
        return (
          <ESSelectorModal
            key={option.value}
            trigger={dropdown}
            query={documentApi.list}
            serializer={serializeDocument}
            title="Reject request: Already in the catalog"
            content="Select document to attach to the reject."
            emptySelectionInfoText="No document selected"
            onSave={this.onRejectWithDocument}
            saveButtonContent="Reject request"
          />
        );
      }
      return dropdown;
    });
  }

  render() {
    const { disabled } = this.props;
    const { header, open, type } = this.state;
    return (
      <Menu secondary compact size="small">
        <Menu.Menu position="right">
          <Dropdown
            disabled={disabled}
            text="Reject request"
            icon="cancel"
            floating
            labeled
            button
            className="icon negative"
          >
            <Dropdown.Menu>
              <Confirm
                confirmButton="Reject request"
                content="Are you sure you want to reject this request?"
                header={`Reject: ${header}`}
                open={open}
                onCancel={this.onCancel}
                onConfirm={() => this.onConfirm(type)}
              />
              <Dropdown.Header content="Specify a reject reason" />
              {this.renderOptions()}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    );
  }
}

RejectAction.propTypes = {
  pid: PropTypes.string.isRequired,
  onReject: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

RejectAction.defaultProps = {
  disabled: false,
};
