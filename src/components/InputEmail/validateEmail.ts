import './InputEmail.scss';

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const validateEmail = (email: string): boolean => {
    if (!email || email.trim() === '') {
        return true; // Empty is valid (use required prop for mandatory)
    }
    return EMAIL_REGEX.test(email.trim());
};
