// src/firebase/firestore/use-collection.tsx
'use client';
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  startAt,
  endAt,
  doc,
  getDoc,
  type DocumentData,
  type Query,
  type DocumentReference,
} from 'firebase/firestore';

import { useFirestore } from '@/firebase/provider';

interface UseCollectionOptions {
  where?: [string, '===' | '==' | '!=' | '<' | '<=' | '>' | '>=', any][];
  orderBy?: [string, 'asc' | 'desc'];
  limit?: number;
  startAfter?: any;
  endBefore?: any;
  limitToLast?: number;
  startAt?: any;
  endAt?: any;
}

export const useCollection = <T extends DocumentData>(
  path: string,
  options?: UseCollectionOptions
) => {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    let q: Query = collection(firestore, path);

    if (options?.where) {
      options.where.forEach((w) => {
        q = query(q, where(w[0], w[1], w[2]));
      });
    }

    if (options?.orderBy) {
      q = query(q, orderBy(options.orderBy[0], options.orderBy[1]));
    }

    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    if (options?.startAfter) {
      q = query(q, startAfter(options.startAfter));
    }

    if (options?.endBefore) {
      q = query(q, endBefore(options.endBefore));
    }

    if (options?.limitToLast) {
      q = query(q, limitToLast(options.limitToLast));
    }

    if (options?.startAt) {
      q = query(q, startAt(options.startAt));
    }

    if (options?.endAt) {
      q = query(q, endAt(options.endAt));
    }

    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        const data: T[] = [];
        for (const docSnapshot of querySnapshot.docs) {
          let docData = {
            id: docSnapshot.id,
            ...docSnapshot.data(),
          } as T;

          // Check for reference types and fetch them
          for (const key in docData) {
            if (docData[key] instanceof DocumentReference) {
              const ref = docData[key] as DocumentReference;
              const referencedDoc = await getDoc(ref);
              if (referencedDoc.exists()) {
                docData[key] = {
                  id: referencedDoc.id,
                  ...referencedDoc.data(),
                } as any;
              }
            }
          }

          data.push(docData);
        }
        setData(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching collection:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path, JSON.stringify(options)]);

  return { data, loading };
};
