export type User = {
  _id: string;
  name: string;
  user_name: string;
  password: string;
  facility: Facility;
  token: string | null;
  status: string;
  role: "admin" | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPreview = {
  _id: string;
  name: string;
  user_name: string;
  password: string;
  facility: string | null;
  token: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FacilityPreview = {
  _id: string;
  name: string;
  phone: string;
  status: string;
  metadata: any;
  manager: null;
  createdAt: Date;
  updatedAt: Date;
};

export type Facility = {
  _id: string;
  name: string;
  phone: string;
  status: string;
  metadata: any;
  manager: User;
  createdAt: Date;
  updatedAt: Date;
};

export type DataRow = {
  [key: string]: string | number;
};

export type CustomerPreview = {
  _id?: string;
  name: string;
  phone: string;
  email: string | null;
  is_follow_oa: boolean;
  address: {
    country: string;
    province: string;
    district: string;
    town: string;
    free_note: string;
  };
  wallet: string | null;
  user: string | null;
  facilities: string[] | null;
  customer_groups: string[] | null;
  status: string;
  metadata: any;
  birth: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Customer = {
  _id: string;
  name: string;
  phone: string;
  email: string | null;
  is_follow_oa: boolean;
  address: {
    country: string;
    province: string;
    district: string;
    town: string;
    free_note: string;
  };
  wallet: Wallet;
  user: User;
  facilities: Facility[];
  customer_groups: CustomerGroup[];
  status: string;
  metadata: any;
  birth: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CampaignResult = {
  _id: string;
  name: string;
  phone: string;
  template: string;
  status: string;
  campaign_name: string;
  campaign_id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerGroupPreview = {
  _id: string;
  name: string;
  slug: string;
  count: number;
  user: string | null;
  facility: string | null;
  status: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerGroup = {
  _id: string;
  name: string;
  slug: string;
  count: number;
  user: UserPreview | null;
  facility: FacilityPreview | null;
  status: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type WalletPreview = {
  _id: string;
  status: string;
  metadata: any;
  customer: string;
  current_balance: number;
  user: string | null;
  facility: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Wallet = {
  _id: string;
  status: string;
  metadata: any;
  customer: CustomerPreview;
  user: UserPreview | null;
  facility: FacilityPreview | null;
  current_balance: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  _id: string;
  name: string;
  type: string;
  description: string;
  short_description: string;
  status: string;
  price: {
    member: {
      original: Number;
      promotional: Number;
    };
    normal: {
      original: Number;
      promotional: Number;
    };
  };
  metadata: any;
  facilities: Facility[];
  descriptions: string;
  categories: ProductCategory[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductCategory = {
  _id: string;
  name: string;
  slug: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Transaction = {
  _id: string;
  title: string;
  note: string;
  wallet: Wallet;
  customer: Customer;
  facility: Facility | null;
  user: UserPreview | null;
  transaction_form: TransactionForm;
  value: number;
  discount: number;
  transaction_type: TransactionType;
  status: string;
  metadata: any;
  previous_balance: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionPreview = {
  _id: string;
  title: string;
  note: string;
  wallet: WalletPreview;
  customer: CustomerPreview;
  facility: string | null;
  user: string | null;
  transaction_form: string;
  value: Number;
  transaction_type: string;
  status: string;
  metadata: any;
  previous_balance: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionType = {
  _id: string;
  name: string;
  description: string;
  value: number;
  status: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
};

export type CampaignPreview = {
  _id: string;
  name: string;
  description: string;
  status: string;
  startAt: Date | string;
  customer_groups: string[];
  createdAt: Date;
  updateAt?: Date;
  template: string;
};

export type CustomerResults = {
  _id: string;
  template: ZaloTemplate;
  name: string;
  phone: string;
  status: string;
  createdAt: Date;
};
export type Campaign = {
  _id: string;
  name: string;
  description: string;
  status: string;
  startAt: Date | string;
  customer_groups: CustomerGroup[];
  createdAt: Date;
  updateAt?: Date;
  template: ZaloTemplate;
  customer_results?: CustomerResults[];
};

export type ZaloTemplates = {
  templateId: string;
  templateName: string;
  createdTime: string;
  status: string;
  templateQuality: string;
};
export type ZaloTemplate = {
  templateId: string;
  templateName: string;
  status: string;
  templateQuality: string;
  previewUrl: string;
};

export type TransactionForm = {
  _id: string;
  name: string;
  qrcode: string;
  status: string;
  metadata: any;
  createdAt: Date;
  updateAt?: Date;
};

export type OaInfo = {
  oa_id: string;
  name: string;
  description: string;
  is_verified: boolean;
  oa_type: number;
  cate_name: string;
  num_follower: number;
  avatar: string;
  cover: string;
  package_name: string;
  package_valid_through_date: string;
  package_auto_renew_date: string;
  linked_zca: string;
};

export type UserOa = {
  user_id: string;
};

export type UsersOa = {
  total: number;
  count: number;
  offset: number;
  users: UserOa[];
};
