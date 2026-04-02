export type ApiSuccessResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  message: string;
};
