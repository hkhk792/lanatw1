import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface WeChatIconProps {
  qrCodeUrl?: string;
}

const WeChatIcon = ({ qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=weixin://dl/profile" }: WeChatIconProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!iconRef.current) return;
    setIsDragging(true);
    const rect = iconRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newX = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.y));
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <>
      {/* 可拖動的微信圖標 */}
      <div
        ref={iconRef}
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          if (!isDragging) setIsModalOpen(true);
        }}
        className="group"
      >
        <div className="relative">
          {/* 外圈閃光效果 */}
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping group-hover:bg-green-500/30" />
          {/* 圖標本體 */}
          <div className="relative w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg flex items-center justify-center border-2 border-white transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
              <path d="M8.5 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
              <path d="M12 2C6.48 2 2 5.59 2 10c0 2.21 1.18 4.2 3.2 5.44a.5.5 0 0 1 .21.55l-.4 1.2c-.05.16.1.31.26.26l1.45-.48a.5.5 0 0 1 .34.04c1.28.54 2.77.85 4.3.85 5.52 0 10-3.59 10-8S17.52 2 12 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 二維碼彈窗 */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 關閉按鈕 */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* 標題 */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-1">微信聯繫</h3>
              <p className="text-sm text-gray-500">掃碼添加好友</p>
            </div>

            {/* 二維碼 */}
            <div className="flex justify-center mb-4">
              <div className="relative bg-white p-4 rounded-xl shadow-inner border border-gray-100">
                <div className="w-56 h-56 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    {/* 這裡可以替換為您的實際二維碼 */}
                    <img
                      src={qrCodeUrl}
                      alt="微信二維碼"
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        const fallback = document.createElement("div");
                        fallback.innerHTML = `
                          <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 rounded">
                            <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-3">
                              <svg viewBox="0 0 24 24" class="w-12 h-12 text-white" fill="currentColor">
                                <path d="M8.5 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                <path d="M12 2C6.48 2 2 5.59 2 10c0 2.21 1.18 4.2 3.2 5.44a.5.5 0 0 1 .21.55l-.4 1.2c-.05.16.1.31.26.26l1.45-.48a.5.5 0 0 1 .34.04c1.28.54 2.77.85 4.3.85 5.52 0 10-3.59 10-8S17.52 2 12 2z" />
                              </svg>
                            </div>
                            <p class="text-green-600 font-medium">微信二維碼</p>
                            <p class="text-xs text-gray-400 mt-1">請替換為您的二維碼</p>
                          </div>
                        `;
                        (e.target as HTMLImageElement).parentElement?.appendChild(fallback);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 提示文字 */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                打開手機微信，「發現」→「掃一掃」
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WeChatIcon;
