export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phoneNumber: string;
}

export interface FormErrors {
  name?: string;
  company?: string;
  email?: string;
  phoneNumber?: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface ToastMessage {
  type: 'success' | 'error';
  message: string;
}