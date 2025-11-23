import React, { useState } from 'react';
import { Sparkles, Wand2, Scissors, History, Download, ChevronRight } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import Button from './components/Button';
import { generateHairstyle } from './services/geminiService';
import { DesignMode } from './types';

function App() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [refImage, setRefImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<DesignMode>(DesignMode.AUTO);

  const handleGenerate = async () => {
    if (!userImage) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const finalPrompt = mode === DesignMode.AUTO 
        ? "Analyze the face shape and recommend a highly suitable, modern, and attractive hairstyle. The new hairstyle should enhance the person's features." 
        : prompt;

      const result = await generateHairstyle(userImage, finalPrompt, refImage);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `ai-hairstyle-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-500 to-pink-500 p-2 rounded-lg text-white">
              <Scissors className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
              AI 焕发
            </h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600">首页</a>
            <a href="#" className="hover:text-indigo-600">发型库</a>
            <a href="#" className="hover:text-indigo-600">关于我们</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            发现你的<span className="text-indigo-600">完美发型</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            上传照片，Gemini 2.5 智能为您匹配最适合的发型，或通过文字描述定制您的专属造型。
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Upload Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-sm">1</span>
                上传您的照片
              </h3>
              <ImageUpload 
                label="个人头像" 
                image={userImage} 
                onImageChange={setUserImage} 
                description="请上传正面清晰照片，避免遮挡面部"
              />
            </div>

            {/* 2. Customization Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-sm">2</span>
                设计偏好
              </h3>
              
              <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                <button 
                  onClick={() => setMode(DesignMode.AUTO)}
                  className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-lg transition-all ${mode === DesignMode.AUTO ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  智能匹配
                </button>
                <button 
                  onClick={() => setMode(DesignMode.CUSTOM)}
                  className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-lg transition-all ${mode === DesignMode.CUSTOM ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  深度定制
                </button>
              </div>

              {mode === DesignMode.CUSTOM && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <ImageUpload 
                    label="参考发型图 (可选)" 
                    image={refImage} 
                    onImageChange={setRefImage}
                    description="AI 将参考此图的发型风格" 
                  />
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      文字描述
                    </label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm min-h-[100px] resize-none"
                      placeholder="例如：'染成亚麻灰色的波浪卷发'，'添加复古滤镜'，或 '剪成清爽的短发'..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {mode === DesignMode.AUTO && (
                <div className="p-4 bg-indigo-50 rounded-xl text-indigo-700 text-sm">
                  <p>系统将自动分析您的脸型特征（如鹅蛋脸、方脸等），并推荐最适合的潮流发型。</p>
                </div>
              )}
            </div>

            {/* Action Button (Sticky on Mobile) */}
            <div className="sticky bottom-6 z-30">
               <Button 
                onClick={handleGenerate} 
                className="w-full py-4 text-lg shadow-xl shadow-indigo-200"
                disabled={!userImage}
                isLoading={isGenerating}
                variant="primary"
              >
                {isGenerating ? 'AI 正在设计中...' : '立即生成发型'}
              </Button>
            </div>
            
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 min-h-[600px] flex flex-col">
              <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
                <span>生成效果</span>
                {generatedImage && (
                  <Button variant="ghost" onClick={() => setGeneratedImage(null)} className="text-sm">
                    <History className="w-4 h-4 mr-2" />
                    重置
                  </Button>
                )}
              </h3>

              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 relative overflow-hidden group">
                {error ? (
                  <div className="text-center p-8 max-w-sm">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wand2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">生成遇到问题</h4>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <Button onClick={handleGenerate} variant="outline">重试</Button>
                  </div>
                ) : generatedImage ? (
                  <div className="relative w-full h-full flex flex-col">
                    <img 
                      src={generatedImage} 
                      alt="Generated Hairstyle" 
                      className="w-full h-full object-contain bg-black/5"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center pt-20">
                      <Button onClick={downloadImage} variant="secondary" className="mr-2" icon={<Download className="w-4 h-4"/>}>
                        保存图片
                      </Button>
                    </div>
                  </div>
                ) : isGenerating ? (
                  <div className="text-center space-y-4">
                     <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                        <Scissors className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
                     </div>
                     <p className="text-slate-500 font-medium animate-pulse">
                       AI 造型师正在为您设计...<br/>
                       <span className="text-xs text-slate-400 font-normal">这也可能需要几秒钟</span>
                     </p>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 max-w-sm px-6">
                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-10 h-10 text-indigo-200" />
                    </div>
                    <p className="text-lg font-medium text-slate-600 mb-2">等待生成</p>
                    <p className="text-sm">在左侧上传照片并点击生成，您的新发型将在这里展示。</p>
                  </div>
                )}
              </div>
              
              {/* Pro Tips / Features */}
              {!generatedImage && !isGenerating && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: '智能脸型分析', desc: '根据面部轮廓推荐发型' },
                    { title: '无损画质', desc: '保持原图清晰度与质感' },
                    { title: '风格多样', desc: '日系、欧美、复古任选' }
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start p-4 rounded-xl bg-slate-50 border border-slate-100">
                       <div className="mr-3 mt-1 text-indigo-500">
                         <ChevronRight className="w-4 h-4" />
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800 text-sm">{feat.title}</h4>
                         <p className="text-xs text-slate-500 mt-1">{feat.desc}</p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;