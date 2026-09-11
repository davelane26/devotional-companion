import { useState, useEffect, useCallback } from 'react';
import { SermonPlanResponse, BookStudyResponse } from '../types/devotional';

const SERMON_PLAN_URL = 'https://davelane26.github.io/rlcf-study-plan/output/latest.json';
const BOOK_STUDY_URL = 'https://davelane26.github.io/book-study-plan/output/book-schedule.json';

const CACHE_KEY_SERMON = 'cached_sermon_plan_data';
const CACHE_KEY_BOOK = 'cached_book_study_data';
const CACHE_KEY_TIMESTAMP = 'cached_devotional_timestamp';

export function useDevotionalData() {
  const [sermonPlan, setSermonPlan] = useState<SermonPlanResponse | null>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_SERMON);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [bookStudy, setBookStudy] = useState<BookStudyResponse | null>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_BOOK);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(() => !sermonPlan || !bookStudy);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [lastFetched, setLastFetched] = useState<string | null>(() => {
    return localStorage.getItem(CACHE_KEY_TIMESTAMP);
  });

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    let sermonData: SermonPlanResponse | null = null;
    let bookData: BookStudyResponse | null = null;
    const errors: string[] = [];

    // Fetch Sermon Plan
    try {
      const res = await fetch(SERMON_PLAN_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      sermonData = await res.json();
      setSermonPlan(sermonData);
      localStorage.setItem(CACHE_KEY_SERMON, JSON.stringify(sermonData));
    } catch (err) {
      console.warn('Could not fetch sermon plan from network:', err);
      errors.push('Sermon plan update failed (using cached data if available)');
    }

    // Fetch Book Study Plan
    try {
      const res = await fetch(BOOK_STUDY_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      bookData = await res.json();
      setBookStudy(bookData);
      localStorage.setItem(CACHE_KEY_BOOK, JSON.stringify(bookData));
    } catch (err) {
      console.warn('Could not fetch book study plan from network:', err);
      errors.push('Book study update failed (using cached data if available)');
    }

    if (sermonData || bookData) {
      const nowStr = new Date().toISOString();
      setLastFetched(nowStr);
      localStorage.setItem(CACHE_KEY_TIMESTAMP, nowStr);
    }

    // Only flag error if we have neither network nor cached data
    if (errors.length > 0 && !sermonPlan && !bookStudy) {
      setError(errors.join('. '));
    }

    setLoading(false);
  }, [sermonPlan, bookStudy]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    sermonPlan,
    bookStudy,
    loading,
    error,
    isOffline,
    lastFetched,
    refetch: fetchData,
  };
}

