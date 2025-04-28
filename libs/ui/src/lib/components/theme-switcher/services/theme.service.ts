import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private darkTheme = new BehaviorSubject(true);

  isDarkTheme = this.darkTheme.asObservable();

  constructor() {
    const darkModeOn = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.setDarkTheme(darkModeOn);
  }

  setDarkTheme(isDarkTheme: boolean) {
    this.darkTheme.next(isDarkTheme);
    if (isDarkTheme) {
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
    }
  }
}
