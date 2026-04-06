import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { IndexComponent } from './index/index.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { StatutComponent } from './statut/statut.component';
import { CodexComponent } from './codex/codex.component';
import { MembershipComponent } from './membership/membership.component';
import { ContactComponent } from './contact/contact.component';
import { NewsItemResolver } from 'src/services/resolvers/news-item-resolver.service';
import { AnnouncementResolver } from 'src/services/resolvers/announcement-resolver.service';

export const routes: Routes = [
  { title: "DNH", path: "", pathMatch: "full", component: IndexComponent, resolve: [NewsItemResolver, AnnouncementResolver] },
  { title: "O Društvu", path: "about", component: AboutComponent },
  { title: "Statut", path: "statut", component: StatutComponent },
  { title: "Privatnost", path: "privacy-policy", component: PrivacyComponent },
  { title: "Kodeks", path: "codex", component: CodexComponent },
  { title: "Članstvo", path: "join", component: MembershipComponent },
  { title: "Kontakt", path: "contact", component: ContactComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
