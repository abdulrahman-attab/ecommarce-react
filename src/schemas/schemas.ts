import { z } from 'zod';
const phone = z.string().regex(/^\+?[0-9\s]{10,15}$/, 'Enter a valid phone number');
export const loginSchema = z.object({ email: z.string().email('Enter a valid email'), password: z.string().min(1, 'Password is required'), remember: z.boolean() });
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters').regex(/[0-9]/, 'Include a number').regex(/[^A-Za-z0-9]/, 'Include a symbol'),
  rePassword: z.string().min(1, 'Confirm your password'),
  phone,
  terms: z.boolean().refine((v) => v, 'You must accept the terms'),
}).refine((d) => d.password === d.rePassword, { path: ['rePassword'], message: 'Passwords do not match' });
export const emailSchema = z.object({ email: z.string().email('Enter a valid email') });
export const codeSchema = z.object({ resetCode: z.string().min(4, 'Enter the code from your email') });
export const resetSchema = z.object({ newPassword: z.string().min(6, 'At least 6 characters') });
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1, 'Required'), password: z.string().min(6, 'At least 6 characters'), rePassword: z.string().min(1, 'Required') })
  .refine((d) => d.password === d.rePassword, { path: ['rePassword'], message: 'Passwords do not match' });
export const profileSchema = z.object({ name: z.string().min(2, 'Required'), email: z.string().email('Enter a valid email'), phone });
export const addressSchema = z.object({ name: z.string().min(2, 'Required'), details: z.string().min(5, 'Enter the address details'), phone, city: z.string().min(2, 'Required') });
export const checkoutSchema = z.object({ details: z.string().min(5, 'Enter your address details'), phone, city: z.string().min(2, 'Enter your city'), payment: z.enum(['cash', 'online']) });
export const contactSchema = z.object({ name: z.string().min(2, 'Required'), email: z.string().email('Enter a valid email'), subject: z.string().min(1, 'Select a subject'), message: z.string().min(10, 'Message must be at least 10 characters') });
export const reviewSchema = z.object({ rating: z.number().min(1).max(5), review: z.string().min(3, 'Write a short review') });
