import { Link } from '@ng-tool-collection/models';
import { $localize } from '@angular/localize/init';

export const NAVIGATION: Link[] = [
  {
    label: $localize`Passwort Generator`,
    path: 'tools/password-generator',
    description: $localize`Entdecken Sie unseren Passwort-Generator, der robuste und sichere Passwörter erstellt, die schwer zu knacken sind. Mit zufällig generierten Kombinationen aus Buchstaben, Zahlen und Sonderzeichen gewährleisten wir höchste Sicherheit für Ihre Online-Konten. Steigern Sie Ihre digitale Sicherheit, indem Sie einzigartige Passwörter für jeden Account erstellen.`,
  },
  {
    label: $localize`Url Rewrites`,
    path: 'tools/url-rewrites',
    description: $localize`Erstellen Sie Weiterleitungen für Ihre URLs und Links. Generieren Sie kurze, benutzerdefinierte URLs, die sich leicht merken und teilen lassen. Mit unserem Weiterleitungs-Generator können Sie lange, komplexe URLs in kurze, benutzerfreundliche Links umwandeln.`,
  },
];
