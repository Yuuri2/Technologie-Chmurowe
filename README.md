# Technologie-Chmurowe
#### Projekt aplikacji wdrążonej na Microsoft Azure

**Członkowie zespołu:**
*Adrian Torbus*
*Dawid Pytel*

Projekt zakłada stworzenie działającej w chmurze aplikacji typu lista zakupów. Aplikacja zakłada następujące funkcjonalności:  logowanie się na konto używtkownika lub stworzenie nowego, tworzenie i usuwanie list zakupów, dodawanie/usuwanie i modyfikowanie produktów na swojej liście zakupów.


**(DST)Aplikacja CRUD z wdrążeniem w chmurze z użyciem potoku CI/CD**
> CRUD - Create Read Update Delete - użytkownik ma możliwość dodawania elementów, sprawdzanie ich listy, modyfikowania jej i usuwania jej skadników.
CI/CD :
część CI - po dodaniu kodu na githuba sprawdzana jest poprawność kodu przez testy i wdrążana na serwer bez potrzeby ręcznego zatrzymywania, update'u i budowania
część CD - gdy faza CI zakończy się powodzeniem github actions loguje się poprzez bezpieczne ukryte kluczę na maszynę i updateuje i buduję aplikację o nowe funkcje

**(DST+)zachowanie bezpieczeństwa przy przesyłaniu i przechowywaniu danych(https i szyforwanie haseł)**
> Aplikacja będzie szyfrowała dane użytkowników oraz będzie działała na stronie https

**(DB)Wdrążenie w postaci maszyny wirtualnej lub kontenera Dockera**
>

**(DB+)Wdrążenie w architekturze mikrousług (min dwie komunikujące się ze sobą maszyny wirtualne lub kontenery dokera)**
>

**(BDB)Wdrążenie uzupełnione o testy jednostkowe,e2e**
>


