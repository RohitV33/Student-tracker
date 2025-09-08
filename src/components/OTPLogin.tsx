import React, { useState, useEffect, useRef } from 'react';

// Define the type for the message state
interface Message {
  text: string;
  type: 'success' | 'error' | '';
}

// Main component, containing all logic and UI
const App: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [showPhoneSection, setShowPhoneSection] = useState<boolean>(true);
  const [message, setMessage] = useState<Message>({ text: '', type: '' });
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const countdownIntervalRef = useRef<NodeJS.Timer | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const OTP_EXPIRY_SECONDS = 120; // 2 minutes

  // This ref will hold the "simulated" OTP data, acting as a temporary backend store.
  // In a real app, this would be a database or cache on the server.
  const simulatedOtpData = useRef<{ otp: string; expiry: number }>({ otp: '', expiry: 0 });

  // A utility function to show a message and clear it automatically
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000); // Message disappears after 5 seconds
  };

  const startCountdown = () => {
    setSecondsLeft(OTP_EXPIRY_SECONDS);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    countdownIntervalRef.current = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(countdownIntervalRef.current!);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };

  const sendOtp = () => {
    const phoneRegex = /^\d{10}$/; // Basic 10-digit number validation
    if (!phoneRegex.test(phoneNumber.trim())) {
      showMessage('Please enter a valid 10-digit phone number.', 'error');
      return;
    }
    
    setIsLoading(true);

    // Simulate a network request delay
    setTimeout(() => {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date().getTime() + OTP_EXPIRY_SECONDS * 1000;

        // Simulate storing OTP data on a backend
        simulatedOtpData.current = { otp: newOtp, expiry };

        setShowPhoneSection(false);
        showMessage(`An OTP has been sent to ${phoneNumber}. For this demo, your OTP is: ${newOtp}`, 'success');
        startCountdown();
        setIsLoading(false);
    }, 1500); // 1.5 second delay to simulate API call
  };

  const verifyOtp = () => {
    setIsLoading(true);
    
    setTimeout(() => {
        const { otp: storedOtp, expiry } = simulatedOtpData.current;
        const now = new Date().getTime();

        if (!storedOtp) {
            showMessage('No OTP found. Please send a new one.', 'error');
            setIsLoading(false);
            return;
        }

        if (now > expiry) {
            showMessage('The OTP has expired. Please request a new one.', 'error');
            simulatedOtpData.current = { otp: '', expiry: 0 }; // Clear expired OTP
            setIsLoading(false);
            return;
        }

        if (otp === storedOtp) {
            showMessage('Login successful! You are now logged in.', 'success');
            clearInterval(countdownIntervalRef.current!);
            // In a real app, you would handle successful login (e.g., redirect to dashboard)
        } else {
            showMessage('Invalid OTP. Please try again.', 'error');
        }
        setIsLoading(false);
    }, 1500);
  };

  // Cleanup effect for the timer
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm m-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login with OTP</h1>

        {/* Conditional rendering for different sections */}
        {showPhoneSection ? (
          <div id="phone-section">
            <p className="text-center text-gray-600 mb-6">Enter your phone number to receive a one-time password.</p>
            <div className="mb-4">
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone-number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 9876543210"
                value={phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div id="otp-section">
            <p className="text-center text-gray-600 mb-4" id="otp-message">
              An OTP has been sent to {phoneNumber}.
            </p>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                id="otp"
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center tracking-widest text-lg font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="_ _ _ _ _ _"
                value={otp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
              />
            </div>
            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-green-400"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className="flex justify-between mt-4 text-sm">
               <button
                  onClick={() => {
                    setShowPhoneSection(true);
                    setMessage({ text: '', type: '' });
                    setOtp('');
                  }}
                  className="text-gray-500 hover:text-gray-800 transition duration-300"
               >
                  Go Back
               </button>
              <div id="resend-countdown" className="text-gray-500 text-center">
                {secondsLeft > 0 ? (
                  `Resend in ${secondsLeft}s`
                ) : (
                  <button 
                    className="cursor-pointer underline text-blue-600"
                    onClick={() => {
                      sendOtp();
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message/Status area */}
        {message.text && (
          <div
            className={`mt-6 p-4 rounded-lg text-center transition-opacity duration-300 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
