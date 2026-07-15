"use client";

import { useState, useEffect } from "react";

interface Post {
  id: string;
  space: string;
  author: string;
  authorAvatar?: string;
  time: string;
  content: string;
  hugs: number;
  hasHugged: boolean;
  anonymous: boolean;
}

export default function CommunityPage() {
  const [activeSpace, setActiveSpace] = useState("Support Stories");
  const [userName, setUserName] = useState("Sarah J.");
  
  // Post Editor state
  const [isExpandingEditor, setIsExpandingEditor] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [isPostAnonymous, setIsPostAnonymous] = useState(true);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "post-1",
      space: "Support Stories",
      author: "Anonymous_User88",
      authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA4Db0aFaGmvQmvXdc2VRA--aHiZB2sd_YhHa1vrD8MGfeL53gAA3MO7FbZ-0drCgusNFOkFnWQPJ7rqy8M3HqWuWRyWQm42iliUBN5efctCUUbbvSs-yXRxXNIJzzUM8am32aXeR38M_Gv4hWBP_pRK2JY7q8M5VKIQF1XX7mZNv4CRZjOZsQ3R0Svw06BSkUR48XvtB4sEXTlxQ8P7Cj_kCvZU5i2B8yR9edQmVT_iZPjcJ0jPvr",
      time: "2 hours ago",
      content: "Today I finally took the step to reach out to a local counselor. It was incredibly hard, but I feel a tiny bit lighter just knowing I have an appointment. Thank you to everyone here who encouraged me last week. Your words meant the world.",
      hugs: 24,
      hasHugged: false,
      anonymous: true,
    },
    {
      id: "post-2",
      space: "Support Stories",
      author: "EmpoweredSoul",
      time: "5 hours ago",
      content: "Just completed the Workplace Safety guidelines module. Knowledge is truly protective armor. Highly recommend reading the cyber cell advice for security setup.",
      hugs: 12,
      hasHugged: true,
      anonymous: false,
    },
    {
      id: "post-3",
      space: "Legal Advice",
      author: "AdvocateMeera",
      time: "1 day ago",
      content: "Remember, under constitutional provisions, you have the right to register a Zero FIR at any police station regardless of jurisdiction. Do not hesitate to invoke your safety codes.",
      hugs: 45,
      hasHugged: false,
      anonymous: false,
    },
    {
      id: "post-4",
      space: "Self-Esteem Booster",
      author: "Anonymous_User02",
      time: "2 days ago",
      content: "You are stronger than you think. Stand tall, set clear boundaries, and never accept compromise on your boundaries of dignity.",
      hugs: 32,
      hasHugged: false,
      anonymous: true,
    },
  ]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(`${storedName} J.`);
    }
  }, []);

  const handleToggleHug = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            hugs: post.hasHugged ? post.hugs - 1 : post.hugs + 1,
            hasHugged: !post.hasHugged,
          };
        }
        return post;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorContent.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      space: activeSpace,
      author: isPostAnonymous ? `Anonymous_User${Math.floor(10 + Math.random() * 90)}` : userName,
      time: "Just now",
      content: editorContent,
      hugs: 0,
      hasHugged: false,
      anonymous: isPostAnonymous,
    };

    setPosts((prev) => [newPost, ...prev]);
    setEditorContent("");
    setIsExpandingEditor(false);
  };

  const spaces = [
    { name: "Support Stories", icon: "favorite" },
    { name: "Legal Advice", icon: "gavel" },
    { name: "Self-Esteem Booster", icon: "psychology" },
    { name: "Local Support Groups", icon: "diversity_3" },
  ];

  const filteredPosts = posts.filter((p) => p.space === activeSpace);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-12 flex-grow font-body-md">
      {/* Dynamic Notification Banner */}
      <div className="bg-secondary-container/70 backdrop-blur-sm border border-white/50 text-on-secondary-container p-4 rounded-2xl flex items-start gap-3 mb-8 shadow-sm animate-fade-in">
        <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
          info
        </span>
        <div className="text-sm">
          <p className="font-label-bold font-bold text-on-secondary-container">Community Update</p>
          <p className="text-on-secondary-container/90 mt-1 leading-relaxed">
            We are hosting a live Q&A session on legal rights this Friday. Join us to get your questions answered by experts in a safe, moderated environment.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Space Filtering */}
        <aside className="w-full md:w-1/4 flex-shrink-0">
          <div className="glass-card rounded-3xl p-5 sticky top-28 border border-white/50 space-y-6 shadow-sm">
            <h2 className="font-headline-md text-xl font-bold text-on-surface">Community Spaces</h2>
            
            <nav className="flex flex-col gap-2">
              {spaces.map((sp) => (
                <button
                  key={sp.name}
                  onClick={() => {
                    setActiveSpace(sp.name);
                    setIsExpandingEditor(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-bold text-xs font-bold transition-colors cursor-pointer text-left ${
                    activeSpace === sp.name
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-white/40 hover:text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: activeSpace === sp.name ? "'FILL' 1" : "'FILL' 0" }}>
                    {sp.icon}
                  </span>
                  {sp.name}
                </button>
              ))}
            </nav>

            <div className="pt-6 border-t border-outline-variant/30 space-y-3">
              <h3 className="font-label-bold text-xs font-extrabold text-on-surface-variant uppercase tracking-wider">
                Guidelines
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                This is a safe, moderated space. Be kind, supportive, and respect privacy. Any violation will be flagged immediately.
              </p>
              <a href="#" className="inline-block text-primary hover:underline text-xs font-bold">
                Read full safety guidelines
              </a>
            </div>
          </div>
        </aside>

        {/* Community Feed */}
        <div className="w-full md:w-3/4 flex flex-col gap-5">
          {/* Interactive Create Post Input Card */}
          <div className="glass-card rounded-3xl p-5 border border-white/50 shadow-sm relative">
            {!isExpandingEditor ? (
              <div
                onClick={() => setIsExpandingEditor(true)}
                className="flex gap-3 items-center cursor-pointer hover:shadow-inner transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-surface-container-high/60 flex items-center justify-center border shrink-0 text-outline">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className="bg-surface-container-low/50 hover:bg-surface-container-low w-full rounded-full py-3 px-5 text-on-surface-variant text-xs font-medium border border-white/30 text-left">
                  Share your story or ask for advice in {activeSpace}...
                </div>
                <button className="p-2 text-primary hover:bg-primary-container/30 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-xl">image</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreatePost} className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">create</span>
                    Posting to {activeSpace}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsExpandingEditor(false)}
                    className="text-on-surface-variant hover:text-error text-xs font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <textarea
                  required
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-2xl p-3 focus:ring-2 focus:ring-primary focus:bg-white text-xs font-body-md transition-all resize-none text-on-surface"
                  placeholder="What is on your mind? Keep it safe and constructive..."
                  rows={4}
                ></textarea>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-on-surface-variant">
                    <input
                      type="checkbox"
                      checked={isPostAnonymous}
                      onChange={(e) => setIsPostAnonymous(e.target.checked)}
                      className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer w-4 h-4"
                    />
                    Post Anonymously (Hides Name)
                  </label>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full font-label-bold text-xs font-bold bg-primary text-on-primary hover:bg-primary/95 shadow transition-all cursor-pointer flex items-center gap-1 ml-auto sm:ml-0"
                  >
                    Post Share <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Posts Feed List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center p-12 glass-panel rounded-3xl text-on-surface-variant border font-semibold">
                No posts in this space yet. Start the conversation!
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="glass-card rounded-3xl p-5 border border-white/50 shadow-sm space-y-4 animate-fade-in"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container/40 border border-white flex items-center justify-center overflow-hidden shrink-0">
                        {post.authorAvatar ? (
                          <img
                            className="w-full h-full object-cover"
                            alt="User Avatar"
                            src={post.authorAvatar}
                          />
                        ) : (
                          <span className="material-symbols-outlined text-primary text-xl">person</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-label-bold text-xs font-bold text-on-surface">
                          {post.author}
                        </h4>
                        <p className="text-[10px] text-on-surface-variant/80">
                          {post.time} in <span className="text-primary font-bold">{post.space}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-on-surface-variant/70 hover:text-error transition-colors p-1.5 rounded-full hover:bg-error-container/20 cursor-pointer"
                      title="Report Post"
                      onClick={() => alert("This post has been reported for moderation.")}
                    >
                      <span className="material-symbols-outlined text-sm">flag</span>
                    </button>
                  </div>

                  <div className="text-sm text-on-surface leading-relaxed whitespace-pre-line text-xs md:text-sm">
                    {post.content}
                  </div>

                  <div className="flex items-center gap-4 border-t border-outline-variant/10 pt-3">
                    <button
                      onClick={() => handleToggleHug(post.id)}
                      className={`flex items-center gap-1.5 transition-colors text-xs font-bold cursor-pointer ${
                        post.hasHugged ? "text-error font-extrabold" : "text-on-surface-variant/80 hover:text-error"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: post.hasHugged ? "'FILL' 1" : "'FILL' 0" }}>
                        favorite
                      </span>
                      {post.hugs} {post.hugs === 1 ? "Hug" : "Hugs"}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
