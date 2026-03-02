export interface CodeFile {
  name: string;
  src: string;
  lang: 'html' | 'css' | 'javascript' | 'python' | 'jsx';
}

export interface ProjectTags {
  difficulty: string[];
  features: string[];
  tech: string[];
}

export interface Project {
  category: 'HTML' | 'CSS' | 'JavaScript' | 'Python' | 'React';
  title: string;
  iframeSrc?: string;
  description: string;
  codeFiles: CodeFile[];
  tags?: ProjectTags;
}

export interface AnalyticsSummary {
  totalVisits: number;
  totalProjectViews: number;
  totalSearches: number;
  uniqueProjectsViewed: number;
  firstVisit: number;
  lastVisit: number | null;
  sessionViews: number;
}

export interface Bookmark {
  id: string;
  title: string;
  timestamp: number;
}

export interface RecentlyViewed {
  id: string;
  title: string;
  timestamp: number;
}

export interface PopularProject {
  id: string;
  views: number;
}

export interface SearchQuery {
  query: string;
  timestamp: number;
}

export interface FilterUsage {
  [key: string]: number;
}
