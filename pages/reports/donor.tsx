import React, { useEffect, useState } from 'react'
import apiHook from '../../api'
import { Message, Spinner } from '../../components'
import { currency } from '../../utils/currency'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import {
  AutoCompleteInput,
  DynamicFormProps,
  inputDate,
} from '../../utils/dForms'
import { FaSearch } from 'react-icons/fa'

const Donor = () => {
  const postApi = apiHook({
    key: ['donor report'],
    method: 'POST',
    url: `reports/donor`,
  })?.post

  const [search, setSearch] = useState('')
  const getDonorsApi = apiHook({
    key: ['donors'],
    method: 'GET',
    url: `donors?q=${search}&limit=${10}`,
  })?.get

  useEffect(() => {
    getDonorsApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
              Donor transactions
              <sup className="fs-6"> [{postApi?.data?.length || 0}] </sup>
            </h3>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="row">
            <div className="col-lg-8 col-12 mx-auto border py-3 px-4">
              <div className="row">
                <div className="col-lg-4 col-md-4 col-12 mx-auto">
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <AutoCompleteInput
                    edit={true}
                    register={register}
                    errors={errors}
                    hasLabel={true}
                    label="Donor"
                    name="donor"
                    placeholder="Type the first letter of the donor name"
                    value={watch(`donor`)}
                    setValue={setValue}
                    data={getDonorsApi?.data?.data}
                    setSearch={setSearch}
                    format={(value: any) => (
                      <option
                        className="text-wrap"
                        value={value?._id}
                      >{`${value?.name} - ${value?.mobile}`}</option>
                    )}
                  />
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
                <th>Donor</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {postApi?.data?.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{item?.donor?.name}</td>
                  <td>{item?.account}</td>
                  <td>{currency(item?.amount)}</td>
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

export default Donor
