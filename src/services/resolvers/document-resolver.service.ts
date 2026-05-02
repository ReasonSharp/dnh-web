import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from "@angular/router";
import { IDocument } from "src/models/document.model";
import { DataService } from "../data.service";

@Injectable({ providedIn: 'root' })
export class DocumentResolver implements Resolve<IDocument[]> {
 constructor(private dataService: DataService) { }

 resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<IDocument[] | RedirectCommand> {
  return this.dataService.readDocuments();
 }
}
