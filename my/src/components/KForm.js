import React, { Component } from 'react';


// 创建一个高阶组件：拓展现有表单，数据收集、处理、校验，事件处理
function KFormCreate(Comp) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.options = {};
      this.state = {};
    }

    handleChange = e => {
      const { name, value } = e.target
      console.log(name, value)
      this.setState({
        [name]: value
      }, () => {
        this.validateField(name)
      })
    }

    // 创建一个input的包装器
    getFieldDec = (field, option) => {
      this.options[field] = option;
      return InputComp => (
        <div>
          {
            React.cloneElement(InputComp, {
              name: field,
              value: this.state[field] || '',
              onChange: this.handleChange
            })
          }
          {
            this.state[`${field}Msg`] && (
              <p style={{ color: 'red' }}>{ this.state[`${field}Msg`] }</p>
            )
          }
        </div>
      )
    }

    // 单个字段的校验
    validateField = (field) => {
      const rules = this.options[field].rules;
      const ret = !rules.some(rule => {
        if (rule.require) {
          if (!this.state[field]) {
            this.setState({
              [`${field}Msg`]: rule.message
            })
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
      if (ret) {
        this.setState({
          [`${field}Msg`]: ''
        })
      }
      return ret
    }

    // 所有字段的校验
    validate = (cb) => {
      const rets = Object.keys(this.options).map(field => this.validateField(field))

      const isValid = rets.every(ret => ret === true)

      cb(isValid, this.state)
    }

    render() {
      return (
        <Comp getFieldDec={this.getFieldDec} validate={this.validate} />
      )
    }
  }
}

@KFormCreate
class KForm extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  onSubmit = () => {
    this.props.validate((isValid, data) => {
      if (isValid) {
        console.log('登录成功', data)
      } else {
        alert('检验失败')
      }
    })
  }

  render() {
    const { getFieldDec } = this.props;
    return (
      <div>
        {
          getFieldDec('uname', {
            rules: [
              {require: true, message: '用户名必填'}
            ]
          })(<input />)
        }
        {
          getFieldDec('pwd', {
            rules: [
              {require: true, message: '密码必填'}
            ]
          })(<input />)
        }
        <button onClick={this.onSubmit}>提交</button>
      </div>
    )
  }
}

/* const NewForm = KFormCreate(KForm);

export default NewForm; */

export default KForm;