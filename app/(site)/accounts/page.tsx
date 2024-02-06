'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import type { Account as IAccount } from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import useDataStore from '@/zustand/dataStore'
import { columns } from './columns'

const FormSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  donorId: z.string().optional(),
  balance: z.string().optional(),
  amount: z.string().optional(),
  period: z.string().optional(),
  duration: z.string().optional(),
  startAt: z.string().optional(),
  status: z.string().optional(),
})

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const [formStatusData, setFormStatusData] = useState({
    type: 'account',
    id: '',
  })

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const { dialogOpen, setDialogOpen } = useDataStore((state) => state)

  const getApi = useApi({
    key: ['accounts'],
    method: 'GET',
    url: `accounts?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const postApi = useApi({
    key: ['accounts'],
    method: 'POST',
    url: `accounts`,
  })?.post

  const updateApi = useApi({
    key: ['accounts'],
    method: 'PUT',
    url: `accounts`,
  })?.put

  const depositApi = useApi({
    key: ['accounts'],
    method: 'PUT',
    url: `accounts/deposit`,
  })?.put

  const expenseApi = useApi({
    key: ['accounts'],
    method: 'PUT',
    url: `accounts/expense`,
  })?.put

  const deleteApi = useApi({
    key: ['accounts'],
    method: 'DELETE',
    url: `accounts`,
  })?.deleteObj

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: '',
      period: '',
      status: '',
      startAt: '',
    },
  })

  useEffect(() => {
    if (
      postApi?.isSuccess ||
      updateApi?.isSuccess ||
      depositApi?.isSuccess ||
      expenseApi?.isSuccess ||
      deleteApi?.isSuccess
    ) {
      getApi?.refetch()
      setDialogOpen(false)
    }

    // eslint-disable-next-line
  }, [
    postApi?.isSuccess,
    updateApi?.isSuccess,
    deleteApi?.isSuccess,
    depositApi?.isSuccess,
    expenseApi?.isSuccess,
  ])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [limit])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const editHandler = (item: IAccount) => {
    setId(item.id!)
    setEdit(true)
    form.setValue('name', item?.name)
    form.setValue('description', item?.description!)
    form.setValue('status', item?.status)
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'Account'
  const modal = 'account'

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEdit(false)
      setId(null)
      setFormStatusData({ type: 'account', id: '' })
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  const status = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' },
  ]

  const period = [
    { label: 'MONTHLY', value: 'MONTHLY' },
    { label: 'YEARLY', value: 'YEARLY' },
  ]

  const formFields = (
    <Form {...form}>
      {formStatusData.type === 'account' && (
        <>
          <CustomFormField
            form={form}
            name='name'
            label='Name'
            placeholder='Name'
            type='text'
          />
          {!edit && (
            <>
              <CustomFormField
                form={form}
                name='balance'
                label='Opening Balance'
                placeholder='Opening balance'
                type='number'
              />
              <CustomFormField
                form={form}
                name='period'
                label='Period'
                placeholder='Period'
                fieldType='command'
                data={period}
              />
            </>
          )}

          <CustomFormField
            form={form}
            name='status'
            label='Status'
            placeholder='Status'
            fieldType='command'
            data={status}
          />
        </>
      )}
      {formStatusData.type === 'deposit' && (
        <>
          <CustomFormField
            form={form}
            name='donorId'
            label='Donor'
            placeholder='Donor'
            fieldType='command'
            data={[]}
            key='donors'
            url='donors?page=1&limit=10&status=ACTIVE'
          />
          <CustomFormField
            form={form}
            name='amount'
            label='Amount'
            placeholder='Amount'
            type='number'
          />
          <CustomFormField
            form={form}
            name='duration'
            label='Duration'
            placeholder='Duration'
            type='number'
          />
          <CustomFormField
            form={form}
            name='startAt'
            label='Start At'
            placeholder='Start At'
            type='date'
          />
        </>
      )}
      {formStatusData.type === 'expense' && (
        <CustomFormField
          form={form}
          name='amount'
          label='Amount'
          placeholder='Amount'
          type='number'
        />
      )}

      <CustomFormField
        form={form}
        name='description'
        label='Description'
        placeholder='Description'
        cols={3}
        rows={3}
      />
    </Form>
  )

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    edit
      ? updateApi?.mutateAsync({
          id: id,
          ...values,
        })
      : Boolean(formStatusData.type === 'account')
      ? postApi?.mutateAsync(values)
      : Boolean(formStatusData.type === 'deposit')
      ? depositApi?.mutateAsync({
          id: formStatusData.id,
          amount: values?.amount,
          donorId: values?.donorId,
          description: values?.description,
          duration: values?.duration,
          startAt: values?.startAt,
        })
      : expenseApi?.mutateAsync({
          id: formStatusData.id,
          amount: values?.amount,
          description: values?.description,
        })
  }

  return (
    <>
      {deleteApi?.isSuccess && <Message value={deleteApi?.data?.message} />}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}
      {depositApi?.isSuccess && <Message value={depositApi?.data?.message} />}
      {depositApi?.isError && <Message value={depositApi?.error} />}
      {expenseApi?.isSuccess && <Message value={expenseApi?.data?.message} />}
      {expenseApi?.isError && <Message value={expenseApi?.error} />}

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      <FormView
        form={formFields}
        loading={
          updateApi?.isPending ||
          postApi?.isPending ||
          depositApi?.isPending ||
          expenseApi?.isPending
        }
        handleSubmit={form.handleSubmit}
        submitHandler={onSubmit}
        label={label}
        edit={edit}
      />

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : (
        <div className='mt-2 overflow-x-auto bg-white p-3'>
          <RTable
            data={getApi?.data}
            columns={columns({
              editHandler,
              isPending: deleteApi?.isPending || false,
              deleteHandler,
              setFormStatusData,
            })}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            modal={modal}
            caption='Accounts List'
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
