// src/components/DropboxUploadModal.tsx

interface DropboxUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DropboxUploadModal = ({ isOpen, onClose }: DropboxUploadModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-dark-card/90 border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header and Instructions */}
        <div className="flex-shrink-0 p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <i className="fab fa-dropbox text-3xl text-blue-400"></i>
            <h1 className="text-xl font-bold text-dark-heading">Get Link from Dropbox</h1>
          </div>
          <div className="text-xs text-center sm:text-right text-dark-text bg-black/20 px-3 py-1.5 rounded-md">
            <strong>Instructions:</strong> Find your file, click <strong>Share</strong>, then <strong>Copy link</strong>.
          </div>
        </div>

        {/* Iframe Content */}
        <div className="flex-grow bg-gray-800">
          <iframe
            src="https://www.dropbox.com/home"
            title="Dropbox"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          ></iframe>
        </div>
         <button 
            onClick={onClose} 
            className="absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center text-dark-text bg-dark-card hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
      </div>
    </div>
  );
};

export default DropboxUploadModal;
