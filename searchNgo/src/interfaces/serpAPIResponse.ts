interface ApiResponse {
  jobs_results: JobResult[];
  search_parameters: {
    q: string;
    engine: string;
    location_requested: string;
    location_used: string;
    google_domain: string;
    hl: string;
  };
}

interface JobResult {
  title: string;
  company_name: string;
  location: string;
}
