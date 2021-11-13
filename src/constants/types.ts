export type OptionType = {
  value: string;
  label: string;
};

export type SignUpForms = {
  firstName: string;
  lastName: string;
  firstKana: string;
  lastKana: string;
  email: string;
  phoneNumber: string;
  university: string;
  department: string;
  club: string;
  important: OptionType[];
  industries: OptionType[];
  occupations: OptionType[];
  locations: OptionType[];
  advantages: OptionType[];
  comment: string;
  password: string;
  confirmPassword: string;
};

export type EditForms = Omit<
  SignUpForms,
  "email" | "phoneNumber" | "password" | "confirmPassword"
>;

export type Notice = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
};

export type CompanyInit = {
  industry: OptionType;
  occupations: OptionType[];
  corporateUrl: string;
  recruitUrl: string;
};

export type Student = {
  uid: string;
  firstName: string;
  lastName: string;
  firstKana: string;
  lastKana: string;
  university: string;
  department: string;
  club: string;
  important: string[];
  industries: string[];
  occupations: string[];
  locations: string[];
  advantages: string[];
  comment: string;
  vimeoUrl: string;
  thumbnailUrl: string;
};

export type Company = {
  id: string;
  name: string;
  email: string;
  industry: string;
  occupations: string[];
  corporateUrl: string;
  recruitUrl: string;
};

// Admin //
type UserInfo = {
  studentId: string;
  studentName: string;
};

export type Reservation = UserInfo & {
  firstChoice: string;
  secondChoice: string;
  thirdChoice: string;
  created_at: any;
};

export type Schedule = UserInfo & {
  date: any;
  staff: string;
};

export type VimeoUser = UserInfo & {
  condition: string;
};

export type AdminStudent = Student & {
  email: string;
  phoneNumber: string;
  condition: string;
  created_at: any;
};

export type AdminCompany = Company & {
  password: string;
  condition: string;
  created_at: any;
};
