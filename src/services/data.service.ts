import { Injectable } from "@angular/core";
import { IAnnouncement } from "src/models/announcement.model";
import { INewsItem } from "src/models/news-item.model";

@Injectable({ providedIn: 'root' })
export class DataService {
 newsItems: INewsItem[] = [
  { date: "26. ožujka, 2026.", blurb: "Pogledajte novi video Nick&Lins o hrvatskim naturističkim plažama.", imageURL: "/assets/nicklins.png", link: "https://www.youtube.com/watch?v=deMVuzba9lI" },
  { date: "7. ožujka, 2026.", blurb: "Održana redovna sjednica DNH u starom prostoru kod Martinovke.", imageURL: "/assets/skupstina.jpg" },
  { date: "7. prosinca, 2025.", blurb: "Novo druženje u saunama spa & wellness hotela Paradiso.", imageURL: "/assets/paradiso2.jpg" },
  { date: "8. studenoga, 2025.", blurb: "Druženje u saunama spa & wellness hotela Paradiso.", imageURL: "/assets/paradiso.jpg" },
  { date: "2. - 5. listopada, 2025.", blurb: "DNH sudjelovao na sastanku EuNat-a.", imageURL: "/assets/eunat.jpg" },
  { date: "6. rujna, 2025.", blurb: "Proslavljen dan naturizma na Jarunu.", imageURL: "/assets/jarun.jpg" }
 ];

 announcements: IAnnouncement[] = [
  { date: "5. travnja, 2026.", blurb: "Druženje mladih od 27. lipnja do 1. srpnja u Gironi.", imageURL: "/assets/youth-gathering.png", link: "https://fienta.com/inf-fni-2024-international-naturist-youth-gathering-171864?fbclid=IwT01FWAQta6lleHRuA2FlbQIxMABzcnRjBmFwcF9pZAwzNTA2ODU1MzE3MjgAAR6HARG-j_VOoJJF5HD1djBdQy-eG_Aq5P1wIsf0tlVQ4U7EynGW7g3qzBkujg_aem_oJL9dgiZvTI9YaD0FVG-hg" },
 ];
}