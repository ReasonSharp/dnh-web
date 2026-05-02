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
  years: number[] = [];
  selectedYear: number | null = null;
  newYear = '';
  isNewYear = false;

  iban = '';
  swift = '';
  enrollmentEnabled = false;
  enrollmentFee = '';
  enrollmentDiscounted = '';
  admissionFormDocumentId: number | null = null;
  categories: CategoryForm[] = [];

  documents: IDocument[] = [];

  message = '';
  success = false;
  loading = true;
  configLoading = false;
  saving = false;

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    try {
      const [years, docs] = await Promise.all([
        this.dataService.readMembershipYears(),
        this.dataService.readDocuments(),
      ]);
      this.years = years;
      this.documents = docs;
    } finally {
      this.loading = false;
    }
  }

  async onYearChange(year: number | null) {
    if (year === null) return;
    this.isNewYear = false;
    this.message = '';
    await this.loadYear(year);
  }

  async loadYear(year: number) {
    this.configLoading = true;
    try {
      const config = await this.dataService.readMembershipConfig(year);
      if (config) {
        this.iban = config.iban;
        this.swift = config.swift;
        this.enrollmentEnabled = config.enrollmentFeeEnabled;
        this.enrollmentFee = config.enrollmentFee.toFixed(2);
        this.enrollmentDiscounted = config.enrollmentFeeDiscounted !== null ? config.enrollmentFeeDiscounted.toFixed(2) : '';
        this.admissionFormDocumentId = config.admissionFormDocumentId;
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
      this.message = 'Unesite ispravnu godinu (2000–2100).';
      this.success = false;
      return;
    }
    if (this.years.includes(y)) {
      this.message = 'Konfiguracija za tu godinu već postoji. Odaberite je s popisa.';
      this.success = false;
      return;
    }
    this.selectedYear = y;
    this.isNewYear = true;
    this.message = '';
    this.iban = '';
    this.swift = '';
    this.enrollmentEnabled = false;
    this.enrollmentFee = '';
    this.enrollmentDiscounted = '';
    this.admissionFormDocumentId = null;
    this.categories = [];
    this.newYear = '';
  }

  addCategory() {
    this.categories = [...this.categories, { id: 0, name: '', price: '', discountedPrice: '' }];
  }

  removeCategory(index: number) {
    this.categories = this.categories.filter((_, i) => i !== index);
  }

  async save() {
    if (this.selectedYear === null) return;
    this.message = '';

    for (const cat of this.categories) {
      if (!cat.name.trim()) {
        this.message = 'Sva polja naziva kategorije su obavezna.';
        this.success = false;
        return;
      }
      const p = parseFloat(cat.price);
      if (isNaN(p) || p < 0) {
        this.message = `Neispravna cijena za kategoriju "${cat.name}".`;
        this.success = false;
        return;
      }
      const d = cat.discountedPrice !== '' ? parseFloat(cat.discountedPrice) : null;
      if (d !== null && (isNaN(d) || d < 0 || d >= p)) {
        this.message = `Snižena cijena mora biti manja od pune cijene za kategoriju "${cat.name}".`;
        this.success = false;
        return;
      }
    }

    const ef = this.enrollmentEnabled ? parseFloat(this.enrollmentFee) : 0;
    const ed = this.enrollmentEnabled && this.enrollmentDiscounted !== '' ? parseFloat(this.enrollmentDiscounted) : null;
    if (this.enrollmentEnabled) {
      if (isNaN(ef) || ef < 0) {
        this.message = 'Neispravna cijena upisnine.';
        this.success = false;
        return;
      }
      if (ed !== null && (isNaN(ed) || ed < 0 || ed >= ef)) {
        this.message = 'Snižena cijena upisnine mora biti manja od pune cijene.';
        this.success = false;
        return;
      }
    }

    this.saving = true;
    try {
      const res = await this.dataService.saveMembershipConfig({
        year: this.selectedYear,
        iban: this.iban,
        swift: this.swift,
        enrollment_fee_enabled: this.enrollmentEnabled,
        enrollment_fee: ef,
        enrollment_fee_discounted: ed,
        admission_form_document_id: this.admissionFormDocumentId,
        categories: this.categories.map(c => ({
          name: c.name,
          price: parseFloat(c.price) || 0,
          discounted_price: c.discountedPrice !== '' ? parseFloat(c.discountedPrice) : null,
        })),
      });
      this.success = res.success;
      this.message = res.message ?? (res.success ? 'Konfiguracija uspješno spremljena.' : 'Greška pri spremanju.');
      if (res.success && this.isNewYear) {
        this.years = [...this.years, this.selectedYear].sort((a, b) => b - a);
        this.isNewYear = false;
      }
    } finally {
      this.saving = false;
    }
  }
}
