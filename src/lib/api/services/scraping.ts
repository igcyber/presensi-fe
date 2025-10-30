import httpInstance from "@/lib/api/core/httpInstance";

export type ScrapedItem = {
  title: string;
  content: string;
  published_at?: string;
  url: string;
};

export type StartJobResponse = { taskId: string };
export type JobStatusResponse = {
  status: "pending" | "running" | "done" | "failed";
  progress?: number;
  total?: number;
  processed?: number;
  message?: string;
};
export type JobResultResponse = { data: ScrapedItem[] };

// Mulai background job scraping Warta
export const startScrapingWarta = async (): Promise<StartJobResponse> => {
  const { data } = await httpInstance.get<StartJobResponse>("/api/scraping/warta/start");
  return data;
};

// Cek status job scraping
export const getScrapingStatus = async (taskId: string): Promise<JobStatusResponse> => {
  const { data } = await httpInstance.get<JobStatusResponse>(`/api/scraping/warta/status/${taskId}`);
  return data;
};

// Ambil hasil scraping ketika job selesai
export const getScrapingResult = async (taskId: string): Promise<JobResultResponse> => {
  const { data } = await httpInstance.get<JobResultResponse>(`/api/scraping/warta/result/${taskId}`);
  return data;
};

// Commit hasil scraping terpilih menjadi Berita
export const commitScrapingResult = async (payload: { tag_id: number; data: ScrapedItem[] }): Promise<any> => {
  const { data } = await httpInstance.post<any>("/api/scraping/warta/commit", payload);
  return data;
};
