import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";
import { Link } from "@ng-tool-collection/models";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "lib-navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
  title = input("Tool Collection");
  links = input.required<Link[]>();
  openNavbar = model<boolean | null>();

  onOpenClick() {
    if (this.openNavbar()) {
      this.openNavbar.set(false);
      return;
    }
    this.openNavbar.set(true);
  }
}
