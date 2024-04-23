import OTPForm from '@/app/ui/OTP Form';

export default function LoginPage() {
  return (
    <main>
      <h2 className="bg-white-500 mb-1 flex justify-center rounded-lg p-2 text-xl font-semibold text-white">
        <img
          src="https://www.finserve.africa/images/finserve-big-logo.svg"
          alt="Finserve Logo"
          className="h-15 w-15 mr-2"
        />
        OTP Form
      </h2>
      <div>
        <OTPForm />
      </div>
    </main>
  );
}

function OTPFormContainer() {
  return (
    <div className="max-w-[400px]">
      <OTPForm />
    </div>
  );
}
