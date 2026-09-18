"use client";

import QuickAddModal from "@/components/ui/QuickAddModal";
import ToastContainer from "@/components/ui/ToastContainer";
import AgeGate from "@/components/AgeGate";

export default function ModalProvider() {
  return (
    <>
      <QuickAddModal />
      <ToastContainer />
      <AgeGate />
    </>
  );
}
