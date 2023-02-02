import React from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { FaHandHoldingUsd } from 'react-icons/fa'
import apiHook from '../api'
import { currency } from '../utils/currency'
import { Spinner } from '../components'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Home = () => {
  const getApi = apiHook({
    key: ['dashboard'],
    method: 'GET',
    url: `reports/dashboard`,
  })?.get

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Last 1 Year Accounts Transaction',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  const labels = getApi?.data?.chartData?.lastYear

  const data = {
    labels,
    datasets: [
      {
        label: 'Ramadan',
        data: getApi?.data?.chartData?.ramadan,
        borderColor: 'rgb(122, 225, 144)',
        backgroundColor: 'rgb(122, 225, 144)',
        yAxisID: 'y1',
      },
      {
        label: 'Eid',
        data: getApi?.data?.chartData?.eid,
        borderColor: 'rgb(225, 122, 122)',
        backgroundColor: 'rgb(225, 122, 122)',
        yAxisID: 'y',
      },
      {
        label: 'Orphans',
        data: getApi?.data?.chartData?.orphans,
        borderColor: 'rgb(134, 122, 225)',
        backgroundColor: 'rgb(134, 122, 225)',
        yAxisID: 'y1',
      },
      {
        label: 'Education',
        data: getApi?.data?.chartData?.education,
        borderColor: 'rgb(150, 113, 92)',
        backgroundColor: 'rgb(150, 113, 92)',
        yAxisID: 'y',
      },
      {
        label: 'Other',
        data: getApi?.data?.chartData?.other,
        borderColor: 'rgb(241, 58, 110)',
        backgroundColor: 'rgb(241, 58, 110)',
        yAxisID: 'y1',
      },
    ],
  }

  const accountsBox = [
    {
      _id: 1,
      name: 'Ramadan Account',
      icon: <FaHandHoldingUsd className="mb-1 fs-1" />,
      link: getApi?.data?.balance?.currentBalanceOnRamadanAcc,
      color: 'rgb(122, 225, 144)',
    },
    {
      _id: 2,
      name: 'Eid Account',
      icon: <FaHandHoldingUsd className="mb-1 fs-1" />,
      link: getApi?.data?.balance?.currentBalanceOnEidAcc,
      color: 'rgb(225, 122, 122)',
    },
    {
      _id: 3,
      name: 'Orphans Account',
      icon: <FaHandHoldingUsd className="mb-1 fs-1" />,
      link: getApi?.data?.balance?.currentBalanceOnOrphansAcc,
      color: 'rgb(134, 122, 225)',
    },
    {
      _id: 4,
      name: 'Education Account',
      icon: <FaHandHoldingUsd className="mb-1 fs-1" />,
      link: getApi?.data?.balance?.currentBalanceOnEducationAcc,
      color: 'rgb(150, 113, 92)',
    },
    {
      _id: 5,
      name: 'Other Account',
      icon: <FaHandHoldingUsd className="mb-1 fs-1" />,
      link: getApi?.data?.balance?.currentBalanceOnOtherAcc,
      color: 'rgb(241, 58, 110)',
    },
  ]

  return (
    <div className="container bg-light p-3 mt-2">
      <div className="row gy-3"></div>
      <div className="row">
        <div className="col-lg-8 col-md-12 col-12 mx-auto mb-3">
          <div className="card-text shadow">
            {getApi?.isLoading ? (
              <Spinner />
            ) : (
              <Line options={options} data={data} />
            )}
          </div>
        </div>

        <div className="col-lg-4 col-md-6  mx-auto">
          {accountsBox?.map((account) => (
            <div
              key={account._id}
              className="card border-top-0 border-bottom-0 shadow-lg mb-2"
              style={{ border: `5px solid ${account.color}` }}
            >
              <div className="card-body text-center pb-0">
                <h6 className="card-title">
                  {account.icon} <br />
                  <span className="fw-bold">{account.name}</span>
                </h6>

                <div className="card-text">
                  {getApi?.isLoading ? (
                    <Spinner />
                  ) : (
                    <p className="fw-bold">{currency(account.link)}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
