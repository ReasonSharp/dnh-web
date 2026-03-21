import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-index',
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
 newsItems = [
  { date: "7. ožujka, 2026.", blurb: "Održana redovna sjednica DNH u starom prostoru kod Martinovke.", imageURL: "/assets/skupstina.jpg" },
  { date: "7. prosinca, 2025.", blurb: "Novo druženje u saunama spa & wellness hotela Paradiso.", imageURL: "/assets/paradiso2.jpg" },
  { date: "8. studenoga, 2025.", blurb: "Druženje u saunama spa & wellness hotela Paradiso.", imageURL: "/assets/paradiso.jpg" },
  { date: "2. - 5. listopada, 2025.", blurb: "DNH sudjelovao na sastanku EuNat-a.", imageURL: "/assets/eunat.jpg" },
  { date: "6. rujna, 2025.", blurb: "Proslavljen dan naturizma na Jarunu.", imageURL: "/assets/jarun.jpg" }
];
}
