import React, { Component } from 'react';
import PageCommon from './PageCommon';
import { Button } from 'antd';
import Hoc2 from './hoc2';

@Hoc2('page2')
class Page2 extends Component {
  onEditTap = () => console.log('page2 edit act btn click');
  onDetTap = () => console.log('page2 delete act btn click');
  columns = [
    {
      dataIndex: 'name',
      title: '名称'
    }, {
      dataIndex: 'action',
      title: '操作',
      render: (_, record) => {
        return (
          <>
            <Button type="primary" onClick={this.onEditTap}>编辑</Button>
            <Button type="primary" onClick={this.onDetTap}>删除</Button>
          </>
        )
      }
    }
  ];

  render() {
    return (
      <>
        <h3>Page2</h3>
        <PageCommon {...this.props} columns={this.columns} />
      </>
    )
  }
}

export default Page2;