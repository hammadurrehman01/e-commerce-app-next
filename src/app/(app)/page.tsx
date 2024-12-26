'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { signupSchema } from '@/schemas/signupSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { z } from 'zod'

const Page = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [username, setUsername] = useState('')

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      setIsSubmitting(true)
      const response = await axios.post<any>('/api/sign-up', data)
      toast({
        title: 'Success',
        description: response.data.message,
      })
      if (response.data.message === 'User registered successfully') {
        setIsSubmitting(false)
        router.replace('/sign-in')
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message,
        variant: 'destructive',
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-800'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white py-6 rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-2xl mb-6'>
            Welcome to our store
          </h1>
          <p className='mb-4'>Sign up to continue your shopping!</p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField  
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          className='bg-transparent border border-[#c5c5c517] active:!border-none'
                          placeholder='Enter username'
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-transparent border border-[#c5c5c517]'
                        placeholder='Enter email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        className='bg-transparent border border-[#c5c5c517]'
                        placeholder='Enter password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Signup'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Page
