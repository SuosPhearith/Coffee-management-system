import React from 'react'
import '../product/ProductPage.css'
import '../../../src/App.css'
import { useEffect, useState } from 'react';
import { Button, Space, Popconfirm, message, Input, Modal, InputNumber, Spin, Table, Upload, Image } from 'antd';
import { DeleteFilled, SaveFilled, EditFilled, CoffeeOutlined, UploadOutlined } from '@ant-design/icons'
import request from '../../util/api';
import imageLink from '../../util/imageLink';
function ProductPage() {

    const [list, setList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [productID, setProductID] = useState(null)
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalRecord, setTotalRecord] = useState(0)
    const [pagination, setPagination] = useState(0)
    const [productImage, setProductImage] = useState("")

    useEffect(() => {
        getList();
    }, [page]);

    const getList = (textSearch = "") => {
        setLoading(true);
        request("get", "product/getList?text_search=" + textSearch + "&page=" + page).then(res => {
            setList(res.data.data)
            setTotalRecord(res.data.total_record)
            setPagination(res.data.pagination)
            setLoading(false);
        }).catch(err => {
            console.log(err)
            message.error("Crash server!!")
        })
    }


    const handleDelete = async (id) => {
        setLoading(true);
        request("delete", "product/remove/" + id).then(res => {
            if (res.data.error) {
                message.error("This product cannot delete!")
                setLoading(false);
                return;
            }
            message.success(res.data.message)
            //setPage(1);
            getList();
            setLoading(false);
        }).catch(err => {
            console.log(err)
            message.error("Crash server!!")
        })
    };

    const { Search } = Input;

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleInsert = () => {
        if (name === "" || price === 0 || price === null || description === "") {
            message.error("Please input all fields!")
            return;
        }
        if (productID == null) {
            setLoading(true);
            const formData = new FormData();
            formData.append("Name", name)
            formData.append("Price", price)
            formData.append("Description", description)
            formData.append("file", productImage)
            request("post", "product/insert", formData).then(res => {
                if (res.data.error) {
                    message.error("Fail insert!!");
                    setIsModalOpen(false);
                    clearData();
                    setLoading(false);
                    return;
                }
                message.success(res.data.message)
                clearData();
                setIsModalOpen(false)
                getList()
                setLoading(false);
            }).catch(err => {
                console.log(err)
                message.error("Crash server!!");
            })
        } else {
            setLoading(true);
            const formData = new FormData();
            formData.append("ProductID", productID)
            formData.append("Name", name)
            formData.append("Price", price)
            formData.append("Description", description)
            formData.append("file", productImage)
            request("put", "product/update", formData).then(res => {
                if (res.data.error) {
                    message.error("Fail update!!");
                    setIsModalOpen(false)
                    clearData();
                    setLoading(false);
                    return;
                }
                message.success(res.data.message)
                setIsModalOpen(false)
                getList()
                setLoading(false);
                clearData()
            }).catch(err => {
                console.log(err);
                message.error("Crash server!!");
            })
        }
    };
    const handleCancel = () => {
        clearData();
        setIsModalOpen(false);
    };

    const clearData = () => {
        setName("");
        setPrice(0);
        setDescription("")
        setProductID(null)
        setProductImage(null)
    }

    const handleUpdate = (id, name, price, productImage, description) => {
        setName(name)
        setPrice(price)
        setDescription(description)
        setProductID(id)
        setProductImage(productImage)
        setIsModalOpen(true)
    }

    const handleSearch = (text) => {
        getList(text);
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
            title: "Price",
            dataIndex: "Price",
            key: (value, record, index) => `no_${index}`
        },
        {
            title: "Description",
            dataIndex: "Description",
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
                            alt='product'
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
                        onConfirm={() => handleDelete(record.ProductID)}
                        //onCancel={cancel}
                        okText="Delete"
                        cancelText="No"
                    >
                        <Button danger><DeleteFilled /> Delete</Button>
                    </Popconfirm>
                    <Button type='primary'
                        onClick={() => handleUpdate(record.ProductID, record.Name, value.Price, value.Image, record.Description)}
                    >
                        <EditFilled />
                        Edit
                    </Button>
                </Space>
            ),
            key: (value, record, index) => `no_${index}`
        }
    ]

    const onChangeImage = (e) => {
        setProductImage(e.file)
    }

    return (
        <div>
            <Spin spinning={loading}>
                <div className='mainName'>
                    <Space className='wrapper'>
                        <h5>Product</h5>
                        <Search
                            placeholder="Search"
                            allowClear
                            onSearch={handleSearch}
                            className='search'
                        />
                    </Space>
                    <Button type='primary' onClick={showModal}>
                        <SaveFilled />New product
                    </Button>
                </div>
                <hr />
                <Table
                    columns={columns}
                    dataSource={list}
                    size="small"
                    pagination={{
                        total: totalRecord,
                        pageSize: pagination,
                        onChange: (page) => {
                            setPage(page)
                        }
                    }}
                />
                <Modal title={productID == null ? "New product" : "Update product"} open={isModalOpen} onOk={handleInsert} onCancel={handleCancel} okText={productID == null ? "Create" : "Update"} className='modal'>
                    <Input className='modal-item'
                        allowClear
                        placeholder='Product name'
                        value={name}
                        onChange={(item) => {
                            setName(item.target.value)
                        }}
                    />
                    <InputNumber className='modal-item3'
                        size="large"
                        addonAfter="$"
                        min={0}
                        max={100000}
                        placeholder='Product price'
                        value={price}
                        onChange={(item) => {
                            setPrice(item)
                            getList()
                        }}
                    />

                    <Input.TextArea className='modal-item2'
                        allowClear
                        placeholder='Product description'
                        value={description}
                        onChange={(item) => {
                            setDescription(item.target.value)
                        }}
                    />
                    <br/> <br/>
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
            </Spin>
        </div>
    )
}

export default ProductPage
