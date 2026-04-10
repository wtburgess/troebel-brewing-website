"use client";

import QuickAddModal from "@/components/ui/QuickAddModal";
import ToastContainer from "@/components/ui/ToastContainer";

export default function ModalProvider() {
  return (
    <>
      <QuickAddModal />
      <ToastContainer />
    </>
  );
}
