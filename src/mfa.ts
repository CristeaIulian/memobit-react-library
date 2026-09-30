// Separate entry point: the MFA setup modal renders an enrolment QR code and is
// the library's only consumer of `qrcode.react`. Keeping it out of the main
// bundle means apps that never offer two-factor setup don't carry that code.
export { MfaSetupModal } from './components/Auth/MfaSetupModal';
