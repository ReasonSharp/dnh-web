export interface IMembershipCategory {
  id: number;
  name: string;
  price: number;
  discountedPrice: number | null;
  displayOrder: number;
}

export interface IMembershipConfig {
  year: number;
  enrollmentFeeEnabled: boolean;
  enrollmentFee: number;
  enrollmentFeeDiscounted: number | null;
  categories: IMembershipCategory[];
}

export interface IPaymentSettings {
  iban: string;
  swift: string;
  admissionFormUrl: string | null;
  admissionFormDocumentId: number | null;
}
