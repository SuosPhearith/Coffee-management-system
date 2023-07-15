import React from 'react'
import request from '../../util/api'
import { useEffect, useState } from 'react';
import { Button, Space, Popconfirm, message, Input, Modal, Spin, Table, Upload, Radio, Image } from 'antd';
import { DeleteFilled, SaveFilled, EditFilled, UploadOutlined, CoffeeOutlined } from '@ant-design/icons'
import imageLink from '../../util/imageLink';
import "../user/UserPage.css"

function UserPage() {

  const [list, setList] = useState([])
  const [userID, setUserID] = useState("")
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("employee")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState("")
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    getList();
  }, []);
  const { Search } = Input;

  const getList = (text_search = "") => {
    request("get", "user/getList?text_search=" + text_search).then(res => {
      if (res) {
        setList(res.data.data)
      } else {
        message.error("Cannot retrieve data!!")
      }
    }).catch(err => {
      console.log(err)
      message.error("Crash server!!")
    })
  }

  const handleInsert = () => {
    if (userID === null || userID === "") {
      if (name === "" || username === "") {
        message.warning("Please input all field!")
      } else {
        setLoading(true)
        const formData = new FormData();
        formData.append('Name', name)
        formData.append('Username', username)
        formData.append('Password', password)
        formData.append('Role', role)
        formData.append('file', file)
        request("Post", "user/create", formData).then(res => {
          if (res.data.message !== "Insert success!!") {
            message.error(res.data.message)
            setLoading(false)
          } else {
            setLoading(false)
            message.success(res.data.message)
            getList()
            handleCancel()
          }
        }).catch(err => {
          console.log(err)
          message.error("Crash server!")
          setLoading(false)
        })
      }
    } else {
      if (isNull(userID) || isNull(name) || isNull(username) || isNull(password) || isNull(role)) {
        message.error("Please input all fields!!")
        return;
      } else {
        const formData = new FormData();
        formData.append("UserID", userID)
        formData.append("Name", name)
        formData.append("Username", username)
        formData.append("Password", password)
        formData.append("file", file)
        formData.append("Role", role)
        request("put", "user/update", formData).then(res => {
          if (res.data.message !== "Update successfully!") {
            message.error(res.data.message)
            setLoading(false)
          } else {
            setLoading(false)
            message.success(res.data.message)
            getList()
            handleCancel()
          }

        }).catch(err => {
          console.log(err)
          message.error("Crash server!!")
        })
      }
    }

  }

  const handleSearch = (text) => {
    getList(text)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const columns = [
    {
      title: "No",
      render: (value, record, index) => (index + 1),
      key: (value, record, index) => `no_${index}`
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: (value, record, index) => `no_${index}`
    },
    {
      title: "Username",
      dataIndex: "Username",
      key: (value, record, index) => `no_${index}`
    },
    {
      title: "Role",
      dataIndex: "Role",
      key: (value, record, index) => `no_${index}`
    },
    {
      title: "Image",
      dataIndex: "Image",
      render: (item) => {
        return <div>
          {item != null ?
            <Image
              src={imageLink + item}
              alt='user'
              width={100}
              height={70}
            />
            : <CoffeeOutlined />
          }
        </div>
      },
      key: (value, record, index) => `no_${index}`
    },
    {
      title: "Action",
      render: (value, record) => (
        <Space>
          <Popconfirm
            title="Delete the product"
            description="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.UserID)}
            //onCancel={cancel}
            okText="Delete"
            cancelText="No"
          >
            <Button danger><DeleteFilled /> Delete</Button>
          </Popconfirm>
          <Button type='primary'
            onClick={() => handleUpdate(record.UserID, record.Name, value.Username, value.Password, record.Image, record.Role)}
          >
            <EditFilled />
            Edit
          </Button>
          <Button type='primary'
            onClick={() => handleChangePassword(record.UserID)}
          >
            <EditFilled />
            Change password
          </Button>
        </Space>
      ),
      key: (value, record, index) => `no_${index}`
    }
  ]

  const handleDelete = (id) => {
    if (id === null || id === "") {
      message.error("ID not found!")
    } else {
      setLoading(true)
      request("Delete", "user/remove/" + id).then(res => {
        if (res.data.error) {
          message.error("This user cannot delete!!")
          setLoading(false)
          return
        } else {
          if (res.data.message !== "Delete successfully!") {
            message.error(res.data.message)
            setLoading(false)
          } else {
            message.success(res.data.message)
            getList()
            setLoading(false)
          }

        }
      }).catch(err => {
        console.log(err);
        message.error("Crash server!!")
      })
    }
  }

  const isNull = (value) => {
    return value === "" || value === null;
  }

  const handleUpdate = (UserID, Name, Username, Password, Imaged, Role) => {
    setUserID(UserID)
    setName(Name)
    setUsername(Username)
    setPassword(Password)
    setFile(Imaged)
    setRole(Role)
    setIsModalOpen(true)
  }

  const changePassword = () => {
    if(password === "" || confirmPassword === "" || userID === ""){
      message.warning("Please input all fields!")
      return;
    }
    setLoading(true)
    if (password !== confirmPassword) {
      message.error("Please check confirm password!!")
      setLoading(false)
      return;
    } else {
      request("Put", "user/resetPassword", {
        "UserID": userID,
        "newPassword": password,
        "confirmNewPassword": confirmPassword
      }).then(res => {
        if(res.data.message !== "Updated success!!"){
          setLoading(false)
          message.error(res.data.message)
          return;
        }
        message.success(res.data.message)
        setLoading(false)
        handleClear()
        setIsModalOpen2(false)
      }).catch(err => {
        message.error("Crash server!!")
        console.log(err)
        setLoading(false)
      })
    }

  }


  const handleChangePassword = (UserID) => {
    setIsModalOpen2(true)
    setUserID(UserID)

  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
    handleClear()
  }

  const onChangeImage = (file) => {
    setFile(file.file)
  }


  const handleCancel = () => {
    setIsModalOpen(false)
    handleClear()

  }

  const handleClear = () => {
    setUserID("")
    setFile("employee")
    setFile(null)
    setName("")
    setPassword("")
    setRole("employee")
    setUsername("")
    setConfirmPassword("")
  }

  const onChange = (e) => {
    setRole(e.target.value);
  };


  return (
    <div>
      <Spin spinning={loading}>
        <div className='mainName'>
          <Space className='wrapper'>
            <h5>Uers</h5>
            <Search
              placeholder="Search"
              allowClear
              onSearch={handleSearch}
              className='search'
            />
          </Space>
          <Button type='primary'
            onClick={showModal}
          >
            <SaveFilled />New product
          </Button>
        </div>
        <hr />
        <Table
          columns={columns}
          dataSource={list}
          size="small"
          pagination={
            {
              pageSize: 5
            }
          }
        />
        <Modal title={userID === "" ? "New user" : "Update user"} open={isModalOpen} onOk={handleInsert} onCancel={handleCancel} okText={userID === "" ? "Create" : "Update"} className='modal'>
          <Input className='modal-item'
            allowClear
            placeholder='Name'
            value={name}
            onChange={(item) => {
              setName(item.target.value)
            }}
          />
          <Input className='modal-item'
            allowClear
            placeholder='Username'
            value={username}
            onChange={(item) => {
              setUsername(item.target.value)
            }}
          />
          {userID === "" ?
            <Input.Password className='modal-item'
              allowClear
              placeholder='Password'
              value={password}
              onChange={(item) => {
                setPassword(item.target.value)
              }}
            />
            : ""}

          <Radio.Group className='modal-item' onChange={onChange} value={role}>
            <Radio value={'employee'}>Employee</Radio>
            <Radio value={'admin'}>Admin</Radio>
          </Radio.Group>
          <br /> <br />
          <Upload
            accept="image/*"
            customRequest={onChangeImage}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} type="primary">
              Upload Image
            </Button>
          </Upload>
        </Modal>
        <Modal title="Reset and Change Password" open={isModalOpen2} onOk={changePassword} onCancel={handleCancel2} okText="Reset and Change">
          <Input.Password className='modal-item'
            allowClear
            placeholder='New password'
            value={password}
            onChange={(item) => {
              setPassword(item.target.value)
            }}
          />
          <Input.Password className='modal-item'
            allowClear
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(item) => {
              setConfirmPassword(item.target.value)
            }}
          />
        </Modal>

      </Spin>
    </div>
  )
}

export default UserPage
