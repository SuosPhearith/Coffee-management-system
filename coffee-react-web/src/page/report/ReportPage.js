import React, { useEffect, useState } from 'react'
import '../report/ReportPage.css'
import { DatePicker, Table, Image, message, Spin, Button, Space } from 'antd';
import { CoffeeOutlined } from '@ant-design/icons'
import request from '../../util/api';
import imageLink from '../../util/imageLink';
const { RangePicker } = DatePicker;

function ReportPage() {
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState([])
    const [userList, setUserList] = useState([])
    const [incomeDate, setIncomeDate] = useState(0)
    // const [startDate, setStartDate] = useState("")
    // const [endDate, setEndDate] = useState("")

    const getListProductAnalysis = (startDate, endDate) => {
        setLoading(true);
        request("Get", "dashboard/getListProductAnalysis?start_date=" + startDate + "&end_date=" + endDate).then(res => {
            if (res.data.error) {
                message.error("Cannot get data!!")
                setLoading(false)
                return;
            }
            setList(res.data.data);
            setLoading(false);
        }).catch(error => {
            console.log(error)
            message.error("Crash server!!")
            setLoading(false)
        })
    }

    const getListUserAnalysis = (startDate, endDate) => {
        setLoading(true);
        request("Get", "dashboard/getListUserAnalysis?start_date=" + startDate + "&end_date=" + endDate).then(res => {
            if (res.data.error) {
                message.error("Cannot get data!!")
                setLoading(false)
                return;
            }
            setUserList(res.data.data);
            setLoading(false);
        }).catch(error => {
            console.log(error)
            message.error("Crash server!!")
            setLoading(false)
        })
    }

    const getListIncomeDataToDate = (startDate, endDate) => {
        setLoading(true);
        request("Get", "dashboard/getListIncomeDataToDate?start_date=" + startDate + "&end_date=" + endDate).then(res => {
            if (res.data.error) {
                message.error("Cannot get data!!")
                setLoading(false)
                return;
            }
            setIncomeDate(res.data.data[0].income);
            setLoading(false);
        }).catch(error => {
            console.log(error)
            message.error("Crash server!!")
            setLoading(false)
        })
    }


    useEffect(() => {
        handleDateChange();
        handleDateChange2();
    }, [])

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            const startDate = dates[0].format('YYYY-MM-DD');
            const endDate = dates[1].format('YYYY-MM-DD');
            getListProductAnalysis(startDate, endDate)
            getListIncomeDataToDate(startDate, endDate)
        } else {
            getListProductAnalysis("", "")
            getListIncomeDataToDate("", "")
        }

    }

    const handleDateChange2 = (dates) => {
        if (dates && dates.length === 2) {
            const startDate = dates[0].format('YYYY-MM-DD');
            const endDate = dates[1].format('YYYY-MM-DD');
            getListUserAnalysis(startDate, endDate)
        } else {
            getListUserAnalysis("", "")
        }

    }

    const handleDownload = () =>{
        message.warning("This function not yet to release!!")
    }

    const columns2 = [
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
            title: "Sale Item Amount",
            dataIndex: "TotalSaleItems",
            key: (value, record, index) => `no_${index}`
        }

    ]

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
            title: "Total Sale",
            dataIndex: "totalQuantitiy",
            key: (value, record, index) => `no_${index}`
        },
        {
            title: "Total Income",
            dataIndex: "totalPrice",
            key: (value, record, index) => `no_${index}`
        }
    ]

    const totalSum = list.reduce((acc, product) => acc + product.totalPrice, 0);

    return (
        <Spin spinning={loading}>
            <div className='report_container'>
                <div className='report_search'>
                    <h2>Product Report</h2>
                    <div className='rangeDate'>
                        <Space>
                            <RangePicker onChange={handleDateChange} />
                            <h3 className='total7'> Total : {totalSum}$</h3>
                            <h3 className='total8'> Any Discount : {incomeDate}$</h3>
                        </Space>

                    </div>
                    <Button type='primary' onClick={handleDownload}>Download Report</Button>
                </div>
                <hr></hr>
                <div className='report_table'>
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
                </div>
                <hr className='makeFine'></hr>
                <div className='report_search'>
                    <h2>User Report</h2>
                    <div className='rangeDate'>
                        <Space>
                            <RangePicker onChange={handleDateChange2} />
                        </Space>

                    </div>
                    <Button type='primary' onClick={handleDownload}>Download Report</Button>
                </div>
                <hr></hr>
                <div className='report_table'>
                    <Table
                        columns={columns2}
                        dataSource={userList}
                        size="small"
                        pagination={
                            {
                                pageSize: 5
                            }
                        }
                    />
                </div>
            </div>
        </Spin>
    )
}

export default ReportPage
