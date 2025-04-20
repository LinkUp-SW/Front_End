import { useState, useEffect, useRef, useCallback } from 'react';
import { WithNavBar } from '../../components';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/jobsPageComponents/Sidebar';
import TopJobPicks from './components/jobsPageComponents/TopJobsPicks';
import RecentSearches from './components/jobsPageComponents/RecentSearches';
import MoreJobs from './components/jobsPageComponents/MoreJobs';
import { RECENT_SEARCHES } from '../../constants/index';
import { Job } from './types';
import { fetchJobs, fetchTopJobs, convertJobDataToJob } from '../../endpoints/jobs';
import Cookies from 'js-cookie';

const JobsPage: React.FC = () => {
  const navigate = useNavigate();

  // State for job listings
  const [topJobs, setTopJobs] = useState<Job[]>([]);
  const [moreJobs, setMoreJobs] = useState<Job[]>([]);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const [loading, setLoading] = useState(false);
  const [topJobsLoading, setTopJobsLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  // Ref for intersection observer
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  
  // Job limit per page
  const JOBS_PER_PAGE = 5;

  // Event handlers
  const dismissTopJob = (jobId: string) => {
    setTopJobs(topJobs.filter(job => job.id !== jobId));
  };

  const dismissMoreJob = (jobId: string) => {
    setMoreJobs(moreJobs.filter(job => job.id !== jobId));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleJobSelect = (jobId: string) => {
    navigate(`/jobs/see-more?selected=${jobId}`);
  };

  // Load more jobs for infinite scrolling
  const loadMoreJobs = useCallback(async () => {
    if (!hasMore || loading) return;
    
    const token = Cookies.get('linkup_auth_token');
    if (!token) {
      console.error('No authentication token found. Please log in.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetchJobs(token, JOBS_PER_PAGE, nextCursor || undefined);
      const newJobs = response.data.map(convertJobDataToJob);
      
      setMoreJobs(prev => [...prev, ...newJobs]);
      setNextCursor(response.nextCursor);
      setHasMore(response.count < response.total);
    } catch (error) {
      console.error('Error fetching more jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, hasMore, loading]);

  // Fetch top jobs
  useEffect(() => {
    const fetchInitialTopJobs = async () => {
      const token = Cookies.get('linkup_auth_token');
      if (!token) {
        console.error('No authentication token found. Please log in.');
        return;
      }
      
      setTopJobsLoading(true);
      try {
        const response = await fetchTopJobs(token, 3); 
        const newJobs = response.data.map(convertJobDataToJob);
        setTopJobs(newJobs);
      } catch (error) {
        console.error('Error fetching top jobs:', error);
      } finally {
        setTopJobsLoading(false);
      }
    };
    
    fetchInitialTopJobs();
  }, []);

  // Initial regular jobs fetch
  useEffect(() => {
    const fetchInitialJobs = async () => {
      const token = Cookies.get('linkup_auth_token');
      if (!token) {
        console.error('No authentication token found. Please log in.');
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetchJobs(token, JOBS_PER_PAGE);
        const newJobs = response.data.map(convertJobDataToJob);
        
        setMoreJobs(newJobs);
        setNextCursor(response.nextCursor);
        setHasMore(response.count < response.total);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialJobs();
  }, []);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMoreJobs();
      }
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMoreJobs, hasMore, loading]);

  return (
    <div className="min-h-screen py-4 px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <Sidebar />
        
        <div className="w-full md:w-3/4">
          <TopJobPicks 
            jobs={topJobs} 
            onDismissJob={dismissTopJob}
            onSelectJob={handleJobSelect} 
            loading={topJobsLoading}
          />

          <RecentSearches 
            searches={recentSearches}
            onClear={clearRecentSearches}
          />
          
          <MoreJobs 
            jobs={moreJobs} 
            onDismissJob={dismissMoreJob}
            onSelectJob={handleJobSelect} 
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMoreJobs}
          />
          
          {hasMore && (
            <div 
              ref={loadingRef} 
              className="h-10 w-full"
              aria-hidden="true"
              id="jobs-infinite-scroll-trigger"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WithNavBar(JobsPage);