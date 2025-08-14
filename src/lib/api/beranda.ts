import httpInstance from "./httpInstance";

export const getBeranda = async (): Promise<any> => {
  const response = await httpInstance.get(`/beranda`);
  return response.data;
};
