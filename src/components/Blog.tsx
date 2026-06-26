import React, { useState, useEffect } from "react";
import { BookOpen, User, Clock, Calendar, ArrowRight, X, Heart, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BlogPost } from "../types";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching blog articles:", err));
  }, []);

  return (
    <section id="lxnaria-blog" className="py-24 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[10px] font-sans text-neutral-400 dark:text-neutral-500 tracking-[0.5em] uppercase">
            AESTHETIC EDUCATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif mt-2 tracking-widest uppercase">
            THE <span className="font-sans italic font-light lowercase">chronicle</span>
          </h2>
          <div className="w-12 h-[1px] bg-amber-500 mt-4"></div>
          <p className="mt-4 text-xs text-neutral-500 max-w-md font-light leading-relaxed">
            Science-backed beauty essays, scalp detox advice, lipid reconstruction, and 
            modern luxury wellness tips written by board-certified masters.
          </p>
        </div>

        {/* Blog Post List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="text-sm font-sans tracking-widest text-neutral-400 animate-pulse">Printing latest chronicles...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <motion.article
                key={post.id}
                whileHover={{ y: -4 }}
                className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    <span>{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-neutral-950 dark:text-white hover:text-amber-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed line-clamp-3">
                    {post.snippet}
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400">
                    <User className="w-4 h-4 text-neutral-300" />
                    <span>By <strong>{post.author}</strong></span>
                    <span>•</span>
                    <span className="font-semibold text-neutral-500">{post.date}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="px-4 py-2 text-[10px] font-sans font-bold tracking-widest uppercase text-neutral-700 dark:text-neutral-300 hover:text-amber-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    Read Chronicles <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>

      {/* Blog Detail Article Lightbox overlay */}
      <AnimatePresence>
        {selectedPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950 z-50 cursor-pointer"
              onClick={() => setSelectedPost(null)}
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="fixed top-12 bottom-12 left-6 right-6 md:left-1/2 md:right-auto md:w-full md:max-w-3xl md:-translate-x-1/2 bg-white dark:bg-neutral-950 p-6 md:p-10 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="space-y-6">
                
                {/* Header controls */}
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-4">
                  <span className="text-[10px] font-sans font-bold tracking-widest text-amber-600 dark:text-amber-500 uppercase">
                    CHRONICLE {selectedPost.id.toUpperCase()}
                  </span>
                  <button onClick={() => setSelectedPost(null)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full cursor-pointer">
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                {/* Cover visual placeholder */}
                <div className="h-64 rounded-xl overflow-hidden bg-neutral-100">
                  <img
                    src={selectedPost.id === "blog-skin-barrier" ? "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200" : "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1200"}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex gap-4 text-xs font-mono text-neutral-400 uppercase">
                    <span>{selectedPost.category}</span>
                    <span>•</span>
                    <span>{selectedPost.readTime}</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
                    {selectedPost.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans italic pt-1">
                    Written by Master {selectedPost.author} on {selectedPost.date}
                  </p>
                </div>

                {/* Article Body */}
                <div className="prose prose-neutral dark:prose-invert text-xs sm:text-sm leading-relaxed font-light text-neutral-700 dark:text-neutral-300 space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <p>{selectedPost.snippet}</p>
                  <p className="text-sm font-sans text-neutral-800 dark:text-neutral-200">{selectedPost.content}</p>
                  <p>In addition, maintaining proper balance through the correct formulation of Blue Tansy extract and blue squalane works wonders to re-synchronize cellular water-retaining membranes overnight. We recommend booking a dedicated skin analysis session at LXNARIA for custom skin blueprinting.</p>
                </div>

                {/* Foot indicators */}
                <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-neutral-400">
                  <div className="flex gap-2 text-xs">
                    <button className="flex items-center gap-1 hover:text-rose-500 cursor-pointer">
                      <Heart className="w-4 h-4" /> 42 Likes
                    </button>
                    <button className="flex items-center gap-1 hover:text-amber-500 cursor-pointer">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-xs tracking-wider uppercase font-sans font-bold rounded-lg"
                  >
                    Done Reading
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
