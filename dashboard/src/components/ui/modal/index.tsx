import { useRef, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean; // New prop to control close button visibility
  isFullscreen?: boolean; // Default to false for backwards compatibility
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true, // Default to true for backwards compatibility
  isFullscreen = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-full max-w-4xl mx-4 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl";

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto z-[99999]">
      {/* Background overlay with blur - now shows for all modal types */}
      <div
        className="fixed inset-0 h-full w-full bg-black/20 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      ></div>
      
      <div
        ref={modalRef}
        className={`${contentClasses} ${className} relative z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-[999] flex h-9 w-9 items-center justify-center rounded-full bg-gray-100/80 text-gray-500 transition-all duration-200 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-10 sm:w-10 backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};