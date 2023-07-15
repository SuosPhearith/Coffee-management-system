import React, { useEffect, useState } from 'react'
import "../dashboard/DashboardPage.css"
import { RightOutlined, EllipsisOutlined, DollarOutlined, CoffeeOutlined, StarFilled, ThunderboltFilled, ArrowUpOutlined,UserSwitchOutlined } from '@ant-design/icons'
import firstImage from "../../image/first.png"
import secondImage from "../../image/second1.png"
import thirdImage from "../../image/third.png"
import request from '../../util/api'
import { Spin, message } from 'antd'
function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState(0);
  const [salesItem, setSalesItem] = useState(0);
  const [item, setItem] = useState(0);
  const [income, setIncome] = useState(0)
  const [admin, setAdmin] = useState(0)
  const [employee, setEmployee] = useState(0)

  const currentDate = new Date().toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const getListOrders = () => {
    setLoading(true);
    request("Get", "dashboard/getListOrders").then(res => {
      if (res.data.error) {
        message.error("Cannot get data!!")
        setLoading(false)
        return;
      }
      setSales(res.data.data[0].totalOrder);
      setLoading(false);
    }).catch(error=>{
      console.log(error)
      message.error("Crash server!!")
      setLoading(false)
    })
  }

  const getListSaleItem = () => {
    setLoading(true);
    request("Get", "dashboard/getListSaleItem").then(res => {
      if (res.data.error) {
        message.error("Cannot get data!!")
        setLoading(false)
        return;
      }
      setSalesItem(res.data.data[0].totalOrderItem);
      setLoading(false);
    }).catch(error=>{
      console.log(error)
      message.error("Crash server!!")
      setLoading(false)
    })
  }

  const getListItem = () => {
    setLoading(true);
    request("Get", "dashboard/getListItem").then(res => {
      if (res.data.error) {
        message.error("Cannot get data!!")
        setLoading(false)
        return;
      }
      setItem(res.data.data[0].AllItems);
      setLoading(false);
    }).catch(error=>{
      console.log(error)
      message.error("Crash server!!")
      setLoading(false)
    })
  }
  
  const getListIncome = () => {
    setLoading(true);
    request("Get", "dashboard/getListIncome").then(res => {
      if (res.data.error) {
        message.error("Cannot get data!!")
        setLoading(false)
        return;
      }
      setIncome(res.data.data[0].income);
      setLoading(false);
    }).catch(error=>{
      console.log(error)
      message.error("Crash server!!")
      setLoading(false)
    })
  }
  
  const getListAdmin = () => {
    setLoading(true);
    request("Get", "dashboard/getListAdmin").then(res => {
      if (res.data.error) {
        message.error("Cannot get data!!")
        setLoading(false)
        return;
      }
      setAdmin(res.data.data[0].admin);
      setLoading(false);
    }).catch(error=>{
      console.log(error)
      message.error("Crash server!!")
      setLoading(false)
    })
  }
  const getListEmployee = () => {
    setLoading(true);
    request("Get", "dashboard/getListEmployee").then(res => {
      if (res.data.error) {
        message.error("Cannot get data!!")
        setLoading(false)
        return;
      }
      setEmployee(res.data.data[0].employee);
      setLoading(false);
    }).catch(error=>{
      console.log(error)
      message.error("Crash server!!")
      setLoading(false)
    })
  }

  useEffect(()=>{
    getListOrders()
    getListSaleItem()
    getListItem()
    getListIncome()
    getListAdmin()
    getListEmployee()

  },[])

  const handleDownload = () =>{
    message.warning("This function not yet to release!!")
  }
  const handleDate = () =>{
    message.success(`Happy on ${currentDate}`)
  }

  return (
    <Spin spinning = {loading}>
      <div className='container_dashboard'>
        <div className='wrapper_one'>
          <div className='dashboard'>
            <div className='dashboard_text'>Dashboard</div>
            <div className='dashboard_info'>App <RightOutlined /> Dashboard <RightOutlined /> Analytics</div>
          </div>
          <div className='button_field'>
            <button className='btn_one' onClick={handleDate}>{currentDate}</button>
            <button className='btn_two' onClick={handleDownload}>Download Report</button>
          </div>
        </div>
        <div className='wrapper_two'>
          <div className='field1'>
            <div className='field_one'>
              <div className='top'>
                <div className='icon'>
                  <StarFilled />
                </div>
                <div className='information1'>Admins</div>
              </div>
              <div className='middle'>
                <div className='data'>{admin}</div>
                <div className='high'>High {admin} <ArrowUpOutlined /></div>
              </div>
              <div className='under'>Total of admin in shop</div>
            </div>
          </div>
          <div className='field1 field2'>
            <div className='field_one'>
              <div className='top'>
                <div className='icon icon2'>
                  <ThunderboltFilled />
                </div>
                <div className='information1'>Employees</div>
              </div>
              <div className='middle'>
                <div className='data'>{employee}</div>
                <div className='high'>High {employee} <ArrowUpOutlined /></div>
              </div>
              <div className='under'>Total of employee in shop</div>
            </div>
          </div>
          <div className='field1 field3'>
            <div className='field_one'>
              <div className='top'>
                <div className='icon icon3'>
                  <CoffeeOutlined />
                </div>
                <div className='information1'>Items</div>
              </div>
              <div className='middle'>
                <div className='data'>{item}</div>
                <div className='high'>High {item} <ArrowUpOutlined /></div>
              </div>
              <div className='under'>Total item in shop</div>
            </div>
          </div>
          <div className='field1 field4'>
            <div className='field_one'>
              <div className='top'>
                <div className='icon icon4'>
                  <DollarOutlined />
                </div>
                <div className='information1'>Income</div>
              </div>
              <div className='middle'>
                <div className='data'>{income}$</div>
                <div className='high'>High {income} <ArrowUpOutlined /></div>
              </div>
              <div className='under'>Total income of shop</div>
            </div>
          </div>

        </div>
        <div className='wrapper_three'>
          <div className='dash_card'>
            <div className='card1'>
              <div className='section1'>
                <div className='sub1_sec1'>Income</div>
                <div className='sub2_sec1'><EllipsisOutlined /></div>
              </div>
              <div className='section2'>Total income in our shop</div>
              <div className='section3'>
                <div className='sub1_sec3'>{income} <span style={{fontSize:40}}>$</span></div>
                <div className='sub2_sec3'>Total of income</div>
              </div>
            </div>
            <div className='card2'><img src={firstImage} alt="image"></img></div>
          </div>
          <div className='dash_card'>
            <div className='card1'>
              <div className='section1'>
                <div className='sub1_sec1'>Sale Itmes</div>
                <div className='sub2_sec1'><EllipsisOutlined /></div>
              </div>
              <div className='section2'>Total sale items in our shop</div>
              <div className='section3'>
                <div className='sub1_sec3'>{salesItem} <span style={{fontSize:40}}><CoffeeOutlined/></span></div>
                <div className='sub2_sec3'>Total of sale items</div>
              </div>
            </div>
            <div className='card2'><img src={secondImage} alt="image"></img></div>
          </div>
          <div className='dash_card'>
            <div className='card1'>
              <div className='section1'>
                <div className='sub1_sec1'>Sales</div>
                <div className='sub2_sec1'><EllipsisOutlined /></div>
              </div>
              <div className='section2'>Total sales in our shop</div>
              <div className='section3'>
                <div className='sub1_sec3'>{sales} <span style={{fontSize:40}}><UserSwitchOutlined/></span></div>
                <div className='sub2_sec3'>Total of sales</div>
              </div>
            </div>
            <div className='card2'><img src={thirdImage} alt="image" style={{ width: "21.7rem" }}></img></div>
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default DashboardPage

