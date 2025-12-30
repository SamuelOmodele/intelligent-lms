"use client";
import React from 'react';
import { 
  LogOut, 
  AlertCircle, 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-none p-0 overflow-hidden shadow-2xl">
        
        <div className="p-8">
          {/* Icon Header */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 animate-pulse">
              <LogOut size={32} strokeWidth={2.5} />
            </div>
          </div>

          <DialogHeader className="text-center space-y-3">
            <DialogTitle className="text-xl font-black text-[#002147] leading-tight">
              Terminate Session?
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium text-base">
              Are you sure you want to log out? You will need to re-authenticate to access the Admin Portal.
            </DialogDescription>
          </DialogHeader>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              onClick={onConfirm}
              className="w-full bg-[#002147] text-white font-black py-3 rounded-[5px] uppercase text-xs tracking-widest hover:bg-blue-900 transition-all active:scale-[0.98]"
            >
              Yes, Sign Me Out
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-white text-slate-400 font-black py-3 rounded-[5px] uppercase text-xs tracking-widest hover:text-slate-600 hover:bg-slate-50 transition-all border border-slate-300"
            >
              Stay Logged In
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            <AlertCircle size={12} />
            <span>Secure Logout • PremierLMS v2.0</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}