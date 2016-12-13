# biketrip-bw
Ionic-2 Applikation für biketrip.bw ➡️ Projektarbeit WS16/17 @ HSO

Angular 2, Ionic 2 und TypeScript Tutorials und Dokumentationen online verfügbar.

#### Voraussetzungen:
- Atom (atom.io) mit folgenden Plugins: typescript, platformio terminal
- Github Desktop
- NPM und Node.JS (nodejs.org)
- Ionic CLI: npm install -g ionic

#### Installation:
- Atom starten und Terminal öffnen. 
- Projekt von GitHub klonen (Terminal: git clone ..., oder über Github Desktop)
- In das erstellte Verzeichnis wechseln (cd ... )
- npm install ausführen, um alle Packages zu laden.
- ionic resources ausführen, um die Icons neu zu erzeugen
- ionic platform add ios, ionic platform android ausführen
- ionic build ios, oder ionic build android ausführen, um alle PlugIns korrekt zu laden.

#### Testing:
- Im Browser: ionic serve -lab
- iOS Emulator (nur unter macOS): ionic emulate ios
- Android Emulator: ionic emulate android

#### Bugs:
- Sollten die AppScripte nicht geladen werden, dann npm install @ionic/app-scripts ausführen.
- Sollte Typescript nicht geladen werden, dann npm install typescript ausführen.
- Sollte bei ionic build eine Fehlermeldung kommen, kann es helfen, wenn die Platformen (ios, android) entfernt und wieder hinzugefügt werden. Dies geschieht mit ionic platform rm ios, ionic platform rm android. Wieder hinzufügen mit "add".

