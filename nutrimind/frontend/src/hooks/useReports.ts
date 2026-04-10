import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import type { Report, ClientInput, GenerateReportResponse } from "../types";

export const useReports = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "reports"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data: Report[] = snapshot.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          ...raw,
          createdAt: (raw.createdAt as Timestamp).toDate(),
        } as Report;
      });
      setReports(data);
    } catch (e: unknown) {
      setError("レポートの取得に失敗しました。");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchReport = async (reportId: string): Promise<Report | null> => {
    try {
      const docRef = doc(db, "reports", reportId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      const raw = snapshot.data();
      return {
        id: snapshot.id,
        ...raw,
        createdAt: (raw.createdAt as Timestamp).toDate(),
      } as Report;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const generateReport = async (input: ClientInput): Promise<GenerateReportResponse> => {
    const fn = httpsCallable<ClientInput, GenerateReportResponse>(
      functions,
      "generateNutritionReport"
    );
    const result = await fn(input);
    await fetchReports(); // 生成後に一覧を更新
    return result.data;
  };

  return { reports, loading, error, fetchReports, fetchReport, generateReport };
};
