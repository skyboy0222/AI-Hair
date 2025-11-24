import React, { useState, useEffect } from 'react';
import { Key, X, ExternalLink } from 'lucide-react';
import Button from './Button';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  initialKey: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, initialKey }) => {
  const [inputValue, setInputValue] = useState(initialKey);

  useEffect(() => {
    setInputValue(initialKey);
  }, [initialKey, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" />
            配置 API Key
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500 leading-relaxed">
            为了正常使用 AI 发型设计功能，请提供您的 Gemini API Key。
            <br/>
            <span className="text-xs text-gray-400">密钥仅保存在您的本地浏览器中，不会上传至我们的服务器。</span>
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Gemini API Key</label>
            <input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-mono text-sm"
              autoFocus
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} className="flex-1">取消</Button>
            <Button variant="primary" onClick={() => onSave(inputValue)} className="flex-1">
              保存配置
            </Button>
          </div>
          
           <div className="pt-4 border-t border-gray-100 text-center">
            <a 
              href="https://aistudiocdn.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              没有 Key? 点击前往 Google AI Studio 免费获取
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;