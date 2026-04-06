import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from "@angular/router";
import { INewsItem } from "src/models/news-item.model";
import { DataService } from "../data.service";

@Injectable({ providedIn: 'root' })
export class NewsItemResolver implements Resolve<INewsItem[]> {
 constructor(private dataService: DataService) { }

 resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<INewsItem[] | RedirectCommand> {
  return this.dataService.readNewsItems();
 }
}