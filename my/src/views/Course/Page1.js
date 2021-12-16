import React, { Component } from 'react';
import PageCommon from './PageCommon';
import { Button } from 'antd';
import Hoc from './hoc';

class Page1 extends Component {
  columns = [
    {
      dataIndex: 'label',
      title: '标签'
    }, {
      dataIndex: 'action',
      title: '操作',
      render: (_, record) => {
        const onTap = () => console.log('page1 act btn click');
        return (
          <Button type="primary" onClick={onTap}>Tap</Button>
        )
      }
    }
  ];

  render() {
    console.log('page1 render:', {...this.props})
    return (
      <>
        <h3>Page1</h3>
        <PageCommon {...this.props} columns={this.columns} />
      </>
    )
  }
}

export default Hoc(Page1, 'Page1');