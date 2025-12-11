// src/firebase/firestore/use-doc.tsx
'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, doc, getDoc, type DocumentData, type DocumentReference } from 'firebase/firestore';

import { useFirestore } from '@/firebase/provider';

export const useDoc = <T extends DocumentData>(path: string, id: string) => {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore || !id) {
        setLoading(false);
        return;
    };

    const docRef = doc(firestore, path, id);

    const unsubscribe = onSnapshot(docRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const docData = { id: docSnapshot.id, ...docSnapshot.data() } as T;

        // Check for reference types and fetch them
        for (const key in docData) {
            if (docData[key] instanceof DocumentReference) {
                const ref = docData[key] as DocumentReference;
                const referencedDoc = await getDoc(ref);
                if (referencedDoc.exists()) {
                    docData[key] = { id: referencedDoc.id, ...referencedDoc.data() } as any;
                }
            }
        }

        setData(docData);
      } else {
        setData(null);
      }
      setLoading(false);
    }, (error) => {
        console.error("Error fetching document:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, path, id]);

  return { data, loading };
};
