import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { NgpButton } from "ng-primitives/button";
import { NgpMenu, NgpMenuItem, NgpMenuTrigger } from "ng-primitives/menu";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Link } from "@ng-tool-collection/models";

@Component({
  selector: "lib-submenu",
  imports: [NgpButton, NgpMenu, NgpMenuItem, RouterLinkActive, NgpMenuTrigger, RouterLink],
  templateUrl: "./submenu.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmenuComponent {
  item = input.required<Link>();
}
