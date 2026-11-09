import api, { unwrap } from '../axios';
export const authService = {
  signup: (b: { name: string; email: string; password: string; rePassword: string; phone: string }) => unwrap(api.post('/v1/auth/signup', b)),
  signin: (b: { email: string; password: string }) => unwrap(api.post('/v1/auth/signin', b)),
  forgotPassword: (email: string) => unwrap(api.post('/v1/auth/forgotPasswords', { email })),
  verifyResetCode: (resetCode: string) => unwrap(api.post('/v1/auth/verifyResetCode', { resetCode })),
  resetPassword: (email: string, newPassword: string) => unwrap(api.put('/v1/auth/resetPassword', { email, newPassword })),
  changePassword: (b: { currentPassword: string; password: string; rePassword: string }) => unwrap(api.put('/v1/users/changeMyPassword', b)),
  verifyToken: () => unwrap(api.get('/v1/auth/verifyToken')),
  updateMe: (b: { name: string; email: string; phone: string }) => unwrap(api.put('/v1/users/updateMe/', b)),
};
