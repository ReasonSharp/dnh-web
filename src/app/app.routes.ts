import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { IndexComponent } from './index/index.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { StatutComponent } from './statut/statut.component';
import { CodexComponent } from './codex/codex.component';
import { MembershipComponent } from './membership/membership.component';
import { ContactComponent } from './contact/contact.component';
import { AdminComponent } from './admin/admin.component';
import { ChangePasswordComponent } from './admin/change-password/change-password.component';
import { UploadImageComponent } from './admin/upload-image/upload-image.component';
import { UploadDocumentComponent } from './admin/upload-document/upload-document.component';
import { LogoutComponent } from './admin/logout/logout.component';
import { EditDetailsComponent } from './admin/edit-details/edit-details.component';
import { CreateNewsComponent } from './admin/create-news/create-news.component';
import { CreateAnnouncementComponent } from './admin/create-announcement/create-announcement.component';
import { EditNewsComponent } from './admin/edit-news/edit-news.component';
import { EditAnnouncementComponent } from './admin/edit-announcement/edit-announcement.component';
import { EditContactComponent } from './admin/edit-contact/edit-contact.component';
import { EditMembershipComponent } from './admin/edit-membership/edit-membership.component';
import { EditStatutesComponent } from './admin/edit-statutes/edit-statutes.component';
import { NewsItemResolver } from 'src/services/resolvers/news-item-resolver.service';
import { AnnouncementResolver } from 'src/services/resolvers/announcement-resolver.service';
import { DocumentResolver } from 'src/services/resolvers/document-resolver.service';
import { StatuteResolver } from 'src/services/resolvers/statute-resolver.service';

export const routes: Routes = [
  { title: "DNH", path: "", pathMatch: "full", component: IndexComponent, resolve: [NewsItemResolver, AnnouncementResolver] },
  { title: "O Društvu", path: "about", component: AboutComponent },
  { title: "Statut", path: "statut", component: StatutComponent, resolve: [StatuteResolver] },
  { title: "Privatnost", path: "privacy-policy", component: PrivacyComponent },
  { title: "Kodeks", path: "codex", component: CodexComponent },
  { title: "Članstvo", path: "join", component: MembershipComponent },
  { title: "Kontakt", path: "contact", component: ContactComponent },
  {
    title: "Admin", path: "admin", component: AdminComponent,
    children: [
      { path: '', redirectTo: 'upload', pathMatch: 'full' },
      { path: 'upload', component: UploadImageComponent },
      { path: 'upload-document', component: UploadDocumentComponent },
      { path: 'edit-statutes', component: EditStatutesComponent, resolve: [DocumentResolver, StatuteResolver] },
      { path: 'edit-membership', component: EditMembershipComponent },
      { path: 'edit-contact', component: EditContactComponent },
      { path: 'create-news', component: CreateNewsComponent },
      { path: 'create-announcement', component: CreateAnnouncementComponent },
      { path: 'edit-news', component: EditNewsComponent },
      { path: 'edit-announcement', component: EditAnnouncementComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'edit-details', component: EditDetailsComponent },
      { path: 'logout', component: LogoutComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
