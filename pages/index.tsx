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
    ],
  }

  return (
    <div className="container bg-light p-3 mt-2">
      <div className="row">
        <div className="col-lg-8 col-12 mx-auto">
          <div className="card-text">
            {getApi?.isLoading ? (
              <Spinner />
            ) : (
              <Line options={options} data={data} />
            )}
          </div>
        </div>
        <div className="col-lg-4 col-12 mx-auto ">
          <div
            className="card border-top-0 border-bottom-0 shadow-lg mb-2"
            style={{ border: '5px solid rgb(122, 225, 144)' }}
          >
            <div className="card-body text-center pb-0">
              <h6 className="card-title">
                <FaHandHoldingUsd className="mb-1 fs-1" /> <br />
                <span className="fw-bold">RAMADAN ACCOUNT</span>
              </h6>

              <div className="card-text">
                {getApi?.isLoading ? (
                  <Spinner />
                ) : (
                  <p className="fw-bold display-6">
                    {currency(
                      getApi?.data?.balance?.currentBalanceOnRamadanAcc
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div
            className="card border-top-0 border-bottom-0 shadow-lg mb-2"
            style={{ border: '5px solid rgb(225, 122, 122)' }}
          >
            <div className="card-body text-center pb-0">
              <h6 className="card-title">
                <FaHandHoldingUsd className="mb-1 fs-1" /> <br />
                <span className="fw-bold">EID ACCOUNT</span>
              </h6>
              <div className="card-text">
                <div className="card-text">
                  {getApi?.isLoading ? (
                    <Spinner />
                  ) : (
                    <p className="fw-bold display-6">
                      {currency(getApi?.data?.balance?.currentBalanceOnEidAcc)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="card border-top-0 border-bottom-0 shadow-lg mb-2"
            style={{ border: '5px solid rgb(134, 122, 225)' }}
          >
            <div className="card-body text-center pb-0">
              <h6 className="card-title">
                <FaHandHoldingUsd className="mb-1 fs-1" /> <br />
                <span className="fw-bold">ORPHANS ACCOUNT</span>
              </h6>
              <div className="card-text">
                <div className="card-text">
                  {getApi?.isLoading ? (
                    <Spinner />
                  ) : (
                    <p className="fw-bold display-6">
                      {currency(
                        getApi?.data?.balance?.currentBalanceOnOrphansAcc
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
