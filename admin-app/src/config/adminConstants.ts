export const ADMIN_CREDENTIALS = {
  EMAIL: 'harshg101999@gmail.com',
  PHONE: '9389110115',
};

export const validateAdminCredential = (input: string): boolean => {
  const trimmed = input.trim();
  return (
    trimmed === ADMIN_CREDENTIALS.EMAIL ||
    trimmed === ADMIN_CREDENTIALS.PHONE
  );
};

export const isEmail = (input: string): boolean => {
  return input.includes('@');
};



