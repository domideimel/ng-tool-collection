import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HotToastService } from "@ngneat/hot-toast";
import { urlValidator } from "@ng-tool-collection/ui";
import { UrlRewritesService } from "../services/url-rewrites.service";
import { Meta } from "@angular/platform-browser";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "lib-url-rewrites",
  templateUrl: "./url-rewrites.component.html",
})
export class UrlRewritesComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    urlRows: this.fb.array([this.createUrlRow()]),
  });

  result = signal<string>("");

  constructor(
    private fb: FormBuilder,
    private toast: HotToastService,
    private rewriteService: UrlRewritesService,
    private meta: Meta
  ) {}

  get urlRowsFormArray() {
    return this.formGroup.get("urlRows") as FormArray;
  }

  get hasOnlyOneRow(): boolean {
    return this.urlRowsFormArray.length === 1;
  }

  ngOnInit() {
    this.meta.updateTag({
      name: "description",
      content:
        "Erstellen Sie benutzerdefinierte Weiterleitungen für Ihre URLs und Links - schnell und einfach!",
    });
  }

  addUrlRow() {
    this.urlRowsFormArray.push(this.createUrlRow());
  }

  removeUrlRow(index: number) {
    this.urlRowsFormArray.removeAt(index);
  }

  onSubmit() {
    const result = this.rewriteService.generateRewrites(this.formGroup.value);
    this.result.set(result);
  }

  async copyRewrites() {
    try {
      await navigator.clipboard.writeText(this.result());
      this.toast.success("Die Rewrites wurden erfolgreich kopiert");
    } catch (e: unknown) {
      this.toast.success("Es gab ein Fehler beim kopieren");
    }
  }

  private createUrlRow(): FormGroup {
    return this.fb.group({
      oldUrl: ["", [Validators.required, urlValidator]],
      newUrl: ["", [Validators.required, urlValidator]],
    });
  }
}
