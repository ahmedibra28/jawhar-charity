import React from 'react'
import apiHook from '../../api'
import { Message, Spinner } from '../../components'
import { currency } from '../../utils/currency'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import {
  DynamicFormProps,
  inputDate,
  staticInputSelect,
} from '../../utils/dForms'
import { FaSearch } from 'react-icons/fa'
import { accounts } from '../../utils/accounts'

const Account = () => {
  const postApi = apiHook({
    key: ['account report'],
    method: 'POST',
    url: `reports/account`,
  })?.post

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({})

  const submitHandler = (data: any) => {
    postApi?.mutateAsync(data)
  }

  return (
    <>
      {postApi?.isError && <Message variant="danger" value={postApi?.error} />}

      {postApi?.isLoading ? (
        <Spinner />
      ) : (
        <div className="table-responsive bg-light p-3 mt-2">
          <div className="d-flex align-items-center flex-column mb-2">
            <h3 className="fw-light text-muted">
              Account transactions
              <sup className="fs-6"> [{postApi?.data?.length || 0}] </sup>
            </h3>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="row">
            <div className="col-lg-8 col-12 mx-auto border py-3 px-4">
              <div className="row">
                <div className="col-lg-4 col-md-4 col-12 mx-auto">
                  {staticInputSelect({
                    register,
                    errors,
                    label: 'Account',
                    name: 'account',
                    placeholder: 'Select account',
                    data: accounts,
                  } as DynamicFormProps)}
                </div>
                <div className="col-lg-4 col-md-4 col-12 mx-auto">
                  {inputDate({
                    register,
                    errors,
                    label: 'Start date',
                    name: 'startDate',
                    placeholder: 'Start date',
                  } as DynamicFormProps)}
                </div>
                <div className="col-lg-4 col-md-4 col-12 mx-auto">
                  {inputDate({
                    register,
                    errors,
                    label: 'End date',
                    name: 'endDate',
                    placeholder: 'End date',
                  } as DynamicFormProps)}
                </div>

                <div className="col-lg-5 col-md-7 col-12 mx-auto text-center">
                  <button
                    type="submit"
                    className="btn btn-outline-primary w-100 form-control"
                    disabled={postApi?.isLoading}
                  >
                    {postApi?.isLoading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <>
                        <FaSearch className="mb-1" /> SEARCH
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
          <table className="table table-sm table-border mt-5">
            <thead className="border-0">
              <tr>
                <th>Account</th>
                <th>Amount</th>
                <th>Transaction Type</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {postApi?.data?.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{item?.account}</td>
                  <td>{currency(item?.amount)}</td>
                  <td>
                    {item?.transactionType === 'credit' ? (
                      <span className="badge bg-info">
                        {item?.transactionType}
                      </span>
                    ) : (
                      <span className="badge bg-warning">
                        {item?.transactionType}
                      </span>
                    )}
                  </td>
                  <td>{moment(item?.date).format('YYYY-MM-DD')}</td>
                  <td>{item?.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default Account
