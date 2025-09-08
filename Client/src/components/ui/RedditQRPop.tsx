import React from "react";
import { cn } from "../../lib/utils";
import RedditQRCode from "../../assets/RedditQRCode.png";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        className={cn(
          "relative z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="mt-10 text-2xl font-bold text-gray-900 flex-1 text-center">
            Get the Reddit app
          </h2>
          <button
            onClick={onClose}
            className="text-gray-800 hover:text-gray-600 flex items-center justify-center rounded-full bg-gray-200 p-1.5 hover:bg-gray-300 ml-6 mb-10"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Scan this QR code to download the app now
        </p>
        <div className="flex justify-center mb-6">
          <div className="w-48 h-48 flex items-center justify-center">
            <img
              src={RedditQRCode}
              alt="Reddit QR Code"
              className="w-full h-full object-contain rounded"
            />
          </div>
        </div>
        <p className="text-gray-600 mb-4 text-center text-sm">
          Or check it out in the app stores
        </p>
        <div className="justify-center flex gap-4 mb-12">
          <a
            href="https://play.google.com/store/apps/details?id=com.reddit.frontpage"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity"
          >
            <img
              src="https://www.redditstatic.com/shreddit/assets/google-play.svg"
              alt="Get it on Google Play"
              className="w-35 h-10"
            />
          </a>

          <a
            href="https://apps.apple.com/app/reddit/id1064216828"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity"
          >
            <img
              src="https://www.redditstatic.com/shreddit/assets/app-store.svg"
              alt="Download on the App Store"
              className="w-32 h-10"
            />
          </a>
        </div>
      </div>
    </Modal>
  );
};
