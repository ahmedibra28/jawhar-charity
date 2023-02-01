import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import {
  Spinner,
  Pagination,
  Message,
  Confirm,
  Search,
  Meta,
} from '../../components'
import {
  DynamicFormProps,
  inputDate,
  inputNumber,
  inputTextArea,
  staticInputSelect,
} from '../../utils/dForms'
import FormView from '../../components/FormView'
import { FaPenAlt, FaTrash } from 'react-icons/fa'
import apiHook from '../../api'
import { ITransaction } from '../../models/Transaction'
import moment from 'moment'
import { currency } from '../../utils/currency'
import { accounts } from '../../utils/accounts'

const Expenses = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['expenses'],
    method: 'GET',
    url: `expenses?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const postApi = apiHook({
    key: ['expenses'],
    method: 'POST',
    url: `expenses`,
  })?.post

  const updateApi = apiHook({
    key: ['expenses'],
    method: 'PUT',
    url: `expenses`,
  })?.put

  const deleteApi = apiHook({
    key: ['expenses'],
    method: 'DELETE',
    url: `expenses`,
  })?.deleteObj

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({})

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      formCleanHandler()
      getApi?.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const editHandler = (item: ITransaction | any) => {
    setId(item._id)
    setValue('account', item?.account)
    setValue('amount', item?.amount)
    setValue('description', item?.description)
    setValue('date', moment(item?.date).format('YYYY-MM-DD'))

    setEdit(true)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Expenses List'
  const label = 'Expense'
  const modal = 'expense'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
  }

  const submitHandler = (data: any) => {
    edit
      ? updateApi?.mutateAsync({
          _id: id,
          ...data,
        })
      : postApi?.mutateAsync(data)
  }

  const form = [
    <div key={1} className="col-12">
      {staticInputSelect({
        register,
        errors,
        label: 'Account',
        name: 'account',
        placeholder: 'Select account',
        data: accounts,
      } as DynamicFormProps)}
    </div>,

    <div key={2} className="col-12">
      {inputNumber({
        register,
        errors,
        label: 'Amount',
        name: 'amount',
        placeholder: 'Amount',
      } as DynamicFormProps)}
    </div>,

    <div key={4} className="col-12">
      {inputDate({
        register,
        errors,
        label: 'Date',
        name: 'date',
        placeholder: 'Date',
        isRequired: false,
      } as DynamicFormProps)}
    </div>,
    <div key={5} className="col-12">
      {inputTextArea({
        register,
        errors,
        label: 'Description',
        name: 'description',
        placeholder: 'Description',
        isRequired: false,
      } as DynamicFormProps)}
    </div>,
  ]

  const modalSize = 'modal-md'

  return (
    <>
      <Meta title="Expenses" />

      {deleteApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been deleted successfully.`}
        />
      )}
      {deleteApi?.isError && (
        <Message variant="danger" value={deleteApi?.error} />
      )}
      {updateApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been updated successfully.`}
        />
      )}
      {updateApi?.isError && (
        <Message variant="danger" value={updateApi?.error} />
      )}
      {postApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been Created successfully.`}
        />
      )}
      {postApi?.isError && <Message variant="danger" value={postApi?.error} />}

      <div className="ms-auto text-end">
        <Pagination data={getApi?.data} setPage={setPage} />
      </div>

      <FormView
        edit={edit}
        formCleanHandler={formCleanHandler}
        form={form}
        isLoadingUpdate={updateApi?.isLoading}
        isLoadingPost={postApi?.isLoading}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={modal}
        label={label}
        modalSize={modalSize}
      />

      {getApi?.isLoading ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message variant="danger" value={getApi?.error} />
      ) : (
        <div className="table-responsive bg-light p-3 mt-2">
          <div className="d-flex align-items-center flex-column mb-2">
            <h3 className="fw-light text-muted">
              {name}
              <sup className="fs-6"> [{getApi?.data?.total}] </sup>
            </h3>
            <button
              className="btn btn-outline-primary btn-sm shadow my-2"
              data-bs-toggle="modal"
              data-bs-target={`#${modal}`}
            >
              Add New {label}
            </button>
            <div className="col-auto">
              <Search
                placeholder="Search by name"
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Account</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map(
                (item: ITransaction | any, i: number) => (
                  <tr key={i}>
                    <td>{item?.account}</td>
                    <td>{currency(item?.amount)}</td>
                    <td>{moment(item?.date).format('YYYY-MM-DD')}</td>
                    <td>{item?.description}</td>

                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-primary btn-sm rounded-pill"
                          onClick={() => editHandler(item)}
                          data-bs-toggle="modal"
                          data-bs-target={`#${modal}`}
                        >
                          <FaPenAlt />
                        </button>

                        <button
                          className="btn btn-danger btn-sm ms-1 rounded-pill"
                          onClick={() => deleteHandler(item._id)}
                          disabled={deleteApi?.isLoading}
                        >
                          {deleteApi?.isLoading ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <span>
                              <FaTrash />
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Expenses)), {
  ssr: false,
})
