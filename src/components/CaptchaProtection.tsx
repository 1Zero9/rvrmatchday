/**
 * CAPTCHA Protection Component
 * Provides Google reCAPTCHA protection for forms
 */

import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface CaptchaProtectionProps {
  onVerify: (token: string | null) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
  className?: string;
}

// Demo site key for development - replace with actual key in production
const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Google's test key

export default function CaptchaProtection({
  onVerify,
  onError,
  onExpire,
  theme = 'light',
  size = 'normal',
  className = ''
}: CaptchaProtectionProps) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (token: string | null) => {
    setIsVerified(!!token);
    onVerify(token);
  };

  const handleError = () => {
    setIsVerified(false);
    onError?.();
  };

  const handleExpire = () => {
    setIsVerified(false);
    onExpire?.();
  };

  const reset = () => {
    recaptchaRef.current?.reset();
    setIsVerified(false);
  };

  return (
    <div className={`captcha-protection ${className}`}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Security Verification
        </label>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleChange}
            onError={handleError}
            onExpired={handleExpire}
            theme={theme}
            size={size}
          />
          {isVerified && (
            <div className="mt-2 flex items-center text-green-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verification completed
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This helps protect our forms from spam and automated abuse.
        </p>
      </div>
    </div>
  );
}

// Hook for easier usage
export function useCaptcha() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = (token: string | null) => {
    setCaptchaToken(token);
    setIsVerified(!!token);
  };

  const reset = () => {
    setCaptchaToken(null);
    setIsVerified(false);
  };

  return {
    captchaToken,
    isVerified,
    handleVerify,
    reset
  };
}