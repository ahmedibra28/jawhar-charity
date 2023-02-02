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
  AutoCompleteInput,
  DynamicFormProps,
  inputCheckBox,
  inputDate,
  inputNumber,
  inputTextArea,
  staticInputSelect,
} from '../../utils/dForms'
import FormView from '../../components/FormView'
import { FaPenAlt, FaTrash } from 'react-icons/fa'
import apiHook from '../../api'
import { ITransaction } from '../../models/Transaction'
import { IDonor } from '../../models/Donor'
import moment from 'moment'
import { currency } from '../../utils/currency'
import { accounts } from '../../utils/accounts'

const Receipts = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['receipts'],
    method: 'GET',
    url: `receipts?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const postApi = apiHook({
    key: ['receipts'],
    method: 'POST',
    url: `receipts`,
  })?.post

  const updateApi = apiHook({
    key: ['receipts'],
    method: 'PUT',
    url: `receipts`,
  })?.put

  const deleteApi = apiHook({
    key: ['receipts'],
    method: 'DELETE',
    url: `receipts`,
  })?.deleteObj

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
    reset,
    watch,
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
    setValue('isPaid', item?.isPaid)
    setValue('donor', item?.donor?._id)
    setValue('totalAmount', item?.amount)
    setValue('description', item?.description)
    setValue('date', moment(item?.date).format('YYYY-MM-DD'))

    setEdit(true)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Receipts List'
  const label = 'Receipt'
  const modal = 'receipt'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
  }

  const submitHandler = (data: Omit<ITransaction, '_id'>) => {
    edit
      ? updateApi?.mutateAsync({
          _id: id,
          ...data,
        })
      : postApi?.mutateAsync(data)
  }

  const form = [
    <div key={0} className="col-12">
      {!edit && (
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        /* @ts-ignore */
        <AutoCompleteInput
          edit={edit}
          register={register}
          errors={errors}
          hasLabel={false}
          label="Donor"
          name="donor"
          placeholder="Type the first letter of the donor name"
          value={watch(`donor`)}
          setValue={setValue}
          data={getDonorsApi?.data?.data?.filter(
            (donor: IDonor) => donor.status === 'active'
          )}
          setSearch={setSearch}
          format={(value: any) => (
            <option
              className="text-wrap"
              value={value?._id}
            >{`${value?.name} - ${value?.mobile}`}</option>
          )}
        />
      )}
    </div>,
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
    <>
      {(watch().account === 'Orphans' || watch().account === 'Education') &&
        !edit && (
          <>
            <div key={2} className="col-12">
              {inputNumber({
                register,
                errors,
                label: 'Total amount',
                name: 'totalAmount',
                placeholder: 'Total amount',
              } as DynamicFormProps)}
            </div>
            <div key={3} className="col-12">
              {inputNumber({
                register,
                errors,
                label: 'Duration',
                name: 'duration',
                placeholder: 'Duration',
              } as DynamicFormProps)}
            </div>
          </>
        )}
    </>,
    <>
      {edit && (
        <>
          <div key={2} className="col-12">
            {inputNumber({
              register,
              errors,
              label: 'Amount',
              name: 'totalAmount',
              placeholder: 'Amount',
            } as DynamicFormProps)}
          </div>
        </>
      )}
      {!edit &&
        (watch().account === 'Eid' ||
          watch().account === 'Other' ||
          watch().account === 'Ramadan') && (
          <>
            <div key={2} className="col-12">
              {inputNumber({
                register,
                errors,
                label: 'Amount',
                name: 'totalAmount',
                placeholder: 'Amount',
              } as DynamicFormProps)}
            </div>
          </>
        )}
    </>,

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

      <div className="col-12">
        {inputCheckBox({
          register,
          errors,
          label: `Is ${
            watch('donor') ? watch('donor') : 'this donor'
          } paid in cash?`,
          name: 'isPaid',
          isRequired: false,
        } as DynamicFormProps)}
      </div>
    </div>,
  ]

  const modalSize = 'modal-md'

  return (
    <>
      <Meta title="Receipts" />

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
                <th>Donor</th>
                <th>Account</th>
                <th>Total Amount</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map(
                (item: ITransaction | any, i: number) => (
                  <tr key={i}>
                    <td>{item?.donor?.name}</td>
                    <td>{item?.account}</td>
                    <td>{currency(item?.amount)}</td>
                    <td>
                      {item?.totalAmount ? (
                        <span className="badge bg-success">
                          {`${currency(item?.totalAmount)} for ${
                            item?.duration
                          } months`}
                        </span>
                      ) : (
                        <span className="badge bg-danger">NA</span>
                      )}
                    </td>
                    <td>
                      {item?.isPaid ? (
                        <span className="bg-success badge">Paid</span>
                      ) : (
                        <span className="bg-danger badge">Un-Paid</span>
                      )}
                    </td>
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

export default dynamic(() => Promise.resolve(withAuth(Receipts)), {
  ssr: false,
})
