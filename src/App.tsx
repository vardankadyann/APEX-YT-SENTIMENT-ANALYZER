/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Trash2, 
  Upload, 
  ChevronRight, 
  Info, 
  Rocket, 
  Target, 
  ShieldAlert, 
  PieChart as PieChartIcon,
  Github,
  Zap,
  Globe,
  Layout,
  MessageSquare,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import Papa from 'papaparse';
import { cn } from './lib/utils';
import { analyzeBatch, type AnalysisResult } from './lib/ml';

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">A</div>
        <span className="font-bold text-xl text-slate-800 tracking-tight hidden sm:block">APEX <span className="text-blue-600">YT Analyser</span></span>
      </div>
      <div className="flex items-center gap-6">
        <a href="#about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</a>
        <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How It Works</a>
        <a href="#analyze" className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95">Get Started</a>
      </div>
    </div>
  </nav>
);

const SectionHeading = ({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) => (
  <div className={cn("mb-12", className)}>
    <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
    {subtitle && <p className="text-lg text-slate-600 max-w-2xl">{subtitle}</p>}
    <div className="w-20 h-1.5 bg-blue-600 rounded-full mt-4"></div>
  </div>
);

const Card = ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; key?: React.Key }) => (
  <div className={cn("bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300", className)} style={style}>
    {children}
  </div>
);



// --- Main App ---

export default function App() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadSampleCSV = () => {
    const csvData = [
      ["Comment"],
      ["This video is really great and helpful, thanks!"],
      ["I love this channel, amazing content as always."],
      ["Waste of time, don't watch this."],
      ["Totally useless video, very disappointed."],
      ["This is just okay, nothing special."],
      ["Wow, what a brilliant explanation. Subscribed!"],
      ["You are an idiot and this content is pathetic."],
      ["Shut up and stop spreading scam links."],
      ["I hate this so much, horrible experience."],
      ["Nice tutorial, very informative."]
    ];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_comments.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualAnalysis = () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const comments = inputText.split('\n').filter(l => l.trim().length > 0);
      const output = analyzeBatch(comments);
      setResults(output);
      setIsProcessing(false);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    Papa.parse(file, {
      complete: (results) => {
        // Assume the first column is comments
        const comments = results.data
          .map((row: any) => Object.values(row)[0] as string)
          .filter(v => v && typeof v === 'string' && v.length > 5);
        
        setTimeout(() => {
          setResults(analyzeBatch(comments));
          setIsProcessing(false);
        }, 2000);
      },
      header: true
    });
  };

  const reset = () => {
    setResults(null);
    setInputText('');
  };


  const getSentimentStats = () => {
    if (!results) return [];
    const counts = results.reduce((acc, curr) => {
      acc[curr.sentiment]++;
      return acc;
    }, { positive: 0, neutral: 0, negative: 0 });

    return [
      { name: 'Positive', value: counts.positive, color: '#10b981' },
      { name: 'Neutral', value: counts.neutral, color: '#94a3b8' },
      { name: 'Negative', value: counts.negative, color: '#ef4444' },
    ];
  };

  const getToxicityCount = () => results?.filter(r => r.isToxic).length || 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main className="pt-24 pb-20 px-6">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-6">
              <Zap size={14} className="fill-blue-700" />
              <span>B.TECH MINOR PROJECT PRODUCT</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
              APEX YT Comment <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sentiment Analyser</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Millions of comments are generated daily. Manual analysis is impossible. 
              Our tool uses Machine Learning to automate sentiment and toxicity detection for safer communities.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#analyze" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
                Get Started <ChevronRight size={20} />
              </a>
              <a href="#how-it-works" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center gap-2">
                See How It Works
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
             {/* Abstract UI Decoration */}
             <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-200/20 blur-[100px] rounded-full"></div>
             <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 aspect-video lg:aspect-square flex flex-col">
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="flex-1"></div>
                  <div className="px-4 py-1.5 bg-white rounded-lg text-xs font-medium text-slate-400 border border-slate-100 uppercase tracking-widest">DASHBOARD_PREVIEW</div>
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center items-center text-center">
                  <div className="flex gap-4 mb-8">
                    <div className="w-24 h-24 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                      <BarChart3 size={48} />
                    </div>
                    <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <MessageSquare size={48} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Real-time Analytics</h3>
                  <p className="text-slate-500 max-w-sm">Experience modern sentiment classification using TF-IDF logic.</p>
                </div>
             </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="max-w-7xl mx-auto py-24 border-t border-slate-200">
          <SectionHeading 
            title="About the Project" 
            subtitle="Why comment analysis matters in the age of massive digital interaction."
          />
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Understand Audience</h3>
              <p className="text-slate-600 leading-relaxed">Gain deep insights into what your viewers truly think about your content or brand across thousands of comments.</p>
            </Card>
            <Card>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Brand Reputation</h3>
              <p className="text-slate-600 leading-relaxed">Protect your brand by monitoring sentiment trends and reacting proactively to negative feedback cycles.</p>
            </Card>
            <Card>
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Safe Community</h3>
              <p className="text-slate-600 leading-relaxed">Automatically detect and flag toxic, hateful, or harmful comments to maintain a healthy and welcoming community space.</p>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="max-w-7xl mx-auto py-24 border-t border-slate-200">
          <SectionHeading 
            title="How It Works" 
            subtitle="Our streamlined pipeline ensures fast and reliable classification."
            className="text-center mx-auto items-center flex flex-col"
          />
          <div className="relative mt-16">
            <div className="hidden lg:block absolute top-10 left-0 w-full h-1 bg-blue-100 -z-10"></div>
            <div className="grid lg:grid-cols-5 gap-8">
              {[
                { icon: <Upload />, title: "Data Input", desc: "Upload CSV or paste comments" },
                { icon: <Trash2 />, title: "Text Cleaning", desc: "Remove emojis, links, spam" },
                { icon: <Search />, title: "TF-IDF Vector", desc: "Extract numerical features" },
                { icon: <Layout />, title: "Classification", desc: "Logistic Regression model" },
                { icon: <BarChart3 />, title: "Dashboard", desc: "Visualize insights" }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-600 shadow-xl mb-6 bg-white z-10 transition-transform hover:scale-110">
                    {step.icon}
                  </div>
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-4 shadow-lg shadow-blue-200">0{i+1}</div>
                  <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                  <p className="text-slate-500 text-sm px-4">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section id="analyze" className="max-w-7xl mx-auto py-24 border-t border-slate-200 scroll-mt-20">
          <SectionHeading 
            title="Start Analysis" 
            subtitle="Upload your YouTube comments dataset to get instant results."
          />
          
          {!results ? (
            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="flex flex-col h-full border-blue-200 bg-blue-50/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <FileText size={20} />
                  </div>
                  <h3 className="text-xl font-bold">CSV Upload</h3>
                </div>
                <p className="text-slate-600 mb-8">Best for large scale analysis. Upload your exported YouTube comments CSV file.</p>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all py-12"
                >
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-800">Choose CSV File</p>
                    <p className="text-sm text-slate-500">or drag and drop here</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </div>
                <button 
                  onClick={downloadSampleCSV}
                  className="mt-8 text-sm font-semibold text-blue-600 flex items-center gap-2 hover:underline"
                >
                  <Download size={14} /> Download Sample Dataset
                </button>
              </Card>

              <Card className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Manual Input</h3>
                </div>
                <p className="text-slate-600 mb-6">Paste comments manually (one per line) for a quick test.</p>
                <textarea 
                  className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none font-sans outline-none min-h-[250px]"
                  placeholder="Paste comments here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button 
                  onClick={handleManualAnalysis}
                  disabled={!inputText.trim() || isProcessing}
                  className="w-full mt-8 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 leading-none shadow-lg shadow-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-3">
                      <RefreshCw size={20} className="animate-spin" /> Processing...
                    </span>
                  ) : (
                    "Analyze Comments"
                  )}
                </button>
              </Card>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Result Dashboard Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Results Dashboard</h2>
                    <p className="text-slate-500">Analyzed {results.length} total comments</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={reset} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                       <RefreshCw size={18} /> Reset
                    </button>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
                       <Download size={18} /> Export Results
                    </button>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                   {getSentimentStats().map((stat, i) => (
                     <Card key={i} className="p-6 text-center border-b-4" style={{ borderColor: stat.color }}>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.name}</p>
                        <p className="text-4xl font-black" style={{ color: stat.color }}>
                          {Math.round((stat.value / results.length) * 100)}%
                        </p>
                        <p className="text-slate-400 text-xs mt-1">{stat.value} total</p>
                     </Card>
                   ))}
                   <Card className="p-6 text-center border-b-4 border-rose-500">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Toxic</p>
                      <p className="text-4xl font-black text-rose-500">
                        {getToxicityCount()}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">flagged items</p>
                   </Card>
                </div>

                {/* Visualizations */}
                <div className="grid lg:grid-cols-2 gap-8">
                   <Card className="p-8 h-[400px] flex flex-col">
                      <div className="flex items-center gap-2 mb-8">
                        <PieChartIcon size={20} className="text-blue-600" />
                        <h3 className="font-bold text-xl">Sentiment Distribution</h3>
                      </div>
                      <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getSentimentStats()}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {getSentimentStats().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                   </Card>

                   <Card className="p-8 h-[400px] flex flex-col">
                      <div className="flex items-center gap-2 mb-8">
                        <BarChart3 size={20} className="text-blue-600" />
                        <h3 className="font-bold text-xl">Response Frequency</h3>
                      </div>
                      <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getSentimentStats()}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                               {getSentimentStats().map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                   </Card>
                </div>

                {/* Flagged Comments Section */}
                <div>
                   <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                        <ShieldAlert size={20} />
                      </div>
                      <h3 className="text-2xl font-bold">Toxic Content Filter</h3>
                   </div>
                   <div className="space-y-4">
                      {results.filter(r => r.isToxic).length > 0 ? (
                        results.filter(r => r.isToxic).slice(0, 5).map((item, i) => (
                          <div key={i} className="bg-rose-50/50 border border-rose-100 p-6 rounded-2xl flex gap-4 items-start">
                             <div className="mt-1"><AlertTriangle size={20} className="text-rose-500 shrink-0" /></div>
                             <div className="flex-1">
                                <p className="text-slate-800 mb-2 italic">"{item.text}"</p>
                                <div className="flex flex-wrap gap-2">
                                  <span className="px-2 py-1 bg-rose-200 text-rose-800 text-[10px] uppercase font-black rounded tracking-wider">HARMFUL CONTENT</span>
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold rounded tracking-wider">TOXICITY SCORE: {Math.round(item.toxicityScore * 100)}%</span>
                                </div>
                             </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-green-50 border border-green-100 p-12 rounded-3xl text-center">
                           <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                           <h4 className="text-lg font-bold text-green-800">Clean Result!</h4>
                           <p className="text-green-600">No toxic comments detected in this batch.</p>
                        </div>
                      )}
                      {results.filter(r => r.isToxic).length > 5 && (
                        <p className="text-center text-slate-400 text-sm py-4 italic">+ {results.filter(r => r.isToxic).length - 5} more flagged comments</p>
                      )}
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </section>

        {/* Features Section */}
        <section className="bg-slate-900 -mx-6 px-6 py-24 my-20">
           <div className="max-w-7xl mx-auto text-center">
              <SectionHeading 
                title="Powerful Features" 
                subtitle="Designed for efficiency and accuracy in minor project prototype."
                className="text-white mx-auto items-center flex flex-col mb-20"
              />
              <div className="grid md:grid-cols-4 gap-8">
                 {[
                   { icon: <Zap />, title: "Instant Processing", desc: "Results in seconds" },
                   { icon: <CheckCircle2 />, title: "High Accuracy", desc: "ML-driven insights" },
                   { icon: <Layout />, title: "Simple UI", desc: "Zero learning curve" },
                   { icon: <Rocket />, title: "Scalable", desc: "Handles 10k+ rows" }
                 ].map((feat, i) => (
                   <div key={i} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 text-left">
                      <div className="text-blue-400 mb-4">{feat.icon}</div>
                      <h4 className="text-white font-bold text-lg mb-2">{feat.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Tech Stack */}
        <section className="max-w-7xl mx-auto py-24">
           <SectionHeading 
             title="Internal Architecture" 
             subtitle="The technologies powering this minor project prototype."
           />
           <div className="flex flex-wrap gap-4">
              {["Python (Training)", "TypeScript (Frontend)", "React", "Tailwind CSS", "Scikit-Learn", "TF-IDF Vectorizer", "Logistic Regression", "Recharts", "Framer Motion"].map((tech, i) => (
                <div key={i} className="px-5 py-3 bg-white border border-slate-200 rounded-xl font-medium shadow-sm hover:border-blue-400 transition-colors">
                  {tech}
                </div>
              ))}
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 mb-12">
               <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
                    <span className="font-bold text-lg">APEX <span className="text-blue-600">YT Analyser</span></span>
                  </div>
                  <p className="text-slate-500 max-w-sm mb-6">
                    Automating sentiment analysis for the YouTube ecosystem using statistical Machine Learning techniques.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-blue-600 hover:text-white transition-all"><Github size={18} /></a>
                    <a href="#" className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-blue-600 hover:text-white transition-all"><Globe size={18} /></a>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Project Details</h5>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li>B.Tech Minor Project</li>
                      <li>Computer Science Engineering</li>
                      <li>Academic Year 2025-26</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Team APEX</h5>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li>Manish</li>
                      <li>Rohit</li>
                      <li>Vardan</li>
                    </ul>
                  </div>
               </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center border border-slate-100">
               <p className="text-slate-400 text-sm italic">"Turning data into meaningful emotional insights."</p>
               <p className="text-slate-500 text-sm font-medium">© 2026 Team APEX. All rights reserved.</p>
            </div>
         </div>
      </footer>

      {/* Simple Processing Notification */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-8 right-8 z-[100]"
          >
            <div className="bg-slate-900 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4">
               <RefreshCw size={24} className="animate-spin text-blue-400" />
               <div>
                  <p className="font-bold">Analyzing Dataset</p>
                  <p className="text-xs text-slate-400">Applying TF-IDF & Logistic Regression...</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

