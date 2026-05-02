import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from 'src/services/data.service';

interface ItemForm {
  value: string;
  link: string;
}

interface CategoryForm {
  title: string;
  items: ItemForm[];
}

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss',
})
export class EditContactComponent implements OnInit {
  categories: CategoryForm[] = [];
  loading = true;
  saving = false;
  message = '';
  success = false;

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    try {
      const data = await this.dataService.readContactInfo();
      this.categories = data.map(cat => ({
        title: cat.title,
        items: cat.items.map(item => ({ value: item.value, link: item.link ?? '' })),
      }));
    } finally {
      this.loading = false;
    }
  }

  addCategory() {
    this.categories = [...this.categories, { title: '', items: [] }];
  }

  removeCategory(ci: number) {
    this.categories = this.categories.filter((_, i) => i !== ci);
  }

  moveCatUp(ci: number) {
    if (ci <= 0) return;
    const next = [...this.categories];
    [next[ci - 1], next[ci]] = [next[ci], next[ci - 1]];
    this.categories = next;
  }

  moveCatDown(ci: number) {
    if (ci >= this.categories.length - 1) return;
    const next = [...this.categories];
    [next[ci + 1], next[ci]] = [next[ci], next[ci + 1]];
    this.categories = next;
  }

  addItem(ci: number) {
    const next = [...this.categories];
    next[ci] = { ...next[ci], items: [...next[ci].items, { value: '', link: '' }] };
    this.categories = next;
  }

  removeItem(ci: number, ii: number) {
    const next = [...this.categories];
    next[ci] = { ...next[ci], items: next[ci].items.filter((_, i) => i !== ii) };
    this.categories = next;
  }

  moveItemUp(ci: number, ii: number) {
    if (ii <= 0) return;
    const items = [...this.categories[ci].items];
    [items[ii - 1], items[ii]] = [items[ii], items[ii - 1]];
    const next = [...this.categories];
    next[ci] = { ...next[ci], items };
    this.categories = next;
  }

  moveItemDown(ci: number, ii: number) {
    if (ii >= this.categories[ci].items.length - 1) return;
    const items = [...this.categories[ci].items];
    [items[ii + 1], items[ii]] = [items[ii], items[ii + 1]];
    const next = [...this.categories];
    next[ci] = { ...next[ci], items };
    this.categories = next;
  }

  async save() {
    this.message = '';
    for (const cat of this.categories) {
      if (!cat.title.trim()) {
        this.message = 'Svaka kategorija mora imati naslov.';
        this.success = false;
        return;
      }
      for (const item of cat.items) {
        if (!item.value.trim()) {
          this.message = 'Sve stavke moraju imati vrijednost.';
          this.success = false;
          return;
        }
      }
    }

    this.saving = true;
    try {
      const res = await this.dataService.saveContactInfo(
        this.categories.map(cat => ({
          title: cat.title,
          items: cat.items.map(item => ({
            value: item.value,
            link: item.link.trim() || null,
          })),
        }))
      );
      this.success = res.success;
      this.message = res.message ?? (res.success ? 'Kontakt podaci uspješno spremljeni.' : 'Greška pri spremanju.');
    } finally {
      this.saving = false;
    }
  }
}
