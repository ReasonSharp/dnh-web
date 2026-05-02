export interface IMembershipCategory {
  id: number;
  name: string;
  price: number;
  discountedPrice: number | null;
  displayOrder: number;
}

export interface IMembershipConfig {
  year: number;
  iban: string;
  swift: string;
  enrollmentFeeEnabled: boolean;
  enrollmentFee: number;
  enrollmentFeeDiscounted: number | null;
  admissionFormUrl: string | null;
  admissionFormDocumentId: number | null;
  categories: IMembershipCategory[];
}
