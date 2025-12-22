
export interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string; // Changed from Firestore Timestamp to string
  type: 'contact' | 'order';
  phone?: string;
  company?: string;
  riceType?: string;
  quantity?: string;
}

// In-memory store for development session
let submissions: Submission[] = [];

export async function getSubmissions(): Promise<Submission[]> {
  return [...submissions];
}

export async function saveSubmission(submissionData: any) {
  const newSubmission: Submission = {
    id: Math.random().toString(36).substring(7),
    ...submissionData,
    timestamp: new Date().toISOString(),
  };
  submissions.push(newSubmission);
  return { success: true, message: "Submission saved" };
}

export async function deleteSubmission(id: string) {
  submissions = submissions.filter(s => s.id !== id);
  return { success: true };
}
