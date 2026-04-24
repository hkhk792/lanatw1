import { useState, useEffect } from "react";
import { Search, ShoppingCart, User, ChevronLeft, Plus, Minus, MessageCircle } from "lucide-react";
import productMain from "@/assets/product-12.png";
import productThumb1 from "@/assets/product-13.png";
import productThumb2 from "@/assets/product-11.png";
import logoImage from "@/assets/product-14.jpg";
import doraemonMain from "@/assets/wps1.png";
import doraemonThumb1 from "@/assets/wps3.png";
import doraemonThumb2 from "@/assets/wps2.png";
import luffyMain from "@/assets/16.png";
import luffyThumb1 from "@/assets/18.png";
import luffyThumb2 from "@/assets/17.png";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState("蠟筆小新");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mainImage, setMainImage] = useState(productMain);
  const [thumb1, setThumb1] = useState(productThumb1);
  const [thumb2, setThumb2] = useState(productThumb2);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    if (option === "多拉 A 夢") {
      setMainImage(doraemonMain);
      setThumb1(doraemonThumb1);
      setThumb2(doraemonThumb2);
    } else if (option === "航海王魯夫 - 藍") {
      setMainImage(luffyMain);
      setThumb1(luffyThumb1);
      setThumb2(luffyThumb2);
    } else {
      setMainImage(productMain);
      setThumb1(productThumb1);
      setThumb2(productThumb2);
    }
  };

  const getProductTitle = () => {
    if (selectedOption === "多拉 A 夢") {
      return "NINGA 多拉 A 夢卡通一代通用主機｜多種配色可選";
    } else if (selectedOption === "航海王魯夫 - 藍") {
      return "NINGA 航海王魯夫卡通一代通用主機｜多種配色可選";
    }
    return `NINGA ${selectedOption}卡通一代通用主機｜多種配色可選`;
  };

  const getProductDescription = () => {
    if (selectedOption === "多拉 A 夢") {
      return "NINGA 多拉 A 夢卡通一代通用主機 多種配色可選";
    } else if (selectedOption === "航海王魯夫 - 藍") {
      return "NINGA 航海王魯夫卡通一代通用主機 多種配色可選";
    }
    return `NINGA ${selectedOption}卡通一代通用主機 多種配色可選`;
  };

  const getCategory = () => {
    if (selectedOption === "多拉 A 夢") {
      return "NINGA 多拉 A 夢主機";
    } else if (selectedOption === "航海王魯夫 - 藍") {
      return "NINGA 航海王魯夫主機";
    }
    return `NINGA ${selectedOption}主機`;
  };

  const getTags = () => {
    if (selectedOption === "多拉 A 夢") {
      return "NINGA 多拉 A 夢，NINGA 多拉 A 夢卡通一代通用主機";
    } else if (selectedOption === "航海王魯夫 - 藍") {
      return "NINGA 航海王魯夫，NINGA 航海王魯夫卡通一代通用主機";
    }
    return `NINGA ${selectedOption}，NINGA ${selectedOption}卡通一代通用主機`;
  };

  const getBadgeText = () => {
    if (selectedOption === "多拉 A 夢") {
      return "通用主機｜多拉 A 夢";
    } else if (selectedOption === "航海王魯夫 - 藍") {
      return "通用主機｜航海王魯夫";
    }
    return `通用主機｜${selectedOption}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const flavorOptions = [
    "多拉 A 夢",
    "航海王魯夫 - 藍",
    "火影忍者卡卡西",
    "航海王索隆 - 綠",
    "庫洛米",
    "KT 貓",
    "蠟筆小新",
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 導航欄 */}
      <nav className={`sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 ${isScrolled ? '-translate-y-full' : ''}`}>
        <div className="container mx-auto px-4 py-1 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Sp27 Logo" className="w-20 h-20 rounded-lg object-contain" />
          </div>

          {/* 導航連結 */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">我的帳號</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">結帳</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium relative">
              購物車
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
            </a>
          </div>

          {/* 用戶圖標 */}
          <div>
            <User className="w-5 h-5 text-gray-600 cursor-pointer md:hidden" />
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 左側：商品圖片 */}
          <div className="relative">
            {/* 返回按鈕 */}
            <button
              onClick={() => window.location.href = '/'}
              className="mb-4 flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">返回首頁</span>
            </button>

            {/* 主圖片區域 */}
            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              {/* 左側特點標籤 */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
                <div className="bg-white shadow-md rounded-lg px-4 py-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-700">✓</div>
                  <span className="font-medium text-sm">一代通用</span>
                </div>
                <div className="bg-white shadow-md rounded-lg px-4 py-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-700">✓</div>
                  <span className="font-medium text-sm">多款主題</span>
                </div>
                <div className="bg-white shadow-md rounded-lg px-4 py-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-700">✓</div>
                  <span className="font-medium text-sm">精緻小巧</span>
                </div>
                <div className="bg-white shadow-md rounded-lg px-4 py-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-700">✓</div>
                  <span className="font-medium text-sm">易於操作</span>
                </div>
              </div>

              {/* 主圖片 */}
              <img
                src={mainImage}
                alt="NINGA 蠟筆小新"
                className="w-full h-[500px] object-contain"
              />

              {/* 底部紅色標籤 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-red-600 text-white px-6 py-2 font-bold rounded-md shadow-lg">
                  {getBadgeText()}
                </div>
              </div>
            </div>

            {/* 標題 */}
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {getProductDescription()}
              </h2>
            </div>

            {/* 縮略圖 */}
            <div className="mt-6 flex justify-center gap-4">
              <img
                src={thumb1}
                alt="thumbnail 1"
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition-colors"
                onClick={() => setMainImage(thumb1)}
              />
              <img
                src={thumb2}
                alt="thumbnail 2"
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition-colors"
                onClick={() => setMainImage(thumb2)}
              />
            </div>
          </div>

          {/* 右側：商品資訊 */}
          <div className="flex flex-col gap-6">
            {/* 麵包屑導航 */}
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <a href="#" className="hover:text-gray-700">首頁</a>
              <span>/</span>
              <a href="#" className="hover:text-gray-700">卡通系列</a>
              <span>/</span>
              <span className="text-gray-700">NIN GA 主機</span>
            </div>

            {/* 標題 */}
            <h1 className="text-3xl font-bold text-gray-900">
              {getProductTitle()}
            </h1>

            {/* 價格 */}
            <div className="text-4xl font-bold text-gray-900">
              NT$550.00
            </div>

            {/* 顏色口味選擇 */}
            <div className="space-y-4">
              <label className="text-lg font-medium text-gray-800">
                顏色口味：
              </label>
              <div className="flex flex-wrap gap-3">
                {flavorOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionChange(option)}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      selectedOption === option
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    【{option}】
                  </button>
                ))}
              </div>
            </div>

            {/* 描述文字 */}
            <div className="space-y-2 text-gray-700">
              <p>購買前請添加客服 LINE: abs791012</p>
              <p>多款卡通角色可選</p>
              <p>一代通用主机设计</p>
              <p>多種配色可選</p>
              <p>卡通主題收藏首選</p>
            </div>

            {/* 數量選擇和加入購物車 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 text-lg font-medium text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button className="flex-1 bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  加入購物車
                </button>
              </div>
            </div>

            {/* 底部資訊 */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-2">
              <div>
                <span className="font-medium text-gray-800">Category:</span> {getCategory()}
              </div>
              <div>
                <span className="font-medium text-gray-800">Tags:</span> {getTags()}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 浮動聯絡我們按鈕 */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-white rounded-lg shadow-xl p-4 flex items-center gap-3">
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-gray-800">聯絡我們</span>
          </div>
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">LINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
