export interface CropListing {
  id: string;
  name: string;
  farm: string;
  region: string;
  country: string;
  postedTime: string;
  price: number;
  priceUnit: string;
  priceChange: number;
  image: string;
  grade: string;
}

export interface CropDetails extends CropListing {
  origin: string;
  available: string;
  images: string[];
  seller: {
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
  };
  specifications: {
    label: string;
    value: string;
  }[];
  description: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'sale';
  title: string;
  date: string;
  amount: number;
}

export interface UserProfile {
  name: string;
  title: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  farm: {
    name: string;
    reg: string;
    crops: string;
  };
}

export interface AppData {
    marketListings: CropListing[];
    cropDetails: { [key: string]: CropDetails };
    userProfile: UserProfile;
    wallet: {
        balance: number;
        transactions: Transaction[];
    };
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export interface PriceAlert {
  cropId: string;
  cropName: string;
  targetPrice: number;
  condition: 'above' | 'below';
}