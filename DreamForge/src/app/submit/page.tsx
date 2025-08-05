'use client';

import  {SubmissionForm}  from "@/components/submission-form";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SubmitPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="container mx-auto px-4 py-8">Yükleniyor...</div>;
  }
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
      <SubmissionForm />
    </div>
  );
}
