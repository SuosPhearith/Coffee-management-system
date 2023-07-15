
import "./LoginPage.css"
import request from '../../util/api'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message, Button, Checkbox, Form, Input } from 'antd';
import welcome from '../../image/shop2.jpg'

function LoginPage() {
  const handleLogin = (value) => {
    const params = {
      "username": value.username,
      "password": value.password
    }
    request("Post", "user/login", params).then(res => {
      if (res.data && res.data.login) {
        message.success(res.data.message)
        localStorage.setItem("isLogin", "1");
        localStorage.setItem("profile", JSON.stringify(res.data.data))
        localStorage.setItem("role", res.data.data.Role)
        window.location.href = "/coffee-management-system/"
      } else {
        message.warning(res.data.message)
      }
    }).catch(err => {
      if (err) {
        message.error("Crash server!!")
      }
    })
  }

  const handleContact = () => {
    message.info("Please contact to tel: 069265958")
  }

  return (
    <div className='login_form'>
      <div className="login_wrapper">
        <div className="login_side">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={handleLogin}
          >
            <div className="login_text">Login</div>
            <Form.Item
              style={{ marginTop: 10 }}
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your Username!',
                },
              ]}
            >
              <Input className="username_input" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              style={{ marginTop: 10 }}
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!',
                },
              ]}
            >
              <Input
                className="password_input"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <div className="remember_field">
              <div name="remember" valuePropName="checked" noStyle>
                <Checkbox checked style={{fontSize:15, color:"white"}}>Remember me</Checkbox>
              </div>
              <div className="login-form-forgot" onClick={handleContact} >
                Forgot password
              </div>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="image_side">
              <img src={welcome}></img>
        </div>
      </div>

    </div>
  )
}

export default LoginPage
