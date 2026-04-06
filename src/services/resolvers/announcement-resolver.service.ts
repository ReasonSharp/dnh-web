import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from "@angular/router";
import { IAnnouncement } from "src/models/announcement.model";
import { DataService } from "../data.service";

@Injectable({ providedIn: 'root' })
export class AnnouncementResolver implements Resolve<IAnnouncement[]> {
 constructor(private dataService: DataService) { }

 resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<IAnnouncement[] | RedirectCommand> {
  return this.dataService.readAnnouncements();
 }
}