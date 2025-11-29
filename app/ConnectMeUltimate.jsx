
"use client";
import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase/client";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

import {
  MessageCircle, ThumbsUp, Share2, MoreHorizontal, Search, Bell, Menu, X,
  Image as ImageIcon, Video, Smile, User, LogOut, Send, Home, Users, Store,
  PlayCircle, Cpu, Moon, Sun, Globe, MapPin, Briefcase, Lock, ShieldCheck,
  CreditCard, CheckCircle, Star, Zap, Activity, Radio, Mic, Camera,
  Smartphone, BarChart, CloudLightning, Database, Eye, Fingerprint,
  Gift, Heart, Infinity, Key, Layers, Music, Navigation, Power,
  Rocket, Server, Terminal, Umbrella, Voicemail, Wifi, Youtube, Grid, Brain
} from "lucide-react";

// Minimal replacement icons for missing imports in original file
const BrainIcon = () => <Cpu size={24} className="text-cyan-400" />;
const GridIcon = () => <Layers size={24} className="text-purple-400" />;
const ToolIcon = () => <Rocket size={24} className="text-pink-400" />;

const appId = "connectme-ultimate-v2";
const ADMIN_EMAIL = "sokpahakinsaye@gmail.com";

export default function ConnectMeUltimate() {
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && u.email === ADMIN_EMAIL) setIsAdmin(true);

      if (u) {
        const userRef = doc(db, "artifacts", appId, "users", u.uid, "profile", "info");
        const unsub = onSnapshot(userRef, (snap) => {
          if (snap.exists() && snap.data().isPro) setIsPro(true);
        });
        return () => unsub();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 w-full max-w-md text-center shadow-2xl">
          <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <Globe className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">ConnectMe <span className="text-yellow-400">Ultimate</span></h1>
          <p className="text-gray-300 mb-8">The World's Most Advanced Social Network.</p>
          <button onClick={handleLogin} className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg">
            Sign in with Google
          </button>
          <p className="mt-6 text-xs text-gray-500">Created by Akin S. Sokpah, Liberia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"} font-sans overflow-x-hidden`}>
      <nav className={`fixed top-0 w-full z-30 ${darkMode ? "bg-gray-900/90 border-b border-gray-800" : "bg-white shadow-sm"} backdrop-blur-md px-4 h-16 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg"><Globe size={20} className="text-white"/></div>
          <span className="text-xl font-bold hidden md:block">ConnectMe</span>
          {isPro && <span className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded font-bold">PRO</span>}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowAI(!showAI)} className="p-2 rounded-full hover:bg-gray-800 relative group">
            <Cpu className={isPro ? "text-yellow-400" : "text-blue-500"} />
          </button>
          {!isPro && (
            <button onClick={() => setShowProModal(true)} className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-4 py-1.5 rounded-full font-bold text-sm">
              Get PRO
            </button>
          )}
          <div className="relative group">
            <img src={user.photoURL} className="w-9 h-9 rounded-full border border-gray-600 cursor-pointer" />
            <div className="absolute right-0 top-10 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 hidden group-hover:block overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-700">
                <p className="font-bold text-sm truncate">{user.displayName}</p>
                <p className="text-xs text-gray-400">{isPro ? 'Premium Member' : 'Free Member'}</p>
              </div>
              {isAdmin && (
                <button onClick={() => setShowAdminPanel(true)} className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 flex items-center gap-2">
                  <ShieldCheck size={14}/> Admin Panel
                </button>
              )}
              <button onClick={() => signOut(auth)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2">
                <LogOut size={14}/> Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex justify-center max-w-[1600px] mx-auto">
        <div className="flex-1 max-w-2xl w-full p-4">
          {activeTab === 'feed' && (
            <>
              <div className={`bg-gray-800/50 p-4 rounded-xl mb-6 border`}>
                <div className="flex gap-3">
                  <img src={user.photoURL} className="w-10 h-10 rounded-full"/>
                  <input className="bg-transparent flex-1 outline-none text-white placeholder-gray-500" placeholder="Share your world..." />
                </div>
                <div className="flex justify-between mt-4 pt-3 border-t border-gray-700">
                   <div className="flex gap-4 text-gray-400">
                     <ImageIcon size={20} className="hover:text-green-400 cursor-pointer"/>
                     <Video size={20} className="hover:text-red-400 cursor-pointer"/>
                     <Smile size={20} className="hover:text-yellow-400 cursor-pointer"/>
                   </div>
                   <button className="bg-blue-600 px-6 py-1 rounded-full font-bold text-sm hover:bg-blue-500">Post</button>
                </div>
              </div>

              {[1,2,3].map(i => (
                <div key={i} className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
                  <div className="flex justify-between mb-3">
                    <div className="flex gap-3">
                      <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} className="w-10 h-10 rounded-full"/>
                      <div>
                        <h4 className="font-bold">User {i}</h4>
                        <p className="text-xs text-gray-500">2 hrs ago • Liberia</p>
                      </div>
                    </div>
                    <MoreHorizontal className="text-gray-500"/>
                  </div>
                  <p className="mb-3 text-gray-300">Just exploring the new ConnectMe Ultimate features! The AI is insane. 🇱🇷🚀</p>
                  <div className="h-64 bg-gray-900 rounded-lg mb-3 flex items-center justify-center text-gray-600">
                    [Rich Media Content]
                  </div>
                  <div className="flex justify-between text-gray-400 border-t border-gray-700 pt-3">
                    <button className="flex items-center gap-2 hover:text-blue-400"><ThumbsUp size={18}/> Like</button>
                    <button className="flex items-center gap-2 hover:text-blue-400"><MessageCircle size={18}/> Comment</button>
                    <button className="flex items-center gap-2 hover:text-blue-400"><Share2 size={18}/> Share</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
