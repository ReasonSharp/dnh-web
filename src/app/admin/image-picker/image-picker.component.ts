import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ImageItem {
  imageID: number;
  url: string;
}

@Component({
  selector: 'app-image-picker',
  standalone: true,
  imports: [],
  templateUrl: './image-picker.component.html',
  styleUrl: './image-picker.component.scss'
})
export class ImagePickerComponent implements OnInit {
  @Input() selectedUrl = '';
  @Output() selectedUrlChange = new EventEmitter<string>();

  images: ImageItem[] = [];
  page = 1;
  totalPages = 1;
  loading = false;
  ratioError = '';

  constructor(private http: HttpClient) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.ratioError = '';
    this.http.get<{ success: boolean; images: ImageItem[]; total: number }>(
      `/api/images.php?page=${this.page}`, { withCredentials: true }
    ).subscribe({
      next: res => {
        this.images = res.images;
        this.totalPages = Math.ceil(res.total / 10) || 1;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  select(url: string) {
    this.ratioError = '';
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (Math.abs(ratio - 16 / 9) > 0.05) {
        this.ratioError = 'Odabrana slika nije omjera 16:9. Molimo odaberite drugu sliku.';
        return;
      }
      this.selectedUrl = url;
      this.selectedUrlChange.emit(url);
    };
    img.src = url;
  }

  prev() { if (this.page > 1)              { this.page--; this.load(); } }
  next() { if (this.page < this.totalPages) { this.page++; this.load(); } }
}
