const VideoCallModal = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-3/4 h-3/4">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-xl font-bold text-red-600"
          onClick={closeModal}
        >
          &times;
        </button>

        {/* Video call content (You can add WebRTC/Video API here) */}
        <div className="flex justify-center items-center h-full">
          <div className="text-lg font-bold">Video Call In Progress...</div>
          {/* Replace this with actual video call implementation */}
        </div>
      </div>
    </div>
  );
};
export default VideoCallModal;
