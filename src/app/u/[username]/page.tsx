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
import { toast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function SendMessage() {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const params = useParams<{ username: string }>()
  const username = params.username
  const [suggestedMessages, setSuggestedMessages] = useState('')
  const [message, setMessage] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // const { data: session } = useSession()
  const router = useRouter()

  const form = useForm<{ userId: string; title: string; description: string; image: File | null }>({
    defaultValues: {
      userId: session?.user?.id ?? '',
      title: '',
      description: '',
      image: null,
    },
  })

  useEffect(() => {
    if (session?.user.id) {
      form.reset({
        userId: session.user.id,
        title: '',
        description: '',
        image: null,
      })
    }
  }, [session?.user.id, form])

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: any) => {
    const formData = new FormData()
    formData.append('userId', data.userId) // Append user ID
    formData.append('title', data.title) // Append title
    formData.append('description', data.description) // Append description
    console.log('data.image', data.image)

    if (data.image) {
      formData.append('image', data.image) // Append the image file
    }

    setIsLoading(true)
    try {
      const response = await axios.post('/api/send-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct content type is set
        },
      })

      toast({
        title: response.data.message,
        variant: 'default',
      })

      if (response.data.message === 'Product sent successfully!') {
        router.replace('/dashboard')
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        form.setValue('image', file) // Optionally set the image file in form state if needed
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
      <h1 className='text-4xl font-bold mb-6 text-center'>Add Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Title</FormLabel>
                <FormControl>
                  <Input
                    className='bg-transparent border border-black active:!border-none focus:!border-none'
                    placeholder='Enter title'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Description</FormLabel>
                <FormControl>
                  <Input
                    className='bg-transparent border border-black active:!border-none focus:!border-none'
                    placeholder='Enter description'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Image</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='bg-transparent border border-black active:!border-none focus:!border-none'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {imagePreview && (
            <div className='flex'>
              <img
                width={200}
                src={imagePreview}
                alt='Image Preview'
                className='mt-4 max-w-full h-auto rounded'
              />
            </div>
          )}
          <div className='flex justify-center'>
            {isLoading ? (
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button type='submit' disabled={isLoading}>
                Add
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
