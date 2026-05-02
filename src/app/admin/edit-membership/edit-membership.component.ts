import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from 'src/services/data.service';
import { IDocument } from 'src/models/document.model';

interface CategoryForm {
  id: number;
  name: string;
  price: string;
  discountedPrice: string;
}

@Component({
  selector: 'app-edit-membership',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-membership.component.html',
  styleUrl: './edit-membership.component.scss',
})
export class EditMembershipComponent implements OnInit {
  documents: IDocument[] = [];
  loading = true;

  // Payment settings section
  iban = '';
  swift = '';
  admissionFormDocumentId: number | null = null;
  savingPayment = false;
  paymentMessage = '';
  paymentSuccess = false;

  // Year fees section
  years: number[] = [];
  selectedYear: number | null = null;
  newYear = '';
  isNewYear = false;
  enrollmentEnabled = false;
  enrollmentFee = '';
  enrollmentDiscounted = '';
  categories: CategoryForm[] = [];
  configLoading = false;
  savingFees = false;
  feesMessage = '';
  feesSuccess = false;

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    try {
      const [payment, years, docs] = await Promise.all([
        this.dataService.readPaymentSettings(),
        this.dataService.readMembershipYears(),
        this.dataService.readDocuments(),
      ]);
      this.iban = payment.iban;
      this.swift = payment.swift;
      this.admissionFormDocumentId = payment.admissionFormDocumentId;
      this.years = years;
      this.documents = docs;
    } finally {
      this.loading = false;
    }
  }

  async savePayment() {
    this.paymentMessage = '';
    this.savingPayment = true;
    try {
      const res = await this.dataService.savePaymentSettings({
        iban: this.iban,
        swift: this.swift,
        admission_form_document_id: this.admissionFormDocumentId,
      });
      this.paymentSuccess = res.success;
      this.paymentMessage = res.message ?? (res.success ? 'Podaci za uplatu uspješno spremljeni.' : 'Greška pri spremanju.');
    } finally {
      this.savingPayment = false;
    }
  }

  async onYearChange(year: number | null) {
    if (year === null) return;
    this.isNewYear = false;
    this.feesMessage = '';
    await this.loadYear(year);
  }

  async loadYear(year: number) {
    this.configLoading = true;
    try {
      const config = await this.dataService.readMembershipConfig(year);
      if (config) {
        this.enrollmentEnabled = config.enrollmentFeeEnabled;
        this.enrollmentFee = config.enrollmentFee.toFixed(2);
        this.enrollmentDiscounted = config.enrollmentFeeDiscounted !== null ? config.enrollmentFeeDiscounted.toFixed(2) : '';
        this.categories = config.categories.map(c => ({
          id: c.id,
          name: c.name,
          price: c.price.toFixed(2),
          discountedPrice: c.discountedPrice !== null ? c.discountedPrice.toFixed(2) : '',
        }));
      }
    } finally {
      this.configLoading = false;
    }
  }

  addNewYear() {
    const y = parseInt(this.newYear, 10);
    if (!y || y < 2000 || y > 2100) {
      this.feesMessage = 'Unesite ispravnu godinu (2000–2100).';
      this.feesSuccess = false;
      return;
    }
    if (this.years.includes(y)) {
      this.feesMessage = 'Konfiguracija za tu godinu već postoji. Odaberite je s popisa.';
      this.feesSuccess = false;
      return;
    }
    this.selectedYear = y;
    this.isNewYear = true;
    this.feesMessage = '';
    this.enrollmentEnabled = false;
    this.enrollmentFee = '';
    this.enrollmentDiscounted = '';
    this.categories = [];
    this.newYear = '';
  }

  addCategory() {
    this.categories = [...this.categories, { id: 0, name: '', price: '', discountedPrice: '' }];
  }

  removeCategory(index: number) {
    this.categories = this.categories.filter((_, i) => i !== index);
  }

  async saveFees() {
    if (this.selectedYear === null) return;
    this.feesMessage = '';

    for (const cat of this.categories) {
      if (!cat.name.trim()) {
        this.feesMessage = 'Sva polja naziva kategorije su obavezna.';
        this.feesSuccess = false;
        return;
      }
      const p = parseFloat(cat.price);
      if (isNaN(p) || p < 0) {
        this.feesMessage = `Neispravna cijena za kategoriju "${cat.name}".`;
        this.feesSuccess = false;
        return;
      }
      const d = (cat.discountedPrice != null && cat.discountedPrice !== '') ? parseFloat(String(cat.discountedPrice)) : null;
      if (d !== null && (d < 0 || d >= p)) {
        this.feesMessage = `Snižena cijena mora biti manja od pune cijene za kategoriju "${cat.name}".`;
        this.feesSuccess = false;
        return;
      }
    }

    const ef = this.enrollmentEnabled ? parseFloat(this.enrollmentFee) : 0;
    const ed = (this.enrollmentEnabled && this.enrollmentDiscounted != null && this.enrollmentDiscounted !== '') ? parseFloat(String(this.enrollmentDiscounted)) : null;
    if (this.enrollmentEnabled) {
      if (isNaN(ef) || ef < 0) {
        this.feesMessage = 'Neispravna cijena upisnine.';
        this.feesSuccess = false;
        return;
      }
      if (ed !== null && (ed < 0 || ed >= ef)) {
        this.feesMessage = 'Snižena cijena upisnine mora biti manja od pune cijene.';
        this.feesSuccess = false;
        return;
      }
    }

    this.savingFees = true;
    try {
      const res = await this.dataService.saveMembershipConfig({
        year: this.selectedYear,
        enrollment_fee_enabled: this.enrollmentEnabled,
        enrollment_fee: ef,
        enrollment_fee_discounted: ed,
        categories: this.categories.map(c => ({
          name: c.name,
          price: parseFloat(c.price) || 0,
          discounted_price: (c.discountedPrice != null && c.discountedPrice !== '') ? parseFloat(String(c.discountedPrice)) : null,
        })),
      });
      this.feesSuccess = res.success;
      this.feesMessage = res.message ?? (res.success ? 'Konfiguracija uspješno spremljena.' : 'Greška pri spremanju.');
      if (res.success && this.isNewYear) {
        this.years = [...this.years, this.selectedYear].sort((a, b) => b - a);
        this.isNewYear = false;
      }
    } finally {
      this.savingFees = false;
    }
  }
}
