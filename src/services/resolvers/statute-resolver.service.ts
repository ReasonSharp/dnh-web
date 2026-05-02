import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from "@angular/router";
import { IStatute } from "src/models/statute.model";
import { DataService } from "../data.service";

@Injectable({ providedIn: 'root' })
export class StatuteResolver implements Resolve<IStatute[]> {
 constructor(private dataService: DataService) { }

 resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<IStatute[] | RedirectCommand> {
  return this.dataService.readStatutes();
 }
}
